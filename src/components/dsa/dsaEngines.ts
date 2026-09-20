import { DsaAlgorithm, DsaStep } from '../../types';

export interface AlgorithmMetadata {
  id: DsaAlgorithm;
  name: string;
  category: 'Dynamic Programming' | 'Searching' | 'Sorting' | 'Graph Algorithms';
  timeComplexity: string;
  spaceComplexity: string;
  pseudocode: string[];
}

export const DSA_ALGORITHMS: AlgorithmMetadata[] = [
  // --- Dynamic Programming & DP Patterns ---
  {
    id: 'lcs',
    name: 'Longest Common Subsequence (DP)',
    category: 'Dynamic Programming',
    timeComplexity: 'O(m × n)',
    spaceComplexity: 'O(m × n)',
    pseudocode: [
      'for i from 1 to m:',
      '  for j from 1 to n:',
      '    if s1[i-1] == s2[j-1]:',
      '      dp[i][j] = 1 + dp[i-1][j-1]',
      '    else:',
      '      dp[i][j] = max(dp[i-1][j], dp[i][j-1])',
      'return dp[m][n]',
    ],
  },
  {
    id: 'edit_distance',
    name: 'Edit Distance / Levenshtein (DP)',
    category: 'Dynamic Programming',
    timeComplexity: 'O(m × n)',
    spaceComplexity: 'O(m × n)',
    pseudocode: [
      'for i from 1 to m:',
      '  for j from 1 to n:',
      '    if s1[i-1] == s2[j-1]: cost = 0 else: cost = 1',
      '    dp[i][j] = min(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1]+cost)',
      'return dp[m][n]',
    ],
  },
  {
    id: 'knapsack_01',
    name: '0/1 Knapsack (DP: Decision Choice Pattern)',
    category: 'Dynamic Programming',
    timeComplexity: 'O(N × W)',
    spaceComplexity: 'O(N × W)',
    pseudocode: [
      'for i from 1 to N:',
      '  for w from 0 to W:',
      '    if weights[i-1] <= w:',
      '      dp[i][w] = max(dp[i-1][w], values[i-1] + dp[i-1][w-weights[i-1]])',
      '    else:',
      '      dp[i][w] = dp[i-1][w]',
      'return dp[N][W]',
    ],
  },
  {
    id: 'coin_change',
    name: 'Coin Change (DP: Unbounded Knapsack Pattern)',
    category: 'Dynamic Programming',
    timeComplexity: 'O(amount × coins)',
    spaceComplexity: 'O(amount)',
    pseudocode: [
      'dp[0] = 0, all other dp[a] = ∞',
      'for a from 1 to amount:',
      '  for coin in coins:',
      '    if a >= coin:',
      '      dp[a] = min(dp[a], 1 + dp[a - coin])',
      'return dp[amount] == ∞ ? -1 : dp[amount]',
    ],
  },
  {
    id: 'lis',
    name: 'Longest Increasing Subsequence (DP: Sequence Pattern)',
    category: 'Dynamic Programming',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(n)',
    pseudocode: [
      'initialize dp array with 1 for all elements',
      'for i from 1 to n-1:',
      '  for j from 0 to i-1:',
      '    if arr[i] > arr[j]:',
      '      dp[i] = max(dp[i], 1 + dp[j])',
      'return max(dp)',
    ],
  },
  {
    id: 'matrix_chain',
    name: 'Matrix Chain Multiplication (DP: Interval Pattern)',
    category: 'Dynamic Programming',
    timeComplexity: 'O(n³)',
    spaceComplexity: 'O(n²)',
    pseudocode: [
      'for length from 2 to n:',
      '  for i from 1 to n - length + 1:',
      '    j = i + length - 1',
      '    dp[i][j] = min_{k}(dp[i][k] + dp[k+1][j] + d[i-1]*d[k]*d[j])',
      'return dp[1][n-1]',
    ],
  },
  {
    id: 'word_break',
    name: 'Word Break (DP: String Partitioning Pattern)',
    category: 'Dynamic Programming',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(n)',
    pseudocode: [
      'dp[0] = true',
      'for i from 1 to s.length:',
      '  for j from 0 to i-1:',
      '    if dp[j] and s[j..i] in dictionary:',
      '      dp[i] = true, break',
      'return dp[s.length]',
    ],
  },

  // --- Searching & Problem-Solving Patterns ---
  {
    id: 'binary_search',
    name: 'Binary Search',
    category: 'Searching',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    pseudocode: [
      'low = 0, high = n - 1',
      'while low <= high:',
      '  mid = (low + high) // 2',
      '  if arr[mid] == target: return mid',
      '  else if arr[mid] < target: low = mid + 1',
      '  else: high = mid - 1',
      'return -1',
    ],
  },
  {
    id: 'two_pointers',
    name: 'Two Sum Sorted (Two Pointers Pattern)',
    category: 'Searching',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    pseudocode: [
      'left = 0, right = n - 1',
      'while left < right:',
      '  sum = arr[left] + arr[right]',
      '  if sum == target: return (left, right)',
      '  else if sum < target: left++',
      '  else: right--',
      'return not found',
    ],
  },
  {
    id: 'sliding_window',
    name: 'Max Sum Subarray Size K (Sliding Window Pattern)',
    category: 'Searching',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    pseudocode: [
      'windowSum = sum(arr[0..k-1]), maxSum = windowSum',
      'for i from k to n-1:',
      '  windowSum += arr[i] - arr[i-k]',
      '  maxSum = max(maxSum, windowSum)',
      'return maxSum',
    ],
  },

  // --- Sorting & Divide-and-Conquer ---
  {
    id: 'bubble_sort',
    name: 'Bubble Sort',
    category: 'Sorting',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    pseudocode: [
      'for i from 0 to n-1:',
      '  for j from 0 to n-i-2:',
      '    if arr[j] > arr[j+1]:',
      '      swap(arr[j], arr[j+1])',
    ],
  },
  {
    id: 'selection_sort',
    name: 'Selection Sort',
    category: 'Sorting',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    pseudocode: [
      'for i from 0 to n-1:',
      '  min_idx = i',
      '  for j from i+1 to n-1:',
      '    if arr[j] < arr[min_idx]: min_idx = j',
      '  swap(arr[i], arr[min_idx])',
    ],
  },
  {
    id: 'insertion_sort',
    name: 'Insertion Sort',
    category: 'Sorting',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    pseudocode: [
      'for i from 1 to n-1:',
      '  key = arr[i], j = i - 1',
      '  while j >= 0 and arr[j] > key:',
      '    arr[j+1] = arr[j], j = j - 1',
      '  arr[j+1] = key',
    ],
  },
  {
    id: 'merge_sort',
    name: 'Merge Sort',
    category: 'Sorting',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    pseudocode: [
      'mergeSort(arr, l, r):',
      '  if l < r:',
      '    m = (l + r) // 2',
      '    mergeSort(arr, l, m)',
      '    mergeSort(arr, m+1, r)',
      '    merge(arr, l, m, r)',
    ],
  },
  {
    id: 'quick_sort',
    name: 'Quick Sort (Divide & Conquer)',
    category: 'Sorting',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    pseudocode: [
      'partition(arr, low, high):',
      '  pivot = arr[high], i = low - 1',
      '  for j from low to high-1:',
      '    if arr[j] < pivot: i++, swap(arr[i], arr[j])',
      '  swap(arr[i+1], arr[high]), return i+1',
    ],
  },

  // --- Graph Algorithms & Advanced Data Structures ---
  {
    id: 'bfs',
    name: 'Breadth-First Search (BFS)',
    category: 'Graph Algorithms',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    pseudocode: [
      'queue.push(start), visited[start] = true',
      'while queue is not empty:',
      '  u = queue.pop()',
      '  for each neighbor v of u:',
      '    if not visited[v]:',
      '      visited[v] = true, queue.push(v)',
    ],
  },
  {
    id: 'dfs',
    name: 'Depth-First Search (DFS)',
    category: 'Graph Algorithms',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    pseudocode: [
      'dfs(u):',
      '  visited[u] = true',
      '  for each neighbor v of u:',
      '    if not visited[v]:',
      '      dfs(v)',
    ],
  },
  {
    id: 'dijkstra',
    name: "Dijkstra's Shortest Path",
    category: 'Graph Algorithms',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    pseudocode: [
      'dist[start] = 0, pq.push((0, start))',
      'while pq is not empty:',
      '  (d, u) = pq.pop()',
      '  for each neighbor v with weight w:',
      '    if dist[u] + w < dist[v]:',
      '      dist[v] = dist[u] + w, pq.push((dist[v], v))',
    ],
  },
  {
    id: 'topological_sort',
    name: "Topological Sort (DAG / Kahn's Algorithm)",
    category: 'Graph Algorithms',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    pseudocode: [
      'calculate inDegree for each vertex',
      'enqueue all vertices with inDegree == 0',
      'while queue is not empty:',
      '  u = queue.dequeue(), order.push(u)',
      '  for neighbor v of u: inDegree[v]--',
      '  if inDegree[v] == 0: queue.enqueue(v)',
    ],
  },
  {
    id: 'kruskal',
    name: "Kruskal's Minimum Spanning Tree (Greedy / DSU)",
    category: 'Graph Algorithms',
    timeComplexity: 'O(E log E)',
    spaceComplexity: 'O(V)',
    pseudocode: [
      'sort all edges by ascending weight',
      'initialize Disjoint Set Union (DSU) for vertices',
      'for each edge (u, v, w) in sorted edges:',
      '  if find(u) != find(v):',
      '    union(u, v), add edge to MST',
      'return MST',
    ],
  },
];

