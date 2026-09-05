import React, { useState, useMemo } from 'react';
import {
  Database,
  Play,
  RotateCcw,
  Table as TableIcon,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Key,
  Layers,
  Sparkles,
} from 'lucide-react';
import { QueryResult, TableDef } from '../../types';
import { SqlEngine } from './sqlEngine';

const SAMPLE_QUERIES = [
  {
    title: 'Multi-Statement Script (CREATE + INSERT + SELECT)',
    query: `-- Create a new table, insert rows, and select
CREATE TABLE labs (id INT PRIMARY KEY, name TEXT, difficulty TEXT);
INSERT INTO labs VALUES (1, 'B-Tree Indexing', 'HARD');
INSERT INTO labs VALUES (2, 'Query Optimization', 'MEDIUM');
SELECT * FROM labs;`,
  },
  {
    title: 'Inner Join (Students & Courses via Enrollments)',
    query: `SELECT students.name, courses.title, enrollments.grade
FROM enrollments
INNER JOIN students ON enrollments.student_id = students.id
WHERE students.gpa >= 3.5;`,
  },
  {
    title: 'Aggregation & GPA Stats',
    query: `SELECT COUNT(*), AVG(gpa), MAX(gpa), MIN(gpa) FROM students;`,
  },
  {
    title: 'Update GPA & Query Filter',
    query: `UPDATE students SET gpa = 3.95 WHERE name = 'Bob Vance';
SELECT * FROM students ORDER BY gpa DESC;`,
  },
];

