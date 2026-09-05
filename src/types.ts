export type ModuleId =
  | 'home'
  | 'dsa'
  | 'memory'
  | 'circuits'
  | 'codelab'
  | 'dbms'
  | 'study'
  | 'knowledge'
  | 'assessment'
  | 'games'
  | 'workspace';

export interface SavedProgram {
  id: string;
  title: string;
  language: 'javascript' | 'python' | 'java';
  code: string;
  stdin: string;
  createdAt: number;
  updatedAt: number;
}

export interface UserNote {
  id: string;
  domain: string;
  title: string;
  content: string;
  updatedAt: number;
}

export interface AssessmentAttempt {
  id: string;
  domain: string;
  difficulty: 'easy' | 'medium' | 'hard';
  score: number;
  total: number;
  timestamp: number;
  timeSpentSec: number;
  weakTopics: string[];
}

export interface UserProgress {
  completedLabs: string[];
  lastActiveModule: ModuleId;
  totalTimeMinutes: number;
  programsCreated: number;
  assessmentsPassed: number;
  topicMastery: Record<string, number>; // 0 to 100
}

export interface SystemSettings {
  theme: 'dark' | 'light';
  focusMode: boolean;
  soundFx: boolean;
  terminalFontSize: number;
  autoSave: boolean;
}

// DSA Types
export type DsaAlgorithm =
  | 'lcs'
  | 'edit_distance'
  | 'binary_search'
  | 'bubble_sort'
  | 'selection_sort'
  | 'insertion_sort'
  | 'merge_sort'
  | 'bfs'
  | 'dfs'
  | 'dijkstra';

export interface DsaStep {
  description: string;
  highlightLines: number[];
  state: Record<string, any>;
}

// Memory Types
export type MemoryDataType = 'int8' | 'int16' | 'int32' | 'float32' | 'pointer';

export interface MemoryCell {
  address: number;
  hexValue: string;
  decValue: number;
  label?: string;
  dataType?: MemoryDataType;
  isBase?: boolean;
  isTarget?: boolean;
}

// Digital Logic Types
export type GateType =
  | 'INPUT'
  | 'OUTPUT'
  | 'AND'
  | 'OR'
  | 'NOT'
  | 'XOR'
  | 'NAND'
  | 'NOR'
  | 'XNOR';

export interface LogicGate {
  id: string;
  type: GateType;
  x: number;
  y: number;
  width: number;
  height: number;
  inputs: boolean[];
  output: boolean;
  label?: string;
}

export interface LogicWire {
  id: string;
  fromGateId: string;
  fromPinIndex: number;
  toGateId: string;
  toPinIndex: number;
}

// DBMS Types
export interface ColumnDef {
  name: string;
  type: 'INT' | 'TEXT' | 'FLOAT' | 'BOOLEAN';
  isPrimaryKey?: boolean;
}

export interface TableDef {
  name: string;
  columns: ColumnDef[];
  rows: Record<string, any>[];
}

export interface QueryResult {
  statementIndex: number;
  statement: string;
  success: boolean;
  columns?: string[];
  rows?: Record<string, any>[];
  affectedRows?: number;
  error?: string;
  executionTimeMs: number;
}

// Assessment Question
export interface Question {
  id: string;
  domain: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