// Sample graph topology
export const SAMPLE_GRAPH = {
  nodes: [
    { id: 'A', x: 60, y: 70 },
    { id: 'B', x: 190, y: 40 },
    { id: 'C', x: 190, y: 160 },
    { id: 'D', x: 330, y: 50 },
    { id: 'E', x: 330, y: 170 },
    { id: 'F', x: 420, y: 110 },
  ],
  edges: [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'C', weight: 1 },
    { from: 'B', to: 'D', weight: 5 },
    { from: 'C', to: 'D', weight: 8 },
    { from: 'C', to: 'E', weight: 10 },
    { from: 'D', to: 'E', weight: 2 },
    { from: 'D', to: 'F', weight: 6 },
    { from: 'E', to: 'F', weight: 3 },
  ],
};

// --- Step Generators ---

// 1. LCS
export function generateLcsSteps(s1: string, s2: string): DsaStep[] {
  const steps: DsaStep[] = [];
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  steps.push({
    description: `Initialize DP table of size (${m + 1} × ${n + 1}) with zeroes for base cases.`,
    highlightLines: [0, 1],
    state: { s1, s2, dp: dp.map((r) => [...r]), currentCell: [-1, -1], match: false },
  });

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const match = s1[i - 1] === s2[j - 1];
      if (match) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
        steps.push({
          description: `Match '${s1[i - 1]}' == '${s2[j - 1]}' at s1[${i - 1}] & s2[${j - 1}]. dp[${i}][${j}] = 1 + dp[${i - 1}][${j - 1}] = ${dp[i][j]}.`,
          highlightLines: [2, 3],
          state: { s1, s2, dp: dp.map((r) => [...r]), currentCell: [i, j], match: true },
        });
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        steps.push({
          description: `Mismatch '${s1[i - 1]}' != '${s2[j - 1]}'. dp[${i}][${j}] = max(top: ${dp[i - 1][j]}, left: ${dp[i][j - 1]}) = ${dp[i][j]}.`,
          highlightLines: [4, 5],
          state: { s1, s2, dp: dp.map((r) => [...r]), currentCell: [i, j], match: false },
        });
      }
    }
  }

  steps.push({
    description: `LCS computation finished! Maximum common subsequence length is ${dp[m][n]}.`,
    highlightLines: [6],
    state: { s1, s2, dp: dp.map((r) => [...r]), currentCell: [m, n], completed: true },
  });

  return steps;
}