export const DbmsLab: React.FC = () => {
  const engine = useMemo(() => new SqlEngine(), []);
  const [schemaVersion, setSchemaVersion] = useState<number>(0);
  const schema = useMemo(() => engine.getSchema(), [engine, schemaVersion]);

  const [queryText, setQueryText] = useState<string>(SAMPLE_QUERIES[0].query);
  const [queryResults, setQueryResults] = useState<QueryResult[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('students');
  const [activeResultTab, setActiveResultTab] = useState<number>(0);

  // Execute SQL script
  const handleExecute = () => {
    const results = engine.executeScript(queryText);
    setQueryResults(results);
    setSchemaVersion((v) => v + 1);
    setActiveResultTab(results.length - 1 >= 0 ? results.length - 1 : 0);
  };

  const handleResetDb = () => {
    engine.resetDatabase();
    setSchemaVersion((v) => v + 1);
    setQueryResults([]);
  };

  return (
    <div
      id="dbms-workbench-root"
      className="h-full w-full flex flex-col bg-[#07090e] text-zinc-100 select-none overflow-hidden"
    >
      {/* Top Controls Bar */}
      <div
        id="dbms-toolbar"
        className="h-14 bg-[#0c1017] border-b border-zinc-800 px-4 flex flex-wrap items-center justify-between gap-3 shrink-0"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <span className="font-tech text-xs font-bold text-zinc-200">
              TITAN RELATIONAL SQL SANDBOX
            </span>
            <span className="block text-[10px] font-mono text-zinc-400">
              In-Memory ACID Core • Multi-Statement (;) Execution Supported
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          {/* Preset templates */}
          <div className="flex items-center gap-1.5 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <select
              id="select-sql-preset"
              onChange={(e) => setQueryText(e.target.value)}
              className="bg-transparent text-zinc-300 focus:outline-none cursor-pointer max-w-[200px] truncate"
            >
              <option value="" disabled selected>Sample Queries...</option>
              {SAMPLE_QUERIES.map((sq, i) => (
                <option key={i} value={sq.query} className="bg-zinc-900">
                  {sq.title}
                </option>
              ))}
            </select>
          </div>

          <button
            id="btn-run-sql"
            onClick={handleExecute}
            className="px-4 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-tech font-bold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.4)] transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>EXECUTE SQL</span>
          </button>

          <button
            id="btn-reset-db"
            onClick={handleResetDb}
            className="px-2.5 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 flex items-center gap-1"
            title="Reset DB to Default Tables"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset DB</span>
          </button>
        </div>
      </div>

      {/* 3-Panel Split View: SCHEMA (Left 3 cols) | SQL EDITOR (Middle 5 cols) | RESULTS (Right 4 cols) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* PANEL 1: SCHEMA (3 cols) */}
        <div
          id="dbms-schema-pane"
          className="lg:col-span-3 bg-[#090d14] border-b lg:border-b-0 lg:border-r border-zinc-800 flex flex-col overflow-hidden"
        >
          <div className="h-8 bg-[#0b0f17] border-b border-zinc-800 px-3 flex items-center justify-between text-[11px] font-mono text-zinc-400 shrink-0">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>SCHEMA & TABLES</span>
            </div>
            <span className="text-zinc-500">{Object.keys(schema).length} TABLES</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
            {(Object.values(schema) as TableDef[]).map((tbl) => {
              const isSelected = selectedTable === tbl.name;
              return (
                <div
                  key={tbl.name}
                  onClick={() => setSelectedTable(tbl.name)}
                  className={`rounded-xl border p-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-zinc-900/90 border-cyan-500/60 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                      : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800/80 mb-2 font-mono">
                    <span className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
                      <TableIcon className="w-3.5 h-3.5 text-amber-400" />
                      {tbl.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {tbl.rows.length} rows
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 font-mono text-[11px]">
                    {tbl.columns.map((col) => (
                      <div key={col.name} className="flex items-center justify-between text-zinc-400">
                        <span className="flex items-center gap-1 text-zinc-300">
                          {col.isPrimaryKey && <Key className="w-2.5 h-2.5 text-amber-400" />}
                          {col.name}
                        </span>
                        <span className="text-[10px] text-zinc-400">{col.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PANEL 2: SQL EDITOR (5 cols) */}
        <div
          id="dbms-editor-pane"
          className="lg:col-span-5 bg-[#07090e] border-b lg:border-b-0 lg:border-r border-zinc-800 flex flex-col overflow-hidden"
        >
          <div className="h-8 bg-[#0b0f17] border-b border-zinc-800 px-3 flex items-center justify-between text-[11px] font-mono text-zinc-400 shrink-0">
            <span>SQL QUERY SCRIPT EDITOR</span>
            <span className="text-cyan-400">Separate multiple queries with ;</span>
          </div>

          <div className="flex-1 p-3 flex flex-col bg-[#05070a]">
            <textarea
              id="sql-query-textarea"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              spellCheck={false}
              className="flex-1 w-full bg-transparent text-zinc-100 font-mono text-xs leading-relaxed focus:outline-none resize-none overflow-auto"
              placeholder="Write SQL statements separated by semicolons (;)..."
            />
          </div>

          {/* Quick statement help banner */}
          <div className="p-2 border-t border-zinc-800/80 bg-[#090d14] text-[10px] font-mono text-zinc-400 flex items-center justify-between">
            <span>TIP: Ctrl+Enter / click EXECUTE SQL to run script sequentially</span>
          </div>
        </div>

        {/* PANEL 3: RESULTS (4 cols) */}
        <div
          id="dbms-results-pane"
          className="lg:col-span-4 bg-[#080b11] flex flex-col overflow-hidden"
        >
          {/* Result Statement Tabs if multi-statement */}
          <div className="h-8 bg-[#0b0f17] border-b border-zinc-800 px-2 flex items-center justify-between text-[11px] font-mono text-zinc-400 shrink-0 overflow-x-auto">
            <div className="flex items-center gap-1">
              {queryResults.length === 0 ? (
                <span>EXECUTION RESULTS</span>
              ) : (
                queryResults.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveResultTab(i)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 transition-all ${
                      activeResultTab === i
                        ? 'bg-zinc-800 text-cyan-300 font-bold'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {r.success ? (
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-2.5 h-2.5 text-red-400" />
                    )}
                    <span>#{r.statementIndex}</span>
                  </button>
                ))
              )}
            </div>

            {queryResults[activeResultTab] && (
              <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                <Clock className="w-3 h-3 text-cyan-400" />
                {queryResults[activeResultTab].executionTimeMs} ms
              </span>
            )}
          </div>

          {/* Results Display Window */}
          <div className="flex-1 p-3 overflow-auto flex flex-col gap-3 font-mono text-xs">
            {queryResults.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 text-xs">
                <TableIcon className="w-8 h-8 text-zinc-700 mb-2" />
                <span>Ready to execute SQL queries.</span>
              </div>
            ) : queryResults[activeResultTab]?.error ? (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 flex flex-col gap-2">
                <div className="flex items-center gap-2 font-bold text-red-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Execution Failure</span>
                </div>
                <div className="text-xs text-zinc-300 bg-red-950/80 p-2.5 rounded border border-red-900/60">
                  {queryResults[activeResultTab].error}
                </div>
              </div>
            ) : queryResults[activeResultTab]?.rows ? (
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-2">
                  <span>{queryResults[activeResultTab].rows!.length} ROWS RETURNED</span>
                  <span className="truncate max-w-[180px] text-zinc-400">
                    {queryResults[activeResultTab].statement}
                  </span>
                </div>

                <div className="flex-1 overflow-auto rounded-lg border border-zinc-800 bg-[#05070a]">
                  <table className="w-full text-left border-collapse font-mono text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800 bg-zinc-900/80 sticky top-0">
                        {queryResults[activeResultTab].columns?.map((c) => (
                          <th key={c} className="p-2 text-cyan-400 font-bold text-[11px]">
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {queryResults[activeResultTab].rows!.map((row, rIdx) => (
                        <tr key={rIdx} className="border-b border-zinc-900/80 hover:bg-zinc-800/40">
                          {queryResults[activeResultTab].columns?.map((c) => (
                            <td key={c} className="p-2 text-zinc-200">
                              {row[c] !== undefined ? String(row[c]) : 'NULL'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 flex flex-col gap-1">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Statement Executed Successfully</span>
                </div>
                <div className="text-xs text-zinc-300 mt-1">
                  Rows Affected: <strong className="text-white">{queryResults[activeResultTab].affectedRows ?? 0}</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
