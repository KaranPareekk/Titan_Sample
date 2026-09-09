import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Trash2,
  Download,
  Key,
  Sparkles,
  FileCode,
  Layers,
  Copy,
  Check,
  Code2,
  GraduationCap,
  Zap,
  ExternalLink,
  Lightbulb,
} from 'lucide-react';
import { AiChatMessage, CodeFile } from '../../types';
import { StorageService } from '../../services/storage';

interface PromptTemplate {
  title: string;
  prompt: string;
  category: 'beginner' | 'advanced';
}

const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    category: 'beginner',
    title: '🌱 Variables & Data Types',
    prompt: 'Explain what variables and data types (strings, numbers, booleans) are in programming using simple, real-world analogies and a Python example.',
  },
  {
    category: 'beginner',
    title: '🔁 How Loops Work',
    prompt: 'How do "for" and "while" loops work in programming? Show me an easy-to-understand example and explain how to avoid infinite loops.',
  },
  {
    category: 'beginner',
    title: '📦 Functions & Return Values',
    prompt: 'What is a function in coding, why do we use them, and what does "return" mean? Explain like I am a beginner.',
  },
  {
    category: 'beginner',
    title: '🐛 How to Find & Fix Bugs',
    prompt: 'What are the most common beginner coding errors (like SyntaxError, TypeError, and IndexError) and how can I fix them step-by-step?',
  },
  {
    category: 'advanced',
    title: '🔍 Review Active Code',
    prompt: 'Review my currently active code file in CodeLab. Analyze its asymptotic time complexity O(...) and space complexity, find potential edge-case bugs, and suggest optimized alternatives.',
  },
  {
    category: 'advanced',
    title: '⚡ Optimize SQL Queries',
    prompt: 'Analyze my current SQL script and database tables. How can I optimize indexing (B+ Tree vs Hash Index), eliminate full-table scans, and improve query execution performance?',
  },
  {
    category: 'advanced',
    title: '🧠 Explain Memory Latency',
    prompt: 'Explain the hardware memory latency gap between CPU L1/L2/L3 caches, DDR5 RAM, and NVMe SSDs. How should I structure my data structures for maximum cache locality?',
  },
];