// 2. Edit Distance
export function generateEditDistanceSteps(s1: string, s2: string): DsaStep[] {
  const steps: DsaStep[] = [];
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  steps.push({
    description: `Initialize base cases: converting prefix to empty string requires deletions/insertions.`,
    highlightLines: [0, 1],
    state: { s1, s2, dp: dp.map((r) => [...r]), currentCell: [-1, -1] },
  });

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const match = s1[i - 1] === s2[j - 1];
      const cost = match ? 0 : 1;
      const del = dp[i - 1][j] + 1;
      const ins = dp[i][j - 1] + 1;
      const sub = dp[i - 1][j - 1] + cost;
      dp[i][j] = Math.min(del, ins, sub);

      steps.push({
        description: match
          ? `'${s1[i - 1]}' == '${s2[j - 1]}': No op cost. dp[${i}][${j}] = ${dp[i][j]}.`
          : `'${s1[i - 1]}' != '${s2[j - 1]}': Min of (Del=${del}, Ins=${ins}, Sub=${sub}) = ${dp[i][j]}.`,
        highlightLines: [2, 3],
        state: { s1, s2, dp: dp.map((r) => [...r]), currentCell: [i, j], match },
      });
    }
  }

  steps.push({
    description: `Edit distance between "${s1}" and "${s2}" is ${dp[m][n]} operations.`,
    highlightLines: [4],
    state: { s1, s2, dp: dp.map((r) => [...r]), currentCell: [m, n], completed: true },
  });

  return steps;
}

// 3. 0/1 Knapsack
export function generateKnapsackSteps(
  weights: number[] = [2, 3, 4, 5],
  values: number[] = [3, 4, 5, 8],
  capacity: number = 7
): DsaStep[] {
  const steps: DsaStep[] = [];
  const N = weights.length;
  const W = capacity;
  const dp: number[][] = Array.from({ length: N + 1 }, () => Array(W + 1).fill(0));

  steps.push({
    description: `Initialize 0/1 Knapsack DP table (size: ${N + 1} items × ${W + 1} weight capacity). Base case: 0 items or 0 capacity yields 0 value.`,
    highlightLines: [0, 1],
    state: { dp: dp.map((r) => [...r]), s1: `W=${capacity}`, s2: `${N} items`, currentCell: [-1, -1] },
  });

  for (let i = 1; i <= N; i++) {
    const wt = weights[i - 1];
    const val = values[i - 1];
    for (let w = 1; w <= W; w++) {
      if (wt <= w) {
        const take = val + dp[i - 1][w - wt];
        const leave = dp[i - 1][w];
        dp[i][w] = Math.max(leave, take);
        const choseTake = take > leave;
        steps.push({
          description: `Item ${i} (wt:${wt}, val:${val}) fits in capacity ${w}. Option Leave: ${leave}, Option Take: ${val} + dp[${i - 1}][${w - wt}] = ${take}. dp[${i}][${w}] = ${dp[i][w]}.`,
          highlightLines: [2, 3],
          state: {
            dp: dp.map((r) => [...r]),
            currentCell: [i, w],
            match: choseTake,
            s1: `W=${capacity}`,
            s2: `${N} items`,
          },
        });
      } else {
        dp[i][w] = dp[i - 1][w];
        steps.push({
          description: `Item ${i} (wt:${wt}) exceeds capacity ${w}. Must leave it: dp[${i}][${w}] = dp[${i - 1}][${w}] = ${dp[i][w]}.`,
          highlightLines: [4, 5],
          state: {
            dp: dp.map((r) => [...r]),
            currentCell: [i, w],
            match: false,
            s1: `W=${capacity}`,
            s2: `${N} items`,
          },
        });
      }
    }
  }

  steps.push({
    description: `Optimal knapsack value for capacity ${W} is ${dp[N][W]}.`,
    highlightLines: [6],
    state: { dp: dp.map((r) => [...r]), currentCell: [N, W], completed: true },
  });

  return steps;
}

