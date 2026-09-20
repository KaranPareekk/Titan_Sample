export interface ExecutionResult {
  stdout: string[];
  stderr: string[];
  executionTimeMs: number;
  success: boolean;
  executedLines: number[];
}

export type InputPromptFn = (promptText?: string) => Promise<string>;
export type OutputLogFn = (line: string, isError?: boolean) => void;

export class StdinBuffer {
  private raw: string;
  private cursor: number = 0;

  constructor(rawInput: string) {
    this.raw = (rawInput ?? '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  }

  nextLine(): string {
    if (this.cursor >= this.raw.length) {
      return '';
    }
    const newlineIdx = this.raw.indexOf('\n', this.cursor);
    let line: string;
    if (newlineIdx === -1) {
      line = this.raw.slice(this.cursor);
      this.cursor = this.raw.length;
    } else {
      line = this.raw.slice(this.cursor, newlineIdx);
      this.cursor = newlineIdx + 1;
    }
    return line;
  }

  next(): string {
    while (this.cursor < this.raw.length && /\s/.test(this.raw[this.cursor])) {
      this.cursor++;
    }
    if (this.cursor >= this.raw.length) {
      return '';
    }
    const start = this.cursor;
    while (this.cursor < this.raw.length && !/\s/.test(this.raw[this.cursor])) {
      this.cursor++;
    }
    return this.raw.slice(start, this.cursor);
  }

  nextInt(): number {
    const token = this.next();
    const val = parseInt(token, 10);
    return isNaN(val) ? 0 : val;
  }

  nextDouble(): number {
    const token = this.next();
    const val = parseFloat(token);
    return isNaN(val) ? 0.0 : val;
  }

  nextBoolean(): boolean {
    const token = this.next().toLowerCase();
    return token === 'true';
  }

  hasNext(): boolean {
    let p = this.cursor;
    while (p < this.raw.length && /\s/.test(this.raw[p])) {
      p++;
    }
    return p < this.raw.length;
  }

  hasNextLine(): boolean {
    return this.cursor < this.raw.length;
  }
}

// Execute JavaScript in real browser environment with interactive on-demand input
export async function runJavaScript(
  code: string,
  onPrompt?: InputPromptFn,
  onOutput?: OutputLogFn,
  fallbackStdin: string = ''
): Promise<ExecutionResult> {
  const startTime = performance.now();
  const stdout: string[] = [];
  const stderr: string[] = [];
  const executedLines: number[] = [];

  const stdin = new StdinBuffer(fallbackStdin);

  const requestInput = async (promptMsg?: string): Promise<string> => {
    if (onPrompt) {
      return await onPrompt(promptMsg || '[INPUT REQUIRED] > ');
    }
    return stdin.nextLine();
  };

  // Expose TITAN runtime object
  const TITAN = {
    input: async (promptMsg?: string) => await requestInput(promptMsg),
    nextInt: async (promptMsg?: string) => {
      const val = await requestInput(promptMsg || '[INPUT REQUIRED (Int)] > ');
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? 0 : parsed;
    },
    nextDouble: async (promptMsg?: string) => {
      const val = await requestInput(promptMsg || '[INPUT REQUIRED (Float)] > ');
      const parsed = parseFloat(val);
      return isNaN(parsed) ? 0 : parsed;
    },
    next: async () => await requestInput(),
  };

  try {
    const customLog = (...args: any[]) => {
      const line = args
        .map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
        .join(' ');
      stdout.push(line);
      if (onOutput) onOutput(line, false);
    };

    const customError = (...args: any[]) => {
      const line = args.map((a) => String(a)).join(' ');
      stderr.push(line);
      if (onOutput) onOutput(line, true);
    };

    const promptWrapper = async (msg?: string) => await requestInput(msg);

    // Support async user code by wrapping in async IIFE
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    const runner = new AsyncFunction('console', 'TITAN', 'prompt', code);
    await runner(
      { log: customLog, error: customError, warn: customLog, info: customLog },
      TITAN,
      promptWrapper
    );

    const endTime = performance.now();
    return {
      stdout,
      stderr,
      executionTimeMs: Math.round((endTime - startTime) * 10) / 10,
      success: stderr.length === 0,
      executedLines,
    };
  } catch (err: any) {
    const endTime = performance.now();
    const errMsg = `RuntimeError: ${err.message}`;
    stderr.push(errMsg);
    if (onOutput) onOutput(errMsg, true);
    return {
      stdout,
      stderr,
      executionTimeMs: Math.round((endTime - startTime) * 10) / 10,
      success: false,
      executedLines,
    };
  }
}

// Interactive Educational Python Interpreter with On-Demand input() Prompting
export async function runPython(
  code: string,
  onPrompt?: InputPromptFn,
  onOutput?: OutputLogFn,
  fallbackStdin: string = ''
): Promise<ExecutionResult> {
  const startTime = performance.now();
  const stdout: string[] = [];
  const stderr: string[] = [];
  const executedLines: number[] = [];

  const stdin = new StdinBuffer(fallbackStdin);
  const lines = code.split(/\r?\n/);
  const vars: Record<string, any> = {};

  const emitLog = (line: string) => {
    stdout.push(line);
    if (onOutput) onOutput(line, false);
  };

  try {
    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i];
      const trimmed = rawLine.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      executedLines.push(i + 1);

      // Print statement
      if (trimmed.startsWith('print(') && trimmed.endsWith(')')) {
        const inner = trimmed.substring(6, trimmed.length - 1);
        const parts = parseArgList(inner);
        const evaluated: string[] = [];
        for (const p of parts) {
          const v = await evalExprAsync(p, vars, stdin, onPrompt);
          evaluated.push(typeof v === 'object' ? JSON.stringify(v) : String(v));
        }
        emitLog(evaluated.join(' '));
        continue;
      }

      // Variable assignment: e.g. x = int(input()) or arr = [1, 2]
      if (trimmed.includes('=') && !trimmed.startsWith('if') && !trimmed.startsWith('for')) {
        const eqIdx = trimmed.indexOf('=');
        const varName = trimmed.substring(0, eqIdx).trim();
        const expr = trimmed.substring(eqIdx + 1).trim();

        vars[varName] = await evalExprAsync(expr, vars, stdin, onPrompt);
        continue;
      }

      // Array method: e.g. nums.append(val) or nums.reverse()
      if (trimmed.includes('.append(')) {
        const dotIdx = trimmed.indexOf('.append(');
        const arrName = trimmed.substring(0, dotIdx).trim();
        const arg = trimmed.substring(dotIdx + 8, trimmed.length - 1).trim();
        if (Array.isArray(vars[arrName])) {
          vars[arrName].push(await evalExprAsync(arg, vars, stdin, onPrompt));
        }
        continue;
      }

      if (trimmed.includes('.reverse()')) {
        const dotIdx = trimmed.indexOf('.reverse()');
        const arrName = trimmed.substring(0, dotIdx).trim();
        if (Array.isArray(vars[arrName])) {
          vars[arrName].reverse();
        }
        continue;
      }

      // For loop: for i in range(...):
      if (trimmed.startsWith('for ') && trimmed.includes(' in range(')) {
        const match = trimmed.match(/for\s+(\w+)\s+in\s+range\(([^)]+)\):/);
        if (match) {
          const iterVar = match[1];
          const rawArgs = parseArgList(match[2]);
          let start = 0;
          let stop = 0;
          let step = 1;

          if (rawArgs.length === 1) {
            stop = Number(await evalExprAsync(rawArgs[0], vars, stdin, onPrompt));
          } else if (rawArgs.length === 2) {
            start = Number(await evalExprAsync(rawArgs[0], vars, stdin, onPrompt));
            stop = Number(await evalExprAsync(rawArgs[1], vars, stdin, onPrompt));
          } else if (rawArgs.length >= 3) {
            start = Number(await evalExprAsync(rawArgs[0], vars, stdin, onPrompt));
            stop = Number(await evalExprAsync(rawArgs[1], vars, stdin, onPrompt));
            step = Number(await evalExprAsync(rawArgs[2], vars, stdin, onPrompt)) || 1;
          }

          // Collect body lines (indented lines following)
          const bodyLines: string[] = [];
          let j = i + 1;
          while (j < lines.length && (lines[j].startsWith('    ') || lines[j].startsWith('\t'))) {
            bodyLines.push(lines[j].trim());
            j++;
          }

          if (!isNaN(start) && !isNaN(stop) && !isNaN(step) && step !== 0) {
            if (step > 0) {
              for (let k = start; k < stop; k += step) {
                vars[iterVar] = k;
                for (const bLine of bodyLines) {
                  await executePythonStatementAsync(bLine, vars, stdin, emitLog, onPrompt);
                }
              }
            } else {
              for (let k = start; k > stop; k += step) {
                vars[iterVar] = k;
                for (const bLine of bodyLines) {
                  await executePythonStatementAsync(bLine, vars, stdin, emitLog, onPrompt);
                }
              }
            }
          }
          i = j - 1;
          continue;
        }
      }
    }