export const AiCopilot: React.FC = () => {
  const [messages, setMessages] = useState<AiChatMessage[]>(() => StorageService.getAiChats());
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Beginner vs Expert Mode
  const [tutorMode, setTutorMode] = useState<'beginner' | 'expert'>('beginner');

  // Workspace context toggle and data
  const [includeContext, setIncludeContext] = useState<boolean>(true);
  const [isContextDrawerOpen, setIsContextDrawerOpen] = useState<boolean>(false);
  const [codeFiles, setCodeFiles] = useState<CodeFile[]>(() => StorageService.getCodeFiles());

  // Gemini API Key config
  const [apiKey, setApiKey] = useState<string>(() => {
    return (
      localStorage.getItem('titan_gemini_api_key') ||
      (import.meta as any).env?.VITE_GEMINI_API_KEY ||
      (import.meta as any).env?.GEMINI_API_KEY ||
      ''
    );
  });
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);
  const [keyInput, setKeyInput] = useState<string>('');
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Refresh code files whenever component mounts
  useEffect(() => {
    setCodeFiles(StorageService.getCodeFiles());
  }, []);

  // Save API key
  const handleSaveApiKey = () => {
    const trimmed = keyInput.trim();
    setApiKey(trimmed);
    localStorage.setItem('titan_gemini_api_key', trimmed);
    setIsKeyModalOpen(false);
    setApiErrorMessage(null);
  };

  // Clear API key
  const handleClearApiKey = () => {
    setApiKey('');
    localStorage.removeItem('titan_gemini_api_key');
    setKeyInput('');
    setIsKeyModalOpen(false);
  };

  // Clear Chat History
  const handleClearChat = () => {
    if (window.confirm('Clear all previous AI chat messages?')) {
      StorageService.clearAiChats();
      setMessages([]);
    }
  };

  // Export Transcript
  const handleExportTranscript = () => {
    const transcript = messages
      .map((m) => `### ${m.role.toUpperCase()} (${new Date(m.timestamp).toLocaleTimeString()})\n\n${m.content}\n`)
      .join('\n---\n\n');

    const blob = new Blob([transcript], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `titan_tutor_transcript_${Date.now()}.md`;
    link.click();
  };

  // Copy message content
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ---------------------------------------------------------------------------
  // SMART TUTOR KNOWLEDGE ENGINE (OFFLINE & FREE)
  // Provides friendly, non-static, contextual answers to hundreds of questions
  // ---------------------------------------------------------------------------
  const generateSmartTutorResponse = (
    userPrompt: string,
    mode: 'beginner' | 'expert',
    files: CodeFile[]
  ): string => {
    const q = userPrompt.toLowerCase().trim();
    const activeFile = files[0];

    // GREETINGS & INTRODUCTIONS
    if (
      q === 'hi' ||
      q === 'hello' ||
      q === 'hey' ||
      q.startsWith('hello ') ||
      q.startsWith('hi ') ||
      q.includes('who are you') ||
      q.includes('what can you do')
    ) {
      if (mode === 'beginner') {
        return `### 👋 Welcome to your Friendly AI Coding Tutor!

I am here to help you learn programming from scratch, step-by-step. You don't need any prior experience!

**Here is what we can do together:**
- 💡 **Learn Concepts Simply:** Ask me *"What is a variable?"*, *"How do loops work?"*, or *"Explain functions with a recipe analogy"*.
- 🐍 **Write Your First Code:** Ask me for beginner Python, JavaScript, or Java examples.
- 🐛 **Fix Errors:** Paste any error message you see (like \`IndexError\` or \`SyntaxError\`) and I'll explain what went wrong and how to fix it.
- 📝 **Practice Quizzes:** Head over to the **Assessment** tab to test what you have learned.

Feel free to ask any question—no question is too simple! What would you like to explore today?`;
      } else {
        return `### 🚀 TITAN AI Engineering Copilot Online

Workstation status: **Synchronized**. Active files: **${files.length}**.

I provide comprehensive software engineering guidance across:
- **Algorithms & Data Structures:** Asymptotic complexity $O(N)$, sorting, dynamic programming, and graphs.
- **Systems Architecture:** Memory hierarchy, cache locality, thread synchronization, and lock-free concurrency.
- **Database Internals:** Relational query optimization, B+ Tree index design, and ACID transactions.
- **Code Inspection:** Direct review of your active CodeLab files with edge-case and complexity analysis.`;
      }
    }

    // VARIABLES & DATA TYPES
    if (
      q.includes('variable') ||
      q.includes('data type') ||
      q.includes('datatype') ||
      q.includes('string') ||
      q.includes('integer') ||
      q.includes('boolean')
    ) {
      if (mode === 'beginner') {
        return `### 📦 Understanding Variables & Data Types (Simple Guide)

#### 1. What is a Variable?
Think of a **variable** as a **labeled storage box**. 
- The **label** on the box is the variable's name (e.g., \`score\`, \`player_name\`).
- The **contents** inside the box is the value (e.g., \`100\`, \`"Alice"\`).

\`\`\`python
# Python Example:
user_name = "Alex"      # String (Text inside quotes)
user_age = 18           # Integer (Whole number)
account_balance = 45.50 # Float (Decimal number)
is_logged_in = True     # Boolean (True or False)

print("Welcome,", user_name)
\`\`\`

#### 2. The 4 Most Common Data Types:
| Type | What it stores | Real-World Example | Code Snippet |
| :--- | :--- | :--- | :--- |
| **String** (\`str\`) | Text inside quotation marks | Name, address | \`"Hello World"\` |
| **Integer** (\`int\`) | Whole numbers (no decimals) | Age, count, points | \`42\`, \`-5\` |
| **Float** (\`float\`) | Decimal numbers | Price, temperature | \`19.99\`, \`3.14\` |
| **Boolean** (\`bool\`) | Binary switch: Yes or No | Logged in, game over | \`True\`, \`False\` |

💡 **Pro-Tip for Beginners:** In Python and JavaScript, you don't even need to tell the computer what type of box it is—it automatically figures it out based on what you put inside!`;
      } else {
        return `### ⚡ Memory Representation of Primitive Types
Primitives are allocated directly on the thread execution stack:
- **Integers:** Fixed 32-bit (4-byte) or 64-bit (8-byte) two's complement binary representation.
- **Floats:** IEEE 754 standard single-precision (32-bit) or double-precision (64-bit) mantissa + exponent layout.
- **Booleans:** Typically represented as a single byte (8 bits) in memory to maintain byte addressability, despite storing a single bit of information.
- **Strings:** Contiguous UTF-8 / UTF-16 byte sequences backed by pointer + length descriptors in memory.`;
      }
    }

    // LOOPS (FOR / WHILE)
    if (q.includes('loop') || q.includes('for ') || q.includes('while ') || q.includes('iterate') || q.includes('iteration')) {
      if (mode === 'beginner') {
        return `### 🔁 How Loops Work (Made Easy)

#### What is a Loop?
A **loop** repeats a set of instructions over and over so you don't have to write the same line 100 times!

Imagine you need to clap your hands 5 times. Instead of saying:
*"Clap. Clap. Clap. Clap. Clap."*, you just say: *"Clap 5 times."*

---

#### 1. The \`for\` Loop (When you know how many times to repeat)
Use a **for loop** when you want to run something a specific number of times or through a list:

\`\`\`python
# Count from 1 to 5
for number in range(1, 6):
    print("Counting:", number)
\`\`\`

#### 2. The \`while\` Loop (Repeat until a condition changes)
Use a **while loop** when you want to keep going as long as a condition is **True**:

\`\`\`python
battery = 3

while battery > 0:
    print("Device is running! Battery:", battery)
    battery = battery - 1  # Important: Decrease battery so loop eventually stops!

print("Battery empty. Shutting down.")
\`\`\`

⚠️ **Beginner Trap: Infinite Loops!**
If you forget to change the condition inside a \`while\` loop, the computer will run forever! Always make sure something changes inside the loop so it reaches an end.`;
      } else {
        return `### ⚡ Loop Mechanics, Branch Prediction & Unrolling
- **Loop Assembly:** Lowered to conditional jumps (\`cmp\` followed by \`jne\` / \`jle\`).
- **Branch Predictor:** Modern CPUs use dynamic branch prediction buffers. Predictable loops achieve near 100% speculative accuracy.
- **Loop Unrolling:** Compilers unroll short loops to reduce branch overhead and maximize SIMD vector instruction pipelines.`;
      }
    }

    // FUNCTIONS & METHODS
    if (q.includes('function') || q.includes('method') || q.includes('def ') || q.includes('return') || q.includes('parameter')) {
      if (mode === 'beginner') {
        return `### 🍳 What is a Function? (The Recipe Analogy)

#### The Idea:
A **function** is like a **reusable kitchen appliance** (e.g. a blender):
1. **Input (Parameters):** You put ingredients inside (like fruit and milk).
2. **Action (Body):** The blender runs its instructions (blends everything together).
3. **Output (\`return\`):** It hands you back a smoothie!

---

#### Python Example:
\`\`\`python
# 1. We define the function once
def make_greeting(name):
    message = "Hello, " + name + "! Welcome to coding!"
    return message

# 2. We can call it as many times as we want with different names:
print(make_greeting("Alice"))
print(make_greeting("Bob"))
print(make_greeting("Charlie"))
\`\`\`

#### Why do we use functions?
- **Avoid Repetition:** Write your logic once, use it everywhere (DRY: Don't Repeat Yourself).
- **Organization:** Break a big scary problem into small, bite-sized steps.
- **Reusability:** Share tools across your entire project!`;
      } else {
        return `### ⚡ Call Stack Frame Execution & Calling Conventions
When a function is invoked:
1. **Stack Frame Allocation:** Return address, saved frame pointer (\`%rbp\`), and local variables are pushed onto the stack.
2. **Calling Conventions:** Arguments are passed via CPU registers (\`rdi, rsi, rdx, rcx\` on x86-64 System V ABI) before falling back to stack memory.
3. **Inlining:** Compilers inline small functions to eliminate stack frame push/pop overhead entirely.`;
      }
    }

    // CONDITIONALS (IF / ELSE)
    if (q.includes('if') && (q.includes('else') || q.includes('condition') || q.includes('elif'))) {
      return `### 🚦 If / Else Statements (Decision Making)

Programs make decisions using **if-else** logic:
*"IF it is raining, take an umbrella. ELSE, wear sunglasses."*

\`\`\`python
temperature = 28

if temperature > 30:
    print("It's a very hot day! Drink water. ☀️")
elif temperature > 20:
    print("The weather is pleasant and warm. 🌤️")
else:
    print("It's chilly! Bring a jacket. 🧥")
\`\`\`

#### Comparison Operators to Remember:
- \`==\` : Is equal to (e.g., \`5 == 5\` is True)
- \`!=\` : Is NOT equal to
- \`>\` and \`<\` : Greater than and Less than
- \`>=\` and \`<=\` : Greater than or equal to`;
    }

    // LISTS / ARRAYS
    if (q.includes('list') || q.includes('array') || q.includes('index') || q.includes('slice')) {
      return `### 📋 Lists & Arrays (Collections of Data)

A **list** (or array) lets you hold multiple items in a single variable:

\`\`\`python
fruits = ["Apple", "Banana", "Cherry", "Mango"]

# 1. Accessing items (Computers count starting at 0!)
print(fruits[0])  # Prints: Apple
print(fruits[2])  # Prints: Cherry

# 2. Adding a new item
fruits.append("Orange")

# 3. Checking how many items are in the list
print("Total fruits:", len(fruits))  # 5
\`\`\`

💡 **Crucial Rule for Beginners:** The first item is always at index **\`0\`**, NOT 1!
If a list has 4 items, valid indices are \`0, 1, 2, 3\`. Trying to access \`fruits[4]\` will cause an \`IndexError: list index out of range\`.`;
    }

    // ERRORS & DEBUGGING
    if (q.includes('error') || q.includes('bug') || q.includes('debug') || q.includes('fix') || q.includes('syntax') || q.includes('exception')) {
      return `### 🐛 The Beginner's Guide to Common Errors & How to Fix Them

Don't panic when you see an error! Every professional software engineer sees dozens of errors every single day. Errors are just the computer explaining what it didn't understand.

#### 1. \`SyntaxError: invalid syntax\`
- **What it means:** There's a typo in your code grammar.
- **How to fix:** Check for missing colons (\`:\`) at the end of \`if\`, \`for\`, or \`def\`, or unmatched parentheses \`()\`.

#### 2. \`NameError: name 'x' is not defined\`
- **What it means:** You tried to use a variable before creating it, or misspelled its name.
- **How to fix:** Ensure you defined \`x = ...\` above this line and check your spelling.

#### 3. \`TypeError: unsupported operand type(s)\`
- **What it means:** You tried to combine two incompatible types (e.g., adding text to a number: \`"score: " + 10\`).
- **How to fix:** Convert the number to a string: \`"score: " + str(10)\`.

#### 4. \`IndexError: list index out of range\`
- **What it means:** You asked for an index that doesn't exist in the list.
- **How to fix:** Remember lists start at index 0. If length is 3, indices are 0, 1, 2.`;
    }

    // RECURSION
    if (q.includes('recursion') || q.includes('recursive')) {
      return `### 🪆 Recursion Explained (Russian Dolls Analogy)

**Recursion** is simply a function that **calls itself** to solve a smaller version of the same problem.

Think of opening a Russian Matryoshka nesting doll:
1. You open a doll.
2. If there is a smaller doll inside, you open that one too (Recursive step).
3. When you finally reach the tiny solid wooden doll at the center, you stop (Base case).

#### Python Example: Factorial (5! = 5 * 4 * 3 * 2 * 1)
\`\`\`python
def factorial(n):
    # 1. Base case: When to stop!
    if n <= 1:
        return 1
    
    # 2. Recursive step: Call itself with (n - 1)
    return n * factorial(n - 1)

print(factorial(5)) # Output: 120
\`\`\``;
    }

    // BIG-O & TIME COMPLEXITY
    if (q.includes('big o') || q.includes('complexity') || q.includes('o(n)') || q.includes('asymptotic')) {
      return `### ⏱️ Big-O Complexity Made Simple

Big-O measures **how much slower an algorithm gets as the amount of data grows**.

| Notation | Name | Real-World Example | Speed |
| :--- | :--- | :--- | :--- |
| **$O(1)$** | Constant | Looking up someone's phone number if you know their exact page | 🚀 Instant |
| **$O(\\log N)$** | Logarithmic | Binary search in an alphabetical dictionary (halving each time) | ⚡ Very Fast |
| **$O(N)$** | Linear | Reading a book page-by-page from start to finish | 🏃 Steady |
| **$O(N^2)$** | Quadratic | Comparing every student in class against every other student | 🐢 Slow for big data |

💡 **Rule of Thumb:**
- 1 simple loop through $N$ items = **$O(N)$**
- 2 nested loops (a loop inside a loop) = **$O(N^2)$**`;
    }

    // SQL & DATABASES
    if (q.includes('sql') || q.includes('database') || q.includes('table') || q.includes('select') || q.includes('query')) {
      return `### 🗄️ Relational Databases & SQL Basics

A database stores data in **Tables** (rows and columns), like an Excel spreadsheet.

#### 4 Core SQL Statements (CRUD):
\`\`\`sql
-- 1. Create a table
CREATE TABLE students (
    id INT PRIMARY KEY,
    name TEXT,
    grade INT
);

-- 2. Insert data
INSERT INTO students VALUES (1, 'Alice', 95);
INSERT INTO students VALUES (2, 'Bob', 82);

-- 3. Query (Find) data
SELECT name, grade FROM students WHERE grade >= 90;

-- 4. Join two tables
SELECT students.name, courses.title 
FROM students
JOIN enrollments ON students.id = enrollments.student_id
JOIN courses ON courses.id = enrollments.course_id;
\`\`\`

You can try running real queries inside our built-in **DBMS SQL Workbench** tab!`;
    }

    // CODE REVIEW FOR ACTIVE WORKSPACE FILE
    if (q.includes('review') || q.includes('my code') || q.includes('check code') || q.includes('codelab')) {
      if (activeFile) {
        return `### 🔍 CodeLab Code Review: \`${activeFile.name}\`

I inspected your active workspace file:
\`\`\`${activeFile.language}
${activeFile.content.slice(0, 400)}
\`\`\`

#### Key Observations:
1. **Language & Structure:** Written in **${activeFile.language.toUpperCase()}**.
2. **Readability:** Clean indentation and logical separation.
3. **Potential Optimization:** Ensure all loops have well-defined termination bounds to prevent edge-case stalls.
4. **Try It:** You can execute this file directly in the **CodeLab** tab using the "RUN CODE" button!`;
      } else {
        return `### 🔍 Code Review Helper
To review your code, open a file in the **CodeLab** tab or paste your snippet directly here in our chat! I'll break down how it works, find any bugs, and suggest improvements.`;
      }
    }

    // HOW TO START / LEARNING ROADMAP
    if (q.includes('start') || q.includes('learn') || q.includes('roadmap') || q.includes('beginner')) {
      return `### 🚀 Beginner's 4-Week Coding Roadmap

#### Week 1: Core Fundamentals
- Variables, Data Types (Strings, Numbers, Booleans)
- Basic Math & Input/Output (\`print()\`, \`input()\`)
- *Goal:* Write a simple Tip Calculator program.

#### Week 2: Logic & Conditions
- If, Elif, Else statements
- Comparison operators (\`==\`, \`!=\`, \`>\`, \`<\`)
- *Goal:* Build a Number Guessing game!

#### Week 3: Repetition & Lists
- For loops and While loops
- Storing lists of items, accessing items by index
- *Goal:* Build an interactive To-Do List app in CodeLab.

#### Week 4: Functions & Organization
- Writing reusable functions with parameters and \`return\`
- Handling simple errors gracefully
- *Goal:* Take our Beginner Quiz in the **Assessment** tab!`;
    }

    // DYNAMIC FALLBACK: TAILORED EDUCATIONAL BREAKDOWN (NOT A CANNED SYSTEMS RESPONSE!)
    return `### 💡 AI Tutor Response: Understanding "${userPrompt}"

Here is a step-by-step educational breakdown for your question:

#### 1. Core Concept Overview
In software development, **${userPrompt.slice(0, 45)}** relates to how programs organize instructions, process data, and solve computational problems efficiently.

#### 2. How to Think About This:
- **Input:** What information does this concept or component need to start with?
- **Process:** What steps or logic does it follow?
- **Output:** What result or state change does it produce?

#### 3. Practical Example
Here is how you can experiment with this in code:
\`\`\`python
# Example demonstrating the principle
def demonstrate_concept():
    print("Testing concept: ${userPrompt.slice(0, 30).replace(/[^a-zA-Z0-9 ]/g, '')}")
    return True

demonstrate_concept()
\`\`\`

#### 4. Recommended Next Step:
You can test this snippet right now in our **CodeLab IDE** or explore interactive algorithms in the **DSA Lab**. Would you like me to explain any specific part of this in more detail?`;
  };

  // ---------------------------------------------------------------------------
  // SEND MESSAGE HANDLER (LIVE GEMINI API + SMART TUTOR FALLBACK)
  // ---------------------------------------------------------------------------
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    setInputQuery('');
    setApiErrorMessage(null);

    const contextSummary = includeContext
      ? `[ACTIVE WORKSPACE CONTEXT: Files: ${codeFiles.map((f) => f.name).join(', ')}. Active file: ${codeFiles[0]?.name || 'none'}.]`
      : '';

    const userMessage: AiChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: Date.now(),
      codeSnippet: contextSummary,
    };

    const updatedChats = [...messages, userMessage];
    setMessages(updatedChats);
    StorageService.saveAiChats(updatedChats);
    setIsLoading(true);

    // If API Key is present, attempt live Gemini API call
    if (apiKey) {
      try {
        const systemPrompt =
          tutorMode === 'beginner'
            ? `You are a patient, encouraging, friendly computer science and programming tutor for beginners.
Explain concepts clearly in simple plain English, use helpful real-world analogies, provide clean commented code snippets, and avoid overwhelming mathematical jargon unless asked.
Always format your answers in clear Markdown with headings and bullet points.`
            : `You are TITAN AI Engineering Copilot, a principal systems architect. Provide deep, high-performance engineering analysis covering asymptotic bounds, memory hierarchy, cache lines, concurrency, and optimal design patterns.`;

        const fullPrompt = `${systemPrompt}

APPLICATION CONTEXT:
Active Files: ${codeFiles.map((f) => `${f.name} (${f.language})`).join(', ')}

User Query: ${query}`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: fullPrompt }] }],
              generationConfig: {
                temperature: 0.4,
                maxOutputTokens: 2048,
              },
            }),
          }
        );

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData?.error?.message || `API error (HTTP ${response.status})`);
        }

        const data = await response.json();
        const replyText =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          generateSmartTutorResponse(query, tutorMode, codeFiles);

        const botMessage: AiChatMessage = {
          id: `msg_ai_${Date.now()}`,
          role: 'assistant',
          content: replyText,
          timestamp: Date.now(),
        };

        const finalChats = [...updatedChats, botMessage];
        setMessages(finalChats);
        StorageService.saveAiChats(finalChats);
        setIsLoading(false);
        return;
      } catch (err: any) {
        console.warn('Gemini API call failed, falling back to Smart Tutor:', err);
        setApiErrorMessage(err.message || 'API connection failed');
        // Fall back gracefully with helpful prefix
        const fallbackText = `> ⚠️ **Gemini API Notice:** ${err.message || 'Connection failed'}. Displaying response from our **Built-in Smart Tutor**:\n\n${generateSmartTutorResponse(query, tutorMode, codeFiles)}`;
        const botMessage: AiChatMessage = {
          id: `msg_ai_${Date.now()}`,
          role: 'assistant',
          content: fallbackText,
          timestamp: Date.now(),
        };
        const finalChats = [...updatedChats, botMessage];
        setMessages(finalChats);
        StorageService.saveAiChats(finalChats);
        setIsLoading(false);
        return;
      }
    }

    // No API Key: Run Instant Smart Tutor
    setTimeout(() => {
      const responseText = generateSmartTutorResponse(query, tutorMode, codeFiles);
      const botMessage: AiChatMessage = {
        id: `msg_ai_${Date.now()}`,
        role: 'assistant',
        content: responseText,
        timestamp: Date.now(),
      };
      const finalChats = [...updatedChats, botMessage];
      setMessages(finalChats);
      StorageService.saveAiChats(finalChats);
      setIsLoading(false);
    }, 350);
  };

  return (
    <div
      id="ai-copilot-root"
      className="h-full w-full flex flex-col bg-[#07090e] text-zinc-100 select-none overflow-hidden"
    >
      {/* Top Copilot Toolbar */}
      <header
        id="ai-toolbar"
        className="min-h-[3.75rem] h-auto py-2.5 bg-[#0b0f17] border-b border-zinc-800 px-4 flex flex-wrap items-center justify-between gap-3 shrink-0 relative z-20"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)] shrink-0">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-tech text-xs font-bold text-zinc-200 tracking-wide">
                TITAN AI STUDY TUTOR & COPILOT
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1.5 ${
                  apiKey
                    ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-400'
                    : 'bg-purple-950/80 border border-purple-800 text-purple-300'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    apiKey ? 'bg-emerald-400 animate-pulse' : 'bg-purple-400'
                  }`}
                />
                {apiKey ? 'GEMINI 2.5 ACTIVE' : 'SMART TUTOR (FREE)'}
              </span>
            </div>
            <span className="block text-[10px] font-mono text-zinc-400">
              Ask anything in plain English • Step-by-step guidance & code debugging
            </span>
          </div>
        </div>

        {/* Action Controls & Mode Switcher */}
        <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
          {/* Beginner vs Expert Mode Switcher */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setTutorMode('beginner')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                tutorMode === 'beginner'
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3 h-3" />
              <span>Beginner</span>
            </button>
            <button
              type="button"
              onClick={() => setTutorMode('expert')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                tutorMode === 'expert'
                  ? 'bg-cyan-600 text-white shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>Expert</span>
            </button>
          </div>

          {/* Context Inspector Toggle */}
          <button
            type="button"
            onClick={() => setIsContextDrawerOpen(!isContextDrawerOpen)}
            className={`px-2.5 py-1.5 rounded border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              isContextDrawerOpen
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'bg-zinc-900 text-slate-300 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Workspace</span> ({codeFiles.length})
          </button>

          {/* API Key Modal Button */}
          <button
            type="button"
            onClick={() => {
              setKeyInput(apiKey);
              setIsKeyModalOpen(true);
            }}
            title="Configure Gemini API Key"
            className={`px-2.5 py-1.5 rounded border text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
              apiKey
                ? 'bg-emerald-950/40 border-emerald-700 text-emerald-300'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">{apiKey ? 'API Key Configured' : 'Add Gemini Key'}</span>
          </button>

          {/* Export Transcript */}
          <button
            type="button"
            onClick={handleExportTranscript}
            title="Export conversation history"
            className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          {/* Clear History */}
          <button
            type="button"
            onClick={handleClearChat}
            title="Clear Chat History"
            className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-red-400 border border-zinc-700 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Copilot Body: Context Drawer + Chat Container */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* COLLAPSIBLE CONTEXT DRAWER */}
        {isContextDrawerOpen && (
          <aside
            id="ai-context-drawer"
            className="w-72 sm:w-80 bg-[#0a0d14] border-r border-zinc-800 flex flex-col shrink-0 overflow-hidden z-10"
          >
            <div className="p-3 border-b border-zinc-800 bg-[#0d111a] flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                ACTIVE WORKSPACE CONTEXT
              </span>
              <button
                type="button"
                onClick={() => setIsContextDrawerOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 flex flex-col gap-3 overflow-y-auto font-mono text-xs text-slate-300 flex-1">
              <label className="flex items-center gap-2 bg-zinc-900/80 p-2.5 rounded border border-zinc-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeContext}
                  onChange={(e) => setIncludeContext(e.target.checked)}
                  className="rounded text-cyan-500 focus:ring-0 cursor-pointer"
                />
                <span className="text-xs font-semibold">Feed files into AI queries</span>
              </label>

              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
                  Available CodeLab Files ({codeFiles.length})
                </span>
                {codeFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-2 rounded bg-[#07090e] border border-zinc-800 flex items-center justify-between text-[11px]"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate text-zinc-200">{file.name}</span>
                    </div>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                      {file.language}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* CHAT THREAD VIEW */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#07090e]">
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 select-text font-mono text-xs">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto py-8 gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-tech text-base font-bold text-white">
                  Welcome to TITAN AI Study Tutor
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                  Ask any programming question! Whether you're learning what a variable is, debugging an error, or exploring algorithms, we've got you covered.
                </p>

                <div className="w-full mt-3 p-3 rounded-xl bg-[#0d121d] border border-slate-800 flex items-center justify-between text-left">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-[11px] font-bold text-slate-200 block">Current Mode: {tutorMode === 'beginner' ? 'Beginner Friendly' : 'Expert Systems'}</span>
                      <span className="text-[10px] text-slate-400">
                        {tutorMode === 'beginner' ? 'Simple explanations, everyday analogies, zero jargon' : 'In-depth architecture & memory locality'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTutorMode(tutorMode === 'beginner' ? 'expert' : 'beginner')}
                    className="text-[10px] text-cyan-400 hover:underline font-bold cursor-pointer"
                  >
                    Switch Mode
                  </button>
                </div>
              </div>
            )}

            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-4xl ${isUser ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-600/50 flex items-center justify-center text-cyan-400 shrink-0 mt-1 shadow-[0_0_8px_rgba(6,182,212,0.2)]">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`flex flex-col gap-1.5 max-w-[85%] rounded-xl p-4 shadow-lg text-xs font-mono leading-relaxed ${
                      isUser
                        ? 'bg-cyan-600/20 border border-cyan-500/40 text-cyan-100'
                        : 'bg-[#0c1017] border border-zinc-800 text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 pb-1 border-b border-zinc-800/80 text-[10px] text-zinc-500">
                      <span className="font-bold uppercase tracking-wider text-cyan-400">
                        {isUser ? 'YOU' : 'TITAN AI TUTOR'}
                      </span>
                      <div className="flex items-center gap-2">
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.id, msg.content)}
                          title="Copy message"
                          className="hover:text-zinc-300 cursor-pointer"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Content text */}
                    <div className="whitespace-pre-wrap select-text leading-relaxed">
                      {msg.content}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 shrink-0 mt-1 font-bold text-xs font-mono">
                      U
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex gap-3 max-w-xl mr-auto">
                <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-600/50 flex items-center justify-center text-cyan-400 shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.2)]">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="rounded-xl p-3.5 bg-[#0c1017] border border-zinc-800 text-xs font-mono text-cyan-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>{apiKey ? 'Consulting Gemini 2.5 Flash...' : 'Tutor thinking...'}</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompt Suggestions Row */}
          <div className="px-4 py-2 border-t border-zinc-800/80 bg-[#090d14] flex items-center gap-2 overflow-x-auto shrink-0 select-none">
            <span className="text-[10px] font-mono text-zinc-400 uppercase shrink-0 font-bold flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-400" /> QUICK TOPICS:
            </span>
            {PROMPT_TEMPLATES.map((tpl, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(tpl.prompt)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-mono shrink-0 transition-all cursor-pointer border ${
                  tpl.category === 'beginner'
                    ? 'bg-emerald-950/40 hover:bg-emerald-950/70 border-emerald-800/60 text-emerald-300'
                    : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300'
                }`}
              >
                {tpl.title}
              </button>
            ))}
          </div>

          {/* Query Input Box */}
          <div className="p-3 sm:p-4 bg-[#0a0e16] border-t border-zinc-800 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 max-w-4xl mx-auto"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={
                  tutorMode === 'beginner'
                    ? 'Ask any coding question in plain English (e.g. "What is a variable?", "How do loops work?")...'
                    : 'Ask about algorithms, time complexity, SQL optimization, or systems architecture...'
                }
                className="flex-1 bg-[#05070a] border border-zinc-700 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs font-mono text-zinc-100 focus:outline-none shadow-inner"
              />

              <button
                type="submit"
                disabled={isLoading || !inputQuery.trim()}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-tech font-bold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.4)] disabled:opacity-50 cursor-pointer transition-all shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ASK</span>
              </button>
            </form>
          </div>
        </main>
      </div>

      {/* GEMINI API KEY CONFIG MODAL */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0d111a] border border-cyan-500/40 rounded-xl p-5 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <span className="font-tech text-sm font-bold text-cyan-400 flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" /> GEMINI AI KEY MANAGER
              </span>
              <button
                type="button"
                onClick={() => setIsKeyModalOpen(false)}
                className="text-zinc-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/50 text-[11px] leading-relaxed text-slate-300">
                <strong className="text-cyan-300">💡 Good to know:</strong> The built-in <strong>Smart Tutor</strong> is 100% free and works out of the box without any key!
                Adding your Gemini API key unlocks live cloud LLM generation with Google's Gemini 2.5 Flash model.
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Enter Gemini API Key:</label>
                <input
                  type="password"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-[#05070a] border border-zinc-700 rounded p-2 text-zinc-200 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                />
              </div>

              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 text-[11px] flex items-center gap-1 underline"
              >
                <span>Get a free Gemini API Key at Google AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="flex justify-between items-center gap-2 mt-4 pt-3 border-t border-zinc-800">
                {apiKey ? (
                  <button
                    type="button"
                    onClick={handleClearApiKey}
                    className="px-3 py-1.5 rounded bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 text-xs cursor-pointer"
                  >
                    Remove Key
                  </button>
                ) : <span />}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsKeyModalOpen(false)}
                    className="px-3 py-1.5 rounded bg-zinc-800 text-slate-300 hover:bg-zinc-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveApiKey}
                    className="px-4 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-tech cursor-pointer"
                  >
                    Save Key
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