// 4. Coin Change
export function generateCoinChangeSteps(coins: number[] = [1, 2, 5], amount: number = 7): DsaStep[] {
  const steps: DsaStep[] = [];
  const dp: number[] = Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  steps.push({
    description: `Initialize Coin Change array dp[0..${amount}]. dp[0] = 0 (0 coins needed for 0 amount), all other entries = ∞. Coins: [${coins.join(', ')}].`,
    highlightLines: [0],
    state: { arr: dp.map((x) => (x === Infinity ? 99 : x)), low: 0, high: amount },
  });

  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (a >= c && dp[a - c] !== Infinity) {
        const candidate = 1 + dp[a - c];
        const oldVal = dp[a];
        if (candidate < dp[a]) {
          dp[a] = candidate;
          steps.push({
            description: `Amount ${a}: using coin ${c} gives 1 + dp[${a - c}] = ${candidate} coins. Updated dp[${a}] = ${candidate}.`,
            highlightLines: [3, 4],
            state: {
              arr: dp.map((x) => (x === Infinity ? 99 : x)),
              mid: a,
              comparing: [a - c],
              found: true,
            },
          });
        }
      }
    }
  }

  const result = dp[amount] === Infinity ? -1 : dp[amount];
  steps.push({
    description: `Minimum coins needed for amount ${amount} is ${result}.`,
    highlightLines: [5],
    state: { arr: dp.map((x) => (x === Infinity ? 99 : x)), mid: amount, found: true, completed: true },
  });

  return steps;
}

// 5. Longest Increasing Subsequence (LIS)
export function generateLisSteps(arr: number[] = [10, 22, 9, 33, 21, 50, 41, 60]): DsaStep[] {
  const steps: DsaStep[] = [];
  const n = arr.length;
  const dp = Array(n).fill(1);

  steps.push({
    description: `Initialize LIS dp array of size ${n} with 1 (every individual element is an increasing subsequence of length 1).`,
    highlightLines: [0],
    state: { arr: [...arr], low: 0, high: n - 1 },
  });

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      steps.push({
        description: `Comparing arr[${i}] (${arr[i]}) with arr[${j}] (${arr[j]}).`,
        highlightLines: [2, 3],
        state: { arr: [...arr], mid: i, comparing: [j, i], swapped: false },
      });

      if (arr[i] > arr[j]) {
        if (dp[j] + 1 > dp[i]) {
          dp[i] = dp[j] + 1;
          steps.push({
            description: `arr[${i}] (${arr[i]}) > arr[${j}] (${arr[j]}): Extend subsequence! dp[${i}] = dp[${j}] + 1 = ${dp[i]}.`,
            highlightLines: [4],
            state: { arr: [...arr], mid: i, comparing: [j, i], swapped: true, found: true },
          });
        }
      }
    }
  }

  const maxLis = Math.max(...dp);
  steps.push({
    description: `Longest Increasing Subsequence length is ${maxLis}.`,
    highlightLines: [5],
    state: { arr: [...arr], completed: true },
  });

  return steps;
}

// 6. Matrix Chain Multiplication
export function generateMatrixChainSteps(p: number[] = [10, 20, 30, 40, 30]): DsaStep[] {
  const steps: DsaStep[] = [];
  const n = p.length - 1; // number of matrices
  const m: number[][] = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0));

  steps.push({
    description: `Initialize cost matrix m for ${n} matrices (dimensions: ${p.join(' × ')}). Base case m[i][i] = 0.`,
    highlightLines: [0],
    state: { dp: m.map((r) => [...r]), currentCell: [-1, -1], s1: `${n} matrices`, s2: 'dims' },
  });

  for (let L = 2; L <= n; L++) {
    for (let i = 1; i <= n - L + 1; i++) {
      const j = i + L - 1;
      m[i][j] = Infinity;
      for (let k = i; k <= j - 1; k++) {
        const q = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j];
        if (q < m[i][j]) {
          m[i][j] = q;
          steps.push({
            description: `Sub-chain M[${i}..${j}] split at k=${k}: Cost = ${m[i][k]} + ${m[k + 1][j]} + ${p[i - 1]}×${p[k]}×${p[j]} = ${q}.`,
            highlightLines: [3],
            state: { dp: m.map((r) => [...r]), currentCell: [i, j], match: true },
          });
        }
      }
    }
  }

  steps.push({
    description: `Minimum scalar multiplications for chain is ${m[1][n]}.`,
    highlightLines: [4],
    state: { dp: m.map((r) => [...r]), currentCell: [1, n], completed: true },
  });

  return steps;
}

// 7. Word Break
export function generateWordBreakSteps(
  s: string = 'leetcode',
  wordDict: string[] = ['leet', 'code']
): DsaStep[] {
  const steps: DsaStep[] = [];
  const n = s.length;
  const dp: boolean[] = Array(n + 1).fill(false);
  dp[0] = true;

  steps.push({
    description: `Initialize Word Break DP array of length ${n + 1}. dp[0] = true (empty string can always be formed). Dictionary: [${wordDict.join(', ')}].`,
    highlightLines: [0],
    state: { arr: dp.map((v) => (v ? 1 : 0)), s1: s, s2: wordDict.join(',') },
  });

  for (let i = 1; i <= n; i++) {
    for (let j = 0; j < i; j++) {
      const sub = s.substring(j, i);
      const inDict = wordDict.includes(sub);
      if (dp[j] && inDict) {
        dp[i] = true;
        steps.push({
          description: `Prefix s[0..${j}] is valid (dp[${j}]=true) AND "${sub}" is in dictionary. Setting dp[${i}] = true.`,
          highlightLines: [3, 4],
          state: { arr: dp.map((v) => (v ? 1 : 0)), mid: i, found: true },
        });
        break;
      }
    }
  }

  steps.push({
    description: `Word break result for "${s}": ${dp[n] ? 'SUCCESS (can be segmented)' : 'FAILURE'}.`,
    highlightLines: [5],
    state: { arr: dp.map((v) => (v ? 1 : 0)), mid: n, found: dp[n], completed: true },
  });

  return steps;
}