    const endTime = performance.now();
    return {
      stdout,
      stderr,
      executionTimeMs: Math.round((endTime - startTime) * 10) / 10,
      success: true,
      executedLines,
    };
  } catch (err: any) {
    const endTime = performance.now();
    const errMsg = `PythonRuntimeError: ${err.message}`;
    stderr.push(errMsg);
    if (onOutput) onOutput(errMsg, true);
    return {
      stdout,
      stderr,
      executionTimeMs: Math.round((endTime - startTime) * 10) / 10,
      success: false,
      executedLines,
    };
  }
}

async function executePythonStatementAsync(
  trimmed: string,
  vars: Record<string, any>,
  stdin: StdinBuffer,
  emitLog: (l: string) => void,
  onPrompt?: InputPromptFn
) {
  if (trimmed.startsWith('print(') && trimmed.endsWith(')')) {
    const inner = trimmed.substring(6, trimmed.length - 1);
    const parts = parseArgList(inner);
    const evaluated: string[] = [];
    for (const p of parts) {
      const val = await evalExprAsync(p, vars, stdin, onPrompt);
      evaluated.push(typeof val === 'object' ? JSON.stringify(val) : String(val));
    }
    emitLog(evaluated.join(' '));
    return;
  }
  if (trimmed.includes('=') && !trimmed.startsWith('if') && !trimmed.startsWith('for')) {
    const eqIdx = trimmed.indexOf('=');
    const varName = trimmed.substring(0, eqIdx).trim();
    const expr = trimmed.substring(eqIdx + 1).trim();
    vars[varName] = await evalExprAsync(expr, vars, stdin, onPrompt);
    return;
  }
  if (trimmed.includes('.append(')) {
    const dotIdx = trimmed.indexOf('.append(');
    const arrName = trimmed.substring(0, dotIdx).trim();
    const arg = trimmed.substring(dotIdx + 8, trimmed.length - 1).trim();
    if (Array.isArray(vars[arrName])) {
      vars[arrName].push(await evalExprAsync(arg, vars, stdin, onPrompt));
    }
  }
}

