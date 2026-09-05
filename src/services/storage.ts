import {
  SavedProgram,
  UserNote,
  AssessmentAttempt,
  UserProgress,
  SystemSettings,
  ModuleId,
} from '../types';

const STORAGE_KEYS = {
  PROGRAMS: 'titan_programs_v1',
  NOTES: 'titan_notes_v1',
  PROGRESS: 'titan_progress_v1',
  ATTEMPTS: 'titan_assessment_attempts_v1',
  SETTINGS: 'titan_settings_v1',
};

const DEFAULT_PROGRAMS: SavedProgram[] = [
  {
    id: 'prog_py_1',
    title: 'Array Reversal & Input Reader',
    language: 'python',
    code: `# Reads N numbers from STDIN and reverses them
n = int(input())
nums = []
for i in range(n):
    val = int(input())
    nums.append(val)

print("Original array:", nums)
nums.reverse()
print("Reversed array:", nums)
print("Sum of elements:", sum(nums))
`,
    stdin: `5
10
20
30
40
50`,
    createdAt: Date.now() - 3600000 * 24,
    updatedAt: Date.now() - 3600000 * 24,
  },
  {
    id: 'prog_java_1',
    title: 'Scanner Dynamic Processing',
    language: 'java',
    code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("=== TITAN JAVA RUNTIME ===");
        
        String name = scanner.nextLine();
        int age = scanner.nextInt();
        double gpa = scanner.nextDouble();
        
        System.out.println("Student: " + name);
        System.out.println("Age: " + age);
        System.out.println("GPA: " + gpa);
        
        if (gpa >= 3.5) {
            System.out.println("Status: DEAN'S LIST HONORS");
        } else {
            System.out.println("Status: GOOD STANDING");
        }
    }
}
`,
    stdin: `Alex Mercer
21
3.85`,
    createdAt: Date.now() - 3600000 * 12,
    updatedAt: Date.now() - 3600000 * 12,
  },
  {
    id: 'prog_js_1',
    title: 'Binary Tree Level Order Traversal',
    language: 'javascript',
    code: `// Interactive JavaScript Runtime with STDIN support
const limit = parseInt(TITAN.input());
console.log("Generating Fibonacci sequence up to index:", limit);

const fib = [0, 1];
for (let i = 2; i <= limit; i++) {
  fib.push(fib[i - 1] + fib[i - 2]);
}