// 8. Two Pointers (Two Sum Sorted)
export function generateTwoPointersSteps(
  arr: number[] = [2, 7, 11, 15, 19, 23, 28],
  target: number = 26
): DsaStep[] {
  const steps: DsaStep[] = [];
  const sorted = [...arr].sort((a, b) => a - b);
  let left = 0;
  let right = sorted.length - 1;

  steps.push({
    description: `Initialize Two Pointers: Left pointer at index 0 (${sorted[0]}), Right pointer at index ${right} (${sorted[right]}). Target Sum = ${target}.`,
    highlightLines: [0],
    state: { arr: sorted, low: left, high: right },
  });

  while (left < right) {
    const sum = sorted[left] + sorted[right];
    steps.push({
      description: `Testing sum: arr[${left}] (${sorted[left]}) + arr[${right}] (${sorted[right]}) = ${sum}. Target is ${target}.`,
      highlightLines: [2],
      state: { arr: sorted, low: left, high: right, comparing: [left, right] },
    });

    if (sum === target) {
      steps.push({
        description: `Target ${target} found! Pair is arr[${left}]=${sorted[left]} and arr[${right}]=${sorted[right]}.`,
        highlightLines: [3],
        state: { arr: sorted, low: left, high: right, found: true, completed: true },
      });
      return steps;
    } else if (sum < target) {
      steps.push({
        description: `Sum ${sum} < ${target}: Increment left pointer to increase total sum.`,
        highlightLines: [4],
        state: { arr: sorted, low: left + 1, high: right },
      });
      left++;
    } else {
      steps.push({
        description: `Sum ${sum} > ${target}: Decrement right pointer to decrease total sum.`,
        highlightLines: [5],
        state: { arr: sorted, low: left, high: right - 1 },
      });
      right--;
    }
  }

  steps.push({
    description: `Pointers met without finding a pair summing to ${target}.`,
    highlightLines: [6],
    state: { arr: sorted, low: left, high: right, completed: true },
  });

  return steps;
}

// 9. Sliding Window
export function generateSlidingWindowSteps(
  arr: number[] = [2, 1, 5, 1, 3, 2, 8, 4],
  k: number = 3
): DsaStep[] {
  const steps: DsaStep[] = [];
  const n = arr.length;
  let windowSum = 0;

  for (let i = 0; i < k; i++) windowSum += arr[i];
  let maxSum = windowSum;

  steps.push({
    description: `Initialize Sliding Window of size k=${k}. Initial sum of window [0..${k - 1}] is ${windowSum}.`,
    highlightLines: [0],
    state: { arr, low: 0, high: k - 1, comparing: Array.from({ length: k }, (_, i) => i) },
  });

  for (let i = k; i < n; i++) {
    const outgoing = arr[i - k];
    const incoming = arr[i];
    windowSum = windowSum - outgoing + incoming;
    const isNewMax = windowSum > maxSum;
    if (isNewMax) maxSum = windowSum;

    steps.push({
      description: `Slide window to indices [${i - k + 1}..${i}]: Subtracted ${outgoing}, added ${incoming}. New window sum = ${windowSum}${isNewMax ? ` (New Max!)` : ''}.`,
      highlightLines: [2, 3],
      state: {
        arr,
        low: i - k + 1,
        high: i,
        comparing: Array.from({ length: k }, (_, idx) => i - k + 1 + idx),
        found: isNewMax,
      },
    });
  }

  steps.push({
    description: `Sliding window completed. Maximum subarray sum of size ${k} is ${maxSum}.`,
    highlightLines: [4],
    state: { arr, completed: true },
  });

  return steps;
}

// 10. Binary Search
export function generateBinarySearchSteps(arr: number[], target: number): DsaStep[] {
  const sorted = [...arr].sort((a, b) => a - b);
  const steps: DsaStep[] = [];
  let low = 0;
  let high = sorted.length - 1;

  steps.push({
    description: `Array sorted: [${sorted.join(', ')}]. Initial search window: low=0, high=${high}, target=${target}.`,
    highlightLines: [0],
    state: { arr: sorted, low, high, mid: -1, found: false },
  });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midVal = sorted[mid];

    steps.push({
      description: `Evaluated midpoint at index ${mid} (value: ${midVal}). Comparing with target ${target}.`,
      highlightLines: [1, 2],
      state: { arr: sorted, low, high, mid, found: false },
    });

    if (midVal === target) {
      steps.push({
        description: `Target ${target} located precisely at index ${mid}! Search successful.`,
        highlightLines: [3],
        state: { arr: sorted, low, high, mid, found: true, completed: true },
      });
      return steps;
    } else if (midVal < target) {
      steps.push({
        description: `${midVal} < ${target}: Target must lie in the right half. Setting low = ${mid + 1}.`,
        highlightLines: [4],
        state: { arr: sorted, low: mid + 1, high, mid, found: false },
      });
      low = mid + 1;
    } else {
      steps.push({
        description: `${midVal} > ${target}: Target must lie in the left half. Setting high = ${mid - 1}.`,
        highlightLines: [5],
        state: { arr: sorted, low, high: mid - 1, mid, found: false },
      });
      high = mid - 1;
    }
  }

  steps.push({
    description: `Search window exhausted (low > high). Target ${target} does not exist in array.`,
    highlightLines: [6],
    state: { arr: sorted, low, high, mid: -1, found: false, completed: true },
  });

  return steps;
}