async function evalExprAsync(
  expr: string,
  vars: Record<string, any>,
  stdin: StdinBuffer,
  onPrompt?: InputPromptFn
): Promise<any> {
  expr = expr.trim();

  // Python f-string basic support: f"Enter element {i + 1}:"
  if (expr.startsWith('f"') && expr.endsWith('"')) {
    const raw = expr.substring(2, expr.length - 1);
    return raw.replace(/\{([^}]+)\}/g, (_, innerExpr) => {
      try {
        const safe = new Function(...Object.keys(vars), `return ${innerExpr};`);
        return String(safe(...Object.values(vars)));
      } catch {
        return innerExpr;
      }
    });
  }

  // input() handling
  if (expr === 'input()') {
    if (onPrompt) return await onPrompt('[INPUT REQUIRED] > ');
    return stdin.nextLine();
  }
  if (expr.startsWith('input(') && expr.endsWith(')')) {
    const inner = expr.substring(6, expr.length - 1).trim();
    let promptMsg = '[INPUT REQUIRED] > ';
    if (inner) {
      const parsedPrompt = await evalExprAsync(inner, vars, stdin, onPrompt);
      promptMsg = String(parsedPrompt);
    }
    if (onPrompt) return await onPrompt(promptMsg);
    return stdin.nextLine();
  }

  // int(input()) handling
  if (expr === 'int(input())') {
    let raw = '';
    if (onPrompt) raw = await onPrompt('[INPUT REQUIRED (Integer)] > ');
    else raw = stdin.nextLine();
    const parsed = parseInt(raw, 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  if (expr.startsWith('int(input(') && expr.endsWith('))')) {
    const inner = expr.substring(10, expr.length - 2).trim();
    let promptMsg = '[INPUT REQUIRED (Integer)] > ';
    if (inner) {
      promptMsg = String(await evalExprAsync(inner, vars, stdin, onPrompt));
    }
    let raw = '';
    if (onPrompt) raw = await onPrompt(promptMsg);
    else raw = stdin.nextLine();
    const parsed = parseInt(raw, 10);
    return isNaN(parsed) ? 0 : parsed;
  }

  if (expr.startsWith('int(') && expr.endsWith(')')) {
    const sub = expr.substring(4, expr.length - 1);
    const val = await evalExprAsync(sub, vars, stdin, onPrompt);
    return parseInt(String(val), 10);
  }
  if (expr.startsWith('float(') && expr.endsWith(')')) {
    const sub = expr.substring(6, expr.length - 1);
    const val = await evalExprAsync(sub, vars, stdin, onPrompt);
    return parseFloat(String(val));
  }
  if (expr.startsWith('sum(') && expr.endsWith(')')) {
    const sub = expr.substring(4, expr.length - 1);
    const arr = await evalExprAsync(sub, vars, stdin, onPrompt);
    return Array.isArray(arr) ? arr.reduce((a, b) => a + Number(b), 0) : 0;
  }
  if (expr.startsWith('len(') && expr.endsWith(')')) {
    const sub = expr.substring(4, expr.length - 1);
    const arr = await evalExprAsync(sub, vars, stdin, onPrompt);
    return arr?.length ?? 0;
  }
  if (expr === '[]') return [];

  // String literals
  if (
    (expr.startsWith('"') && expr.endsWith('"')) ||
    (expr.startsWith("'") && expr.endsWith("'"))
  ) {
    return expr.substring(1, expr.length - 1);
  }

  // Number literal
  if (!isNaN(Number(expr)) && expr !== '') return Number(expr);

  // Variable lookup
  if (vars[expr] !== undefined) return vars[expr];

  // Simple math expression fallback
  try {
    const safeEvaluator = new Function(...Object.keys(vars), `return ${expr};`);
    return safeEvaluator(...Object.values(vars));
  } catch {
    return expr;
  }
}

function parseArgList(text: string): string[] {
  const parts: string[] = [];
  let cur = '';
  let inQuotes = false;
  let quoteChar = '';

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if ((ch === '"' || ch === "'") && !inQuotes) {
      inQuotes = true;
      quoteChar = ch;
      cur += ch;
    } else if (ch === quoteChar && inQuotes) {
      inQuotes = false;
      cur += ch;
    } else if (ch === ',' && !inQuotes) {
      parts.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}

// Educational Java Runtime Engine with Scanner & interactive on-demand input
export async function runJava(
  code: string,
  onPrompt?: InputPromptFn,
  onOutput?: OutputLogFn,
  fallbackStdin: string = ''
): Promise<ExecutionResult> {
  const startTime = performance.now();
  const stdout: string[] = [];
  const stderr: string[] = [];
  const executedLines: number[] = [];

  const stdin = new StdinBuffer(fallbackStdin);
  const lines = code.split(/\r?\n/);
  const vars: Record<string, any> = {};

  const emitLog = (line: string) => {
    stdout.push(line);
    if (onOutput) onOutput(line, false);
  };

  const requestInput = async (promptMsg: string): Promise<string> => {
    if (onPrompt) {
      return await onPrompt(promptMsg);
    }
    return stdin.nextLine();
  };

  try {
    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i];
      const trimmed = rawLine.trim();
      if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*')) continue;
      if (
        trimmed.startsWith('import ') ||
        trimmed.startsWith('public class ') ||
        trimmed.startsWith('public static void main') ||
        trimmed === '{' ||
        trimmed === '}'
      ) {
        continue;
      }

      executedLines.push(i + 1);

      // System.out.println / System.out.print
      if (trimmed.startsWith('System.out.println(') || trimmed.startsWith('System.out.print(')) {
        const isPrintln = trimmed.startsWith('System.out.println(');
        const prefixLen = isPrintln ? 'System.out.println('.length : 'System.out.print('.length;
        const semicolonIdx = trimmed.lastIndexOf(');');
        if (semicolonIdx > 0) {
          const inner = trimmed.substring(prefixLen, semicolonIdx);
          const val = evalJavaStringConcat(inner, vars);
          emitLog(String(val));
          continue;
        }
      }

      // Scanner next methods
      // String name = scanner.nextLine();
      // int age = scanner.nextInt();
      // double gpa = scanner.nextDouble();
      if (trimmed.includes('scanner.') || trimmed.includes('.next')) {
        const match = trimmed.match(/(?:String|int|double|boolean)?\s*(\w+)\s*=\s*scanner\.(\w+)\(\);/);
        if (match) {
          const varName = match[1];
          const method = match[2];

          if (method === 'nextLine') {
            vars[varName] = await requestInput(`[INPUT REQUIRED (${varName})] > `);
          } else if (method === 'nextInt') {
            const raw = await requestInput(`[INPUT REQUIRED (${varName}: Integer)] > `);
            const num = parseInt(raw, 10);
            vars[varName] = isNaN(num) ? 0 : num;
          } else if (method === 'nextDouble') {
            const raw = await requestInput(`[INPUT REQUIRED (${varName}: Double)] > `);
            const num = parseFloat(raw);
            vars[varName] = isNaN(num) ? 0.0 : num;
          } else if (method === 'nextBoolean') {
            const raw = await requestInput(`[INPUT REQUIRED (${varName}: Boolean)] > `);
            vars[varName] = raw.trim().toLowerCase() === 'true';
          } else if (method === 'next') {
            vars[varName] = await requestInput(`[INPUT REQUIRED (${varName})] > `);
          }
          continue;
        }
      }

      // Simple condition: if (gpa >= 3.5)
      if (trimmed.startsWith('if (')) {
        const condMatch = trimmed.match(/if\s*\((.+)\)\s*\{?/);
        if (condMatch) {
          const cond = condMatch[1];
          const result = evalJavaCondition(cond, vars);

          // Find if block and else block
          let j = i + 1;
          const ifBody: string[] = [];
          const elseBody: string[] = [];
          let insideElse = false;

          while (j < lines.length) {
            const nextTrim = lines[j].trim();
            if (nextTrim === '}' || nextTrim.startsWith('} else')) {
              if (nextTrim.includes('else')) {
                insideElse = true;
                j++;
                continue;
              }
              break;
            }
            if (insideElse) elseBody.push(nextTrim);
            else ifBody.push(nextTrim);
            j++;
          }

          const targetBody = result ? ifBody : elseBody;
          for (const s of targetBody) {
            if (s.startsWith('System.out.println(') || s.startsWith('System.out.print(')) {
              const prefixLen = s.startsWith('System.out.println(')
                ? 'System.out.println('.length
                : 'System.out.print('.length;
              const inner = s.substring(prefixLen, s.lastIndexOf(');'));
              emitLog(String(evalJavaStringConcat(inner, vars)));
            }
          }
          i = j;
          continue;
        }
      }
    }

    const endTime = performance.now();
    return {
      stdout,
      stderr,
      executionTimeMs: Math.round((endTime - startTime) * 10) / 10,
      success: true,
      executedLines,
    };
  } catch (err: any) {
    const endTime = performance.now();
    const errMsg = `JavaException: ${err.message}`;
    stderr.push(errMsg);
    if (onOutput) onOutput(errMsg, true);
    return {
      stdout,
      stderr,
      executionTimeMs: Math.round((endTime - startTime) * 10) / 10,
      success: false,
      executedLines,
    };
  }
}

function evalJavaStringConcat(expr: string, vars: Record<string, any>): string {
  const parts: string[] = [];
  let cur = '';
  let inQuotes = false;
  let quoteChar = '';

  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if ((ch === '"' || ch === "'") && !inQuotes) {
      inQuotes = true;
      quoteChar = ch;
      cur += ch;
    } else if (ch === quoteChar && inQuotes) {
      inQuotes = false;
      cur += ch;
    } else if (ch === '+' && !inQuotes) {
      parts.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  if (cur.trim()) parts.push(cur.trim());

  let result = '';
  for (const t of parts) {
    if (
      (t.startsWith('"') && t.endsWith('"')) ||
      (t.startsWith("'") && t.endsWith("'"))
    ) {
      result += t.substring(1, t.length - 1);
    } else if (vars[t] !== undefined) {
      result += vars[t];
    } else {
      result += t;
    }
  }
  return result;
}

function evalJavaCondition(cond: string, vars: Record<string, any>): boolean {
  try {
    const safeEvaluator = new Function(...Object.keys(vars), `return ${cond};`);
    return Boolean(safeEvaluator(...Object.values(vars)));
  } catch {
    return false;
  }
}