console.log("Result:", fib);
console.log("Golden Ratio approx:", (fib[limit] / fib[limit - 1]).toFixed(6));
`,
    stdin: `10`,
    createdAt: Date.now() - 3600000 * 6,
    updatedAt: Date.now() - 3600000 * 6,
  },
];

const DEFAULT_NOTES: UserNote[] = [
  {
    id: 'note_1',
    domain: 'DSA',
    title: 'Dijkstra Priority Queue Invariant',
    content: 'Always mark a node as settled only after extracting from the Min-Heap. Negative weights break the greedy invariant.',
    updatedAt: Date.now() - 100000,
  },
  {
    id: 'note_2',
    domain: 'DBMS',
    title: 'B+ Tree Index Range Scans',
    content: 'Leaves are linked by bidirectional pointers. Leaf pages store tuples or rowids, inner nodes store keys for branching.',
    updatedAt: Date.now() - 80000,
  },
];

const DEFAULT_PROGRESS: UserProgress = {
  completedLabs: ['dsa_binary_search', 'circuits_half_adder', 'dbms_join'],
  lastActiveModule: 'home',
  totalTimeMinutes: 142,
  programsCreated: 3,
  assessmentsPassed: 4,
  topicMastery: {
    'Algorithms': 78,
    'Data Structures': 85,
    'Digital Logic': 70,
    'Databases': 92,
    'Systems & Memory': 65,
  },
};

const DEFAULT_SETTINGS: SystemSettings = {
  theme: 'dark',
  focusMode: false,
  soundFx: false,
  terminalFontSize: 13,
  autoSave: true,
};

export class StorageService {
  static getPrograms(): SavedProgram[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROGRAMS);
      if (!data) {
        this.savePrograms(DEFAULT_PROGRAMS);
        return DEFAULT_PROGRAMS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_PROGRAMS;
    }
  }

  static savePrograms(programs: SavedProgram[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(programs));
    } catch (e) {
      console.error('Failed to save programs', e);
    }
  }

  static saveProgram(program: SavedProgram): void {
    const progs = this.getPrograms();
    const idx = progs.findIndex((p) => p.id === program.id);
    if (idx >= 0) {
      progs[idx] = program;
    } else {
      progs.unshift(program);
    }
    this.savePrograms(progs);
  }

  static deleteProgram(id: string): void {
    const progs = this.getPrograms().filter((p) => p.id !== id);
    this.savePrograms(progs);
  }

  static getNotes(): UserNote[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (!data) {
        this.saveNotes(DEFAULT_NOTES);
        return DEFAULT_NOTES;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_NOTES;
    }
  }

  static saveNotes(notes: UserNote[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to save notes', e);
    }
  }

  static getProgress(): UserProgress {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      if (!data) {
        this.saveProgress(DEFAULT_PROGRESS);
        return DEFAULT_PROGRESS;
      }
      return { ...DEFAULT_PROGRESS, ...JSON.parse(data) };
    } catch {
      return DEFAULT_PROGRESS;
    }
  }

  static saveProgress(progress: UserProgress): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save progress', e);
    }
  }

  static recordLabCompletion(labId: string): void {
    const progress = this.getProgress();
    if (!progress.completedLabs.includes(labId)) {
      progress.completedLabs.push(labId);
      progress.totalTimeMinutes += 15;
      this.saveProgress(progress);
    }
  }

  static getAssessmentAttempts(): AssessmentAttempt[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveAssessmentAttempt(attempt: AssessmentAttempt): void {
    const attempts = this.getAssessmentAttempts();
    attempts.unshift(attempt);
    try {
      localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts.slice(0, 30)));
    } catch (e) {
      console.error('Failed to save attempt', e);
    }

    const progress = this.getProgress();
    if (attempt.score / attempt.total >= 0.7) {
      progress.assessmentsPassed += 1;
    }
    const currentDomainMastery = progress.topicMastery[attempt.domain] || 50;
    const scorePct = Math.round((attempt.score / attempt.total) * 100);
    progress.topicMastery[attempt.domain] = Math.round((currentDomainMastery * 3 + scorePct) / 4);
    this.saveProgress(progress);
  }

  static getSettings(): SystemSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) {
        this.saveSettings(DEFAULT_SETTINGS);
        return DEFAULT_SETTINGS;
      }
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  static saveSettings(settings: SystemSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  }

  static clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.PROGRAMS);
    localStorage.removeItem(STORAGE_KEYS.NOTES);
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.ATTEMPTS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  }

  static clearAll(): void {
    this.clearAllData();
  }

  static getAssessments(): any[] {
    return this.getAssessmentAttempts();
  }

  static saveAssessment(assessment: { score: number; totalQuestions: number; mode: string; completedAt: number }): void {
    this.saveAssessmentAttempt({
      id: `attempt_${Date.now()}`,
      domain: 'Algorithms',
      difficulty: 'medium',
      score: assessment.score,
      total: assessment.totalQuestions,
      timestamp: assessment.completedAt,
      timeSpentSec: 60,
      weakTopics: [],
    });
  }

  static getCustomState<T>(key: string, defaultVal: T): T {
    try {
      const data = localStorage.getItem(`titan_custom_${key}`);
      return data ? JSON.parse(data) : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  static setCustomState<T>(key: string, val: T): void {
    try {
      localStorage.setItem(`titan_custom_${key}`, JSON.stringify(val));
    } catch (e) {
      console.error('Failed to set custom state', e);
    }
  }
}