// 11. Bubble Sort
export function generateBubbleSortSteps(arr: number[]): DsaStep[] {
  const steps: DsaStep[] = [];
  const a = [...arr];
  const n = a.length;

  steps.push({
    description: `Initialize Bubble Sort with ${n} elements.`,
    highlightLines: [0],
    state: { arr: [...a], comparing: [], swapped: false },
  });

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      const willSwap = a[j] > a[j + 1];
      steps.push({
        description: `Comparing elements at [${j}] (${a[j]}) and [${j + 1}] (${a[j + 1]}).`,
        highlightLines: [1, 2],
        state: { arr: [...a], comparing: [j, j + 1], swapped: false },
      });

      if (willSwap) {
        const temp = a[j];
        a[j] = a[j + 1];
        a[j + 1] = temp;
        steps.push({
          description: `Swapped [${j}] (${a[j + 1]}) and [${j + 1}] (${a[j]}) because ${a[j + 1]} > ${a[j]}.`,
          highlightLines: [3],
          state: { arr: [...a], comparing: [j, j + 1], swapped: true },
        });
      }
    }
  }

  steps.push({
    description: `Array fully sorted in non-decreasing order!`,
    highlightLines: [0],
    state: { arr: [...a], comparing: [], completed: true },
  });

  return steps;
}

// 12. Selection Sort
export function generateSelectionSortSteps(arr: number[]): DsaStep[] {
  const steps: DsaStep[] = [];
  const a = [...arr];
  const n = a.length;

  for (let i = 0; i < n; i++) {
    let minIdx = i;
    steps.push({
      description: `Starting pass ${i + 1}: current minimum assumed at index [${i}] (${a[i]}).`,
      highlightLines: [0, 1],
      state: { arr: [...a], minIdx, comparing: [i] },
    });

    for (let j = i + 1; j < n; j++) {
      const isNewMin = a[j] < a[minIdx];
      steps.push({
        description: `Comparing index [${j}] (${a[j]}) with current minimum at [${minIdx}] (${a[minIdx]}).`,
        highlightLines: [2],
        state: { arr: [...a], minIdx, comparing: [minIdx, j] },
      });

      if (isNewMin) {
        minIdx = j;
        steps.push({
          description: `New minimum identified at index [${minIdx}] (value: ${a[minIdx]}).`,
          highlightLines: [3],
          state: { arr: [...a], minIdx, comparing: [minIdx] },
        });
      }
    }

    if (minIdx !== i) {
      const temp = a[i];
      a[i] = a[minIdx];
      a[minIdx] = temp;
      steps.push({
        description: `Swapped element at [${i}] (${temp}) with minimum element at [${minIdx}] (${a[i]}).`,
        highlightLines: [4],
        state: { arr: [...a], minIdx: i, comparing: [i, minIdx], swapped: true },
      });
    }
  }

  steps.push({
    description: `Selection Sort complete. Array is completely sorted.`,
    highlightLines: [0],
    state: { arr: [...a], minIdx: -1, comparing: [], completed: true },
  });

  return steps;
}

// 13. Insertion Sort
export function generateInsertionSortSteps(arr: number[]): DsaStep[] {
  const steps: DsaStep[] = [];
  const a = [...arr];
  const n = a.length;

  steps.push({
    description: `First element [${a[0]}] considered sorted by definition. Starting from index 1.`,
    highlightLines: [0],
    state: { arr: [...a], keyIdx: -1 },
  });

  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;

    steps.push({
      description: `Selected key element ${key} at index [${i}] to insert into sorted prefix.`,
      highlightLines: [1],
      state: { arr: [...a], keyIdx: i },
    });

    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      steps.push({
        description: `Shifted ${a[j]} from [${j}] to [${j + 1}] because ${a[j]} > ${key}.`,
        highlightLines: [2, 3],
        state: { arr: [...a], keyIdx: j + 1, comparing: [j, j + 1] },
      });
      j--;
    }
    a[j + 1] = key;
    steps.push({
      description: `Inserted key ${key} at sorted position [${j + 1}].`,
      highlightLines: [4],
      state: { arr: [...a], keyIdx: j + 1 },
    });
  }

  steps.push({
    description: `Insertion sort complete. All elements placed in correct order.`,
    highlightLines: [0],
    state: { arr: [...a], keyIdx: -1, completed: true },
  });

  return steps;
}

// 14. Merge Sort
export function generateMergeSortSteps(arr: number[]): DsaStep[] {
  const steps: DsaStep[] = [];
  const a = [...arr];

  function merge(l: number, m: number, r: number) {
    const leftArr = a.slice(l, m + 1);
    const rightArr = a.slice(m + 1, r + 1);
    let i = 0,
      j = 0,
      k = l;

    steps.push({
      description: `Merging subarrays: Left [${leftArr.join(', ')}] and Right [${rightArr.join(', ')}].`,
      highlightLines: [5],
      state: { arr: [...a], low: l, mid: m, high: r },
    });

    while (i < leftArr.length && j < rightArr.length) {
      if (leftArr[i] <= rightArr[j]) {
        a[k] = leftArr[i];
        i++;
      } else {
        a[k] = rightArr[j];
        j++;
      }
      k++;
    }
    while (i < leftArr.length) {
      a[k] = leftArr[i];
      i++;
      k++;
    }
    while (j < rightArr.length) {
      a[k] = rightArr[j];
      j++;
      k++;
    }

    steps.push({
      description: `Subarrays merged: [${a.slice(l, r + 1).join(', ')}] at indices [${l}..${r}].`,
      highlightLines: [5],
      state: { arr: [...a], low: l, high: r },
    });
  }

  function sort(l: number, r: number) {
    if (l < r) {
      const m = Math.floor((l + r) / 2);
      steps.push({
        description: `Dividing array [${l}..${r}] at midpoint ${m}.`,
        highlightLines: [2, 3],
        state: { arr: [...a], low: l, mid: m, high: r },
      });
      sort(l, m);
      sort(m + 1, r);
      merge(l, m, r);
    }
  }

  sort(0, a.length - 1);

  steps.push({
    description: `Merge Sort complete! Full array sorted in O(n log n) time.`,
    highlightLines: [0],
    state: { arr: [...a], completed: true },
  });

  return steps;
}

// 15. Quick Sort
export function generateQuickSortSteps(arr: number[]): DsaStep[] {
  const steps: DsaStep[] = [];
  const a = [...arr];

  function partition(low: number, high: number): number {
    const pivot = a[high];
    let i = low - 1;

    steps.push({
      description: `Selected pivot ${pivot} at index [${high}] for partition range [${low}..${high}].`,
      highlightLines: [1],
      state: { arr: [...a], low, high, mid: high },
    });

    for (let j = low; j < high; j++) {
      steps.push({
        description: `Comparing a[${j}] (${a[j]}) with pivot (${pivot}).`,
        highlightLines: [2],
        state: { arr: [...a], low, high, mid: high, comparing: [j, high] },
      });

      if (a[j] < pivot) {
        i++;
        const temp = a[i];
        a[i] = a[j];
        a[j] = temp;
        steps.push({
          description: `Swapped smaller element ${a[i]} with ${temp} to left of partition.`,
          highlightLines: [3],
          state: { arr: [...a], low, high, mid: high, swapped: true },
        });
      }
    }

    const temp = a[i + 1];
    a[i + 1] = a[high];
    a[high] = temp;

    steps.push({
      description: `Placed pivot ${pivot} into final sorted position [${i + 1}].`,
      highlightLines: [4],
      state: { arr: [...a], low, high, mid: i + 1, found: true },
    });

    return i + 1;
  }

  function qsort(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      qsort(low, pi - 1);
      qsort(pi + 1, high);
    }
  }

  qsort(0, a.length - 1);

  steps.push({
    description: `Quick Sort completed successfully!`,
    highlightLines: [0],
    state: { arr: [...a], completed: true },
  });

  return steps;
}

// 16. BFS
export function generateBfsSteps(startNode: string = 'A'): DsaStep[] {
  const steps: DsaStep[] = [];
  const visited: Set<string> = new Set();
  const queue: string[] = [startNode];
  visited.add(startNode);

  steps.push({
    description: `Enqueued start node ${startNode} and marked visited.`,
    highlightLines: [0],
    state: { visited: Array.from(visited), queue: [...queue], currentNode: startNode },
  });

  while (queue.length > 0) {
    const u = queue.shift()!;
    steps.push({
      description: `Dequeued node ${u}. Exploring unvisited adjacent neighbors.`,
      highlightLines: [2],
      state: { visited: Array.from(visited), queue: [...queue], currentNode: u },
    });

    const neighbors = SAMPLE_GRAPH.edges
      .filter((e) => e.from === u || e.to === u)
      .map((e) => (e.from === u ? e.to : e.from));

    for (const v of neighbors) {
      if (!visited.has(v)) {
        visited.add(v);
        queue.push(v);
        steps.push({
          description: `Discovered neighbor ${v} via node ${u}. Marked visited and enqueued.`,
          highlightLines: [4, 5],
          state: {
            visited: Array.from(visited),
            queue: [...queue],
            currentNode: u,
            activeEdge: { from: u, to: v },
          },
        });
      }
    }
  }

  steps.push({
    description: `BFS traversal completed. All reachable nodes visited.`,
    highlightLines: [1],
    state: { visited: Array.from(visited), queue: [], currentNode: null, completed: true },
  });

  return steps;
}

// 17. DFS
export function generateDfsSteps(startNode: string = 'A'): DsaStep[] {
  const steps: DsaStep[] = [];
  const visited: Set<string> = new Set();

  function dfs(u: string) {
    visited.add(u);
    steps.push({
      description: `Visited node ${u}. Recursively exploring neighbors in depth.`,
      highlightLines: [1],
      state: { visited: Array.from(visited), currentNode: u },
    });

    const neighbors = SAMPLE_GRAPH.edges
      .filter((e) => e.from === u || e.to === u)
      .map((e) => (e.from === u ? e.to : e.from));

    for (const v of neighbors) {
      if (!visited.has(v)) {
        steps.push({
          description: `Advancing to unvisited neighbor ${v} from node ${u}.`,
          highlightLines: [3, 4],
          state: { visited: Array.from(visited), currentNode: u, activeEdge: { from: u, to: v } },
        });
        dfs(v);
      }
    }
  }

  dfs(startNode);

  steps.push({
    description: `DFS traversal complete. Recursion unwound.`,
    highlightLines: [0],
    state: { visited: Array.from(visited), currentNode: null, completed: true },
  });

  return steps;
}

// 18. Dijkstra
export function generateDijkstraSteps(startNode: string = 'A'): DsaStep[] {
  const steps: DsaStep[] = [];
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const visited: Set<string> = new Set();

  SAMPLE_GRAPH.nodes.forEach((n) => {
    dist[n.id] = Infinity;
    prev[n.id] = null;
  });
  dist[startNode] = 0;

  steps.push({
    description: `Initialize Dijkstra: dist[${startNode}] = 0, all other distances = ∞.`,
    highlightLines: [0],
    state: { dist: { ...dist }, visited: [], currentNode: null, activeEdge: null },
  });

  for (let i = 0; i < SAMPLE_GRAPH.nodes.length; i++) {
    let u: string | null = null;
    let minDist = Infinity;

    for (const n of SAMPLE_GRAPH.nodes) {
      if (!visited.has(n.id) && dist[n.id] < minDist) {
        minDist = dist[n.id];
        u = n.id;
      }
    }

    if (!u || minDist === Infinity) break;

    visited.add(u);
    steps.push({
      description: `Extracted node ${u} with minimum settled distance ${minDist}.`,
      highlightLines: [1, 2],
      state: { dist: { ...dist }, visited: Array.from(visited), currentNode: u },
    });

    for (const edge of SAMPLE_GRAPH.edges) {
      let v: string | null = null;
      let w = edge.weight;
      if (edge.from === u) v = edge.to;
      else if (edge.to === u) v = edge.from;

      if (v && !visited.has(v)) {
        const newDist = dist[u] + w;
        if (newDist < dist[v]) {
          dist[v] = newDist;
          prev[v] = u;
          steps.push({
            description: `Relaxing edge (${u} - ${v}, wt: ${w}): New shorter distance to ${v} is ${newDist}.`,
            highlightLines: [3, 4, 5],
            state: {
              dist: { ...dist },
              visited: Array.from(visited),
              currentNode: u,
              activeEdge: { from: u, to: v },
            },
          });
        }
      }
    }
  }

  steps.push({
    description: `Dijkstra's algorithm terminated. All shortest paths from source ${startNode} computed!`,
    highlightLines: [0],
    state: { dist: { ...dist }, visited: Array.from(visited), currentNode: null, completed: true },
  });

  return steps;
}

// 19. Topological Sort
export function generateTopologicalSortSteps(): DsaStep[] {
  const steps: DsaStep[] = [];
  const inDegree: Record<string, number> = { A: 0, B: 1, C: 1, D: 2, E: 2, F: 2 };
  const queue: string[] = ['A'];
  const order: string[] = [];

  steps.push({
    description: `Calculate in-degrees for DAG vertices. A has in-degree 0; enqueue A.`,
    highlightLines: [0, 1],
    state: { visited: [], queue: [...queue], currentNode: 'A' },
  });

  while (queue.length > 0) {
    const u = queue.shift()!;
    order.push(u);

    steps.push({
      description: `Processed vertex ${u} (in-degree was 0). Appended to topological order: [${order.join(', ')}].`,
      highlightLines: [3],
      state: { visited: [...order], queue: [...queue], currentNode: u },
    });

    const neighbors = SAMPLE_GRAPH.edges.filter((e) => e.from === u).map((e) => e.to);
    for (const v of neighbors) {
      if (inDegree[v] > 0) {
        inDegree[v]--;
        if (inDegree[v] === 0) {
          queue.push(v);
          steps.push({
            description: `Edge (${u} -> ${v}) removed. in-degree[${v}] is now 0; enqueued ${v}.`,
            highlightLines: [4, 5],
            state: {
              visited: [...order],
              queue: [...queue],
              currentNode: u,
              activeEdge: { from: u, to: v },
            },
          });
        }
      }
    }
  }

  steps.push({
    description: `Topological ordering complete: [${order.join(' → ')}].`,
    highlightLines: [2],
    state: { visited: [...order], queue: [], currentNode: null, completed: true },
  });

  return steps;
}

// 20. Kruskal's MST
export function generateKruskalSteps(): DsaStep[] {
  const steps: DsaStep[] = [];
  const sortedEdges = [...SAMPLE_GRAPH.edges].sort((a, b) => a.weight - b.weight);
  const parent: Record<string, string> = {};
  SAMPLE_GRAPH.nodes.forEach((n) => (parent[n.id] = n.id));

  function find(u: string): string {
    if (parent[u] === u) return u;
    return (parent[u] = find(parent[u]));
  }

  const mstEdges: typeof SAMPLE_GRAPH.edges = [];

  steps.push({
    description: `Sorted ${sortedEdges.length} edges by ascending weight. Initialized Disjoint Sets.`,
    highlightLines: [0, 1],
    state: { visited: [], currentNode: null },
  });

  for (const edge of sortedEdges) {
    const rootU = find(edge.from);
    const rootV = find(edge.to);

    if (rootU !== rootV) {
      parent[rootU] = rootV;
      mstEdges.push(edge);
      steps.push({
        description: `Edge (${edge.from} - ${edge.to}, wt: ${edge.weight}) connects components '${rootU}' and '${rootV}'. Added to MST!`,
        highlightLines: [3, 4],
        state: {
          visited: mstEdges.map((e) => e.from),
          activeEdge: { from: edge.from, to: edge.to },
        },
      });
    } else {
      steps.push({
        description: `Edge (${edge.from} - ${edge.to}, wt: ${edge.weight}) would create a cycle (both in component '${rootU}'). Skipped!`,
        highlightLines: [2],
        state: {
          visited: mstEdges.map((e) => e.from),
          activeEdge: { from: edge.from, to: edge.to },
        },
      });
    }
  }

  const totalWt = mstEdges.reduce((acc, e) => acc + e.weight, 0);
  steps.push({
    description: `Kruskal's MST complete with ${mstEdges.length} edges and total weight ${totalWt}.`,
    highlightLines: [5],
    state: { visited: SAMPLE_GRAPH.nodes.map((n) => n.id), currentNode: null, completed: true },
  });

  return steps;
}
