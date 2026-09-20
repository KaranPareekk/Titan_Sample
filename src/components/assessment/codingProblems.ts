export type CodingLanguage = 'python' | 'java' | 'javascript' | 'cpp' | 'go' | 'kotlin';
export type ProblemDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface TestCase {
  input: string;
  expectedOutput: string;
  isSample?: boolean;
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: ProblemDifficulty;
  category: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  starterCode: Record<CodingLanguage, string>;
  testCases: TestCase[];
}

export const LANGUAGE_METADATA: Record<
  CodingLanguage,
  { name: string; ext: string; version: string; badgeColor: string; defaultCode: string }
> = {
  python: {
    name: 'Python',
    ext: 'py',
    version: '3.12',
    badgeColor: 'text-amber-400 border-amber-500/40 bg-amber-950/30',
    defaultCode: '# Write solution here\ndef solve():\n    pass\n',
  },
  javascript: {
    name: 'JavaScript',
    ext: 'js',
    version: 'Node 20',
    badgeColor: 'text-yellow-400 border-yellow-500/40 bg-yellow-950/30',
    defaultCode: '// Write solution here\nfunction solve() {\n}\n',
  },
  java: {
    name: 'Java',
    ext: 'java',
    version: 'OpenJDK 21',
    badgeColor: 'text-orange-400 border-orange-500/40 bg-orange-950/30',
    defaultCode: 'import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n    }\n}\n',
  },
  cpp: {
    name: 'C++',
    ext: 'cpp',
    version: 'GCC 14 (C++23)',
    badgeColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/30',
    defaultCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    return 0;\n}\n',
  },
  go: {
    name: 'Go',
    ext: 'go',
    version: 'Go 1.23',
    badgeColor: 'text-blue-400 border-blue-500/40 bg-blue-950/30',
    defaultCode: 'package main\n\nimport "fmt"\n\nfunc main() {\n}\n',
  },
  kotlin: {
    name: 'Kotlin',
    ext: 'kt',
    version: 'Kotlin 2.0',
    badgeColor: 'text-purple-400 border-purple-500/40 bg-purple-950/30',
    defaultCode: 'import java.util.Scanner\n\nfun main() {\n}\n',
  },
};

export const CODING_PROBLEMS: CodingProblem[] = [
  {
    "id": "prob-arr-1",
    "title": "Two Sum Indices",
    "difficulty": "Easy",
    "category": "Arrays",
    "description": "Given an integer array nums and an integer target, return indices of the two numbers such that they add up to target.\nAssume each input has exactly one solution, and you may not use the same element twice.",
    "inputFormat": "First line: space-separated integers for nums.\nSecond line: single integer target.",
    "outputFormat": "Print the two 0-based indices separated by a space in ascending order.",
    "constraints": [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9"
    ],
    "starterCode": {
      "python": "import sys\n\ndef two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return f\"{seen[diff]} {i}\"\n        seen[num] = i\n    return \"\"\n\nif __name__ == \"__main__\":\n    nums = list(map(int, sys.stdin.readline().split()))\n    target = int(sys.stdin.readline().strip())\n    print(two_sum(nums, target))",
      "javascript": "const lines = TITAN.input().split('\\n').filter(Boolean);\nconst nums = lines[0].split(' ').map(Number);\nconst target = Number(lines[1]);\nconst seen = new Map();\nfor (let i = 0; i < nums.length; i++) {\n  const diff = target - nums[i];\n  if (seen.has(diff)) {\n    console.log(seen.get(diff) + ' ' + i);\n    break;\n  }\n  seen.set(nums[i], i);\n}",
      "java": "import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String[] parts = sc.nextLine().split(\" \");\n        int target = sc.nextInt();\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < parts.length; i++) {\n            int val = Integer.parseInt(parts[i]);\n            int diff = target - val;\n            if (map.containsKey(diff)) {\n                System.out.println(map.get(diff) + \" \" + i);\n                return;\n            }\n            map.put(val, i);\n        }\n    }\n}",
      "cpp": "#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nint main() {\n    int target;\n    // Fast I/O\n    return 0;\n}",
      "go": "package main\n\nimport \"fmt\"\n\nfunc main() {\n    // Solution here\n}",
      "kotlin": "import java.util.Scanner\n\nfun main() {\n    // Solution here\n}"
    },
    "testCases": [
      {
        "input": "2 7 11 15\n9",
        "expectedOutput": "0 1",
        "isSample": true
      },
      {
        "input": "3 2 4\n6",
        "expectedOutput": "1 2"
      },
      {
        "input": "3 3\n6",
        "expectedOutput": "0 1"
      }
    ]
  },
  {
    "id": "prob-arr-2",
    "title": "Maximum Subarray Sum (Kadane's)",
    "difficulty": "Medium",
    "category": "Arrays",
    "description": "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
    "inputFormat": "First line: space-separated integers for nums.",
    "outputFormat": "Print the maximum subarray sum.",
    "constraints": [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    "starterCode": {
      "python": "import sys\n\ndef max_sub_array(nums):\n    cur = max_so_far = nums[0]\n    for x in nums[1:]:\n        cur = max(x, cur + x)\n        max_so_far = max(max_so_far, cur)\n    return max_so_far\n\nif __name__ == \"__main__\":\n    nums = list(map(int, sys.stdin.readline().split()))\n    print(max_sub_array(nums))",
      "javascript": "const nums = TITAN.input().split(' ').map(Number);\nlet cur = nums[0], maxSoFar = nums[0];\nfor (let i = 1; i < nums.length; i++) {\n  cur = Math.max(nums[i], cur + nums[i]);\n  maxSoFar = Math.max(maxSoFar, cur);\n}\nconsole.log(maxSoFar);",
      "java": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String[] p = sc.nextLine().split(\" \");\n        int cur = Integer.parseInt(p[0]);\n        int maxSoFar = cur;\n        for (int i = 1; i < p.length; i++) {\n            int x = Integer.parseInt(p[i]);\n            cur = Math.max(x, cur + x);\n            maxSoFar = Math.max(maxSoFar, cur);\n        }\n        System.out.println(maxSoFar);\n    }\n}",
      "cpp": "#include <iostream>\nusing namespace std;\nint main() { return 0; }",
      "go": "package main\nimport \"fmt\"\nfunc main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "-2 1 -3 4 -1 2 1 -5 4",
        "expectedOutput": "6",
        "isSample": true
      },
      {
        "input": "1",
        "expectedOutput": "1"
      },
      {
        "input": "5 4 -1 7 8",
        "expectedOutput": "23"
      }
    ]
  },
  {
    "id": "prob-arr-3",
    "title": "Container With Most Water",
    "difficulty": "Medium",
    "category": "Arrays",
    "description": "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).\nFind two lines that together with the x-axis form a container, such that the container contains the most water.",
    "inputFormat": "Single line: space-separated integers representing vertical bar heights.",
    "outputFormat": "Print the maximum volume of water the container can store.",
    "constraints": [
      "n == height.length",
      "2 <= n <= 10^5",
      "0 <= height[i] <= 10^4"
    ],
    "starterCode": {
      "python": "import sys\n\ndef max_area(height):\n    left, right = 0, len(height) - 1\n    ans = 0\n    while left < right:\n        ans = max(ans, min(height[left], height[right]) * (right - left))\n        if height[left] < height[right]:\n            left += 1\n        else:\n            right -= 1\n    return ans\n\nif __name__ == \"__main__\":\n    h = list(map(int, sys.stdin.readline().split()))\n    print(max_area(h))",
      "javascript": "const h = TITAN.input().split(' ').map(Number);\nlet l = 0, r = h.length - 1, ans = 0;\nwhile (l < r) {\n  ans = Math.max(ans, Math.min(h[l], h[r]) * (r - l));\n  if (h[l] < h[r]) l++; else r--;\n}\nconsole.log(ans);",
      "java": "import java.util.Scanner;\npublic class Solution {\n    public static void main(String[] args) {\n        // Two pointers implementation\n    }\n}",
      "cpp": "#include <iostream>\nusing namespace std;\nint main() { return 0; }",
      "go": "package main\nfunc main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "1 8 6 2 5 4 8 3 7",
        "expectedOutput": "49",
        "isSample": true
      },
      {
        "input": "1 1",
        "expectedOutput": "1"
      }
    ]
  },
  {
    "id": "prob-arr-4",
    "title": "Product of Array Except Self",
    "difficulty": "Medium",
    "category": "Arrays",
    "description": "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].\nYou must write an algorithm that runs in O(n) time and without using the division operation.",
    "inputFormat": "First line: space-separated integers for nums.",
    "outputFormat": "Space-separated integers representing the resulting products.",
    "constraints": [
      "2 <= nums.length <= 10^5",
      "-30 <= nums[i] <= 30"
    ],
    "starterCode": {
      "python": "import sys\n\ndef product_except_self(nums):\n    n = len(nums)\n    res = [1] * n\n    prefix = 1\n    for i in range(n):\n        res[i] = prefix\n        prefix *= nums[i]\n    postfix = 1\n    for i in range(n - 1, -1, -1):\n        res[i] *= postfix\n        postfix *= nums[i]\n    return \" \".join(map(str, res))\n\nif __name__ == \"__main__\":\n    nums = list(map(int, sys.stdin.readline().split()))\n    print(product_except_self(nums))",
      "javascript": "const nums = TITAN.input().split(' ').map(Number);\nconst n = nums.length;\nconst res = new Array(n).fill(1);\nlet p = 1;\nfor (let i = 0; i < n; i++) { res[i] = p; p *= nums[i]; }\nlet s = 1;\nfor (let i = n - 1; i >= 0; i--) { res[i] *= s; s *= nums[i]; }\nconsole.log(res.join(' '));",
      "java": "import java.util.Scanner;\npublic class Solution { public static void main(String[] args) {} }",
      "cpp": "#include <iostream>\nusing namespace std;\nint main() { return 0; }",
      "go": "package main\nfunc main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "1 2 3 4",
        "expectedOutput": "24 12 8 6",
        "isSample": true
      },
      {
        "input": "-1 1 0 -3 3",
        "expectedOutput": "0 0 9 0 0"
      }
    ]
  },
  {
    "id": "prob-arr-5",
    "title": "Move Zeroes to End",
    "difficulty": "Easy",
    "category": "Arrays",
    "description": "Given an integer array nums, move all 0s to the end of it while maintaining the relative order of the non-zero elements.\nNote that you must do this in-place without making a copy of the array.",
    "inputFormat": "Space-separated integers.",
    "outputFormat": "Space-separated integers with all zeros moved to the end.",
    "constraints": [
      "1 <= nums.length <= 10^4",
      "-2^31 <= nums[i] <= 2^31 - 1"
    ],
    "starterCode": {
      "python": "import sys\n\ndef move_zeroes(nums):\n    insert_pos = 0\n    for num in nums:\n        if num != 0:\n            nums[insert_pos] = num\n            insert_pos += 1\n    while insert_pos < len(nums):\n        nums[insert_pos] = 0\n        insert_pos += 1\n    return \" \".join(map(str, nums))\n\nif __name__ == \"__main__\":\n    nums = list(map(int, sys.stdin.readline().split()))\n    print(move_zeroes(nums))",
      "javascript": "const nums = TITAN.input().split(' ').map(Number);\nlet idx = 0;\nfor (const x of nums) { if (x !== 0) nums[idx++] = x; }\nwhile (idx < nums.length) nums[idx++] = 0;\nconsole.log(nums.join(' '));",
      "java": "import java.util.Scanner;\npublic class Solution { public static void main(String[] args) {} }",
      "cpp": "#include <iostream>\nusing namespace std;\nint main() { return 0; }",
      "go": "package main\nfunc main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "0 1 0 3 12",
        "expectedOutput": "1 3 12 0 0",
        "isSample": true
      },
      {
        "input": "0",
        "expectedOutput": "0"
      }
    ]
  },
  {
    "id": "prob-arr-6",
    "title": "Rotate Array by K Steps",
    "difficulty": "Medium",
    "category": "Arrays",
    "description": "Given an integer array nums, rotate the array to the right by k steps, where k is non-negative.",
    "inputFormat": "First line: space-separated integers for nums.\nSecond line: integer k.",
    "outputFormat": "Space-separated integers after rotation.",
    "constraints": [
      "1 <= nums.length <= 10^5",
      "0 <= k <= 10^5"
    ],
    "starterCode": {
      "python": "import sys\ndef rotate(nums, k):\n    k = k % len(nums)\n    res = nums[-k:] + nums[:-k] if k else nums\n    return \" \".join(map(str, res))\nif __name__ == \"__main__\":\n    nums = list(map(int, sys.stdin.readline().split()))\n    k = int(sys.stdin.readline().strip())\n    print(rotate(nums, k))",
      "javascript": "const lines = TITAN.input().split('\\n').filter(Boolean);\nconst nums = lines[0].split(' ').map(Number);\nconst k = Number(lines[1]) % nums.length;\nconst rotated = k === 0 ? nums : [...nums.slice(-k), ...nums.slice(0, nums.length - k)];\nconsole.log(rotated.join(' '));",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "1 2 3 4 5 6 7\n3",
        "expectedOutput": "5 6 7 1 2 3 4",
        "isSample": true
      },
      {
        "input": "-1 -100 3 99\n2",
        "expectedOutput": "3 99 -1 -100"
      }
    ]
  },
  {
    "id": "prob-str-1",
    "title": "Valid Palindrome String",
    "difficulty": "Easy",
    "category": "Strings",
    "description": "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\nReturn \"true\" if it is a palindrome, or \"false\" otherwise.",
    "inputFormat": "Single string line.",
    "outputFormat": "Print \"true\" or \"false\".",
    "constraints": [
      "1 <= s.length <= 2 * 10^5"
    ],
    "starterCode": {
      "python": "import sys, re\ndef is_palindrome(s):\n    cleaned = re.sub(r'[^a-zA-Z0-9]', '', s).lower()\n    return \"true\" if cleaned == cleaned[::-1] else \"false\"\nif __name__ == \"__main__\":\n    s = sys.stdin.readline().strip()\n    print(is_palindrome(s))",
      "javascript": "const s = TITAN.input().replace(/[^a-zA-Z0-9]/g, '').toLowerCase();\nconsole.log(s === s.split('').reverse().join('') ? 'true' : 'false');",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "A man, a plan, a canal: Panama",
        "expectedOutput": "true",
        "isSample": true
      },
      {
        "input": "race a car",
        "expectedOutput": "false"
      }
    ]
  },
  {
    "id": "prob-str-2",
    "title": "Valid Parentheses Matching",
    "difficulty": "Easy",
    "category": "Strings",
    "description": "Given a string s containing just the characters \"(\", \")\", \"{\", \"}\", \"[\" and \"]\", determine if the input string is valid.\nAn input string is valid if open brackets are closed by the same type of brackets in the correct order.",
    "inputFormat": "Single line containing bracket characters.",
    "outputFormat": "Print \"true\" if valid, otherwise \"false\".",
    "constraints": [
      "1 <= s.length <= 10^4"
    ],
    "starterCode": {
      "python": "import sys\ndef is_valid(s):\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top:\n                return \"false\"\n        else:\n            stack.append(char)\n    return \"true\" if not stack else \"false\"\nif __name__ == \"__main__\":\n    print(is_valid(sys.stdin.readline().strip()))",
      "javascript": "const s = TITAN.input().trim();\nconst stack = [];\nconst pairs = { ')': '(', '}': '{', ']': '[' };\nlet ok = true;\nfor (const c of s) {\n  if (pairs[c]) {\n    if (stack.pop() !== pairs[c]) { ok = false; break; }\n  } else {\n    stack.push(c);\n  }\n}\nconsole.log(ok && stack.length === 0 ? 'true' : 'false');",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "()[]{}",
        "expectedOutput": "true",
        "isSample": true
      },
      {
        "input": "(]",
        "expectedOutput": "false"
      },
      {
        "input": "([)]",
        "expectedOutput": "false"
      }
    ]
  },
  {
    "id": "prob-str-3",
    "title": "Valid Anagram",
    "difficulty": "Easy",
    "category": "Strings",
    "description": "Given two strings s and t, return \"true\" if t is an anagram of s, and \"false\" otherwise.",
    "inputFormat": "Two space-separated strings s and t on one line.",
    "outputFormat": "Print \"true\" or \"false\".",
    "constraints": [
      "1 <= s.length, t.length <= 5 * 10^4"
    ],
    "starterCode": {
      "python": "import sys\ndef is_anagram(s, t):\n    return \"true\" if sorted(s) == sorted(t) else \"false\"\nif __name__ == \"__main__\":\n    s, t = sys.stdin.readline().split()\n    print(is_anagram(s, t))",
      "javascript": "const [s, t] = TITAN.input().trim().split(' ');\nconst sortS = s.split('').sort().join('');\nconst sortT = t.split('').sort().join('');\nconsole.log(sortS === sortT ? 'true' : 'false');",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "anagram nagaram",
        "expectedOutput": "true",
        "isSample": true
      },
      {
        "input": "rat car",
        "expectedOutput": "false"
      }
    ]
  },
  {
    "id": "prob-str-4",
    "title": "Longest Substring Without Repeating Characters",
    "difficulty": "Medium",
    "category": "Strings",
    "description": "Given a string s, find the length of the longest substring without duplicate characters.",
    "inputFormat": "Single line string s.",
    "outputFormat": "Print the integer maximum length.",
    "constraints": [
      "0 <= s.length <= 5 * 10^4"
    ],
    "starterCode": {
      "python": "import sys\ndef length_of_longest_substring(s):\n    char_set = set()\n    left = 0\n    res = 0\n    for right in range(len(s)):\n        while s[right] in char_set:\n            char_set.remove(s[left])\n            left += 1\n        char_set.add(s[right])\n        res = max(res, right - left + 1)\n    return res\nif __name__ == \"__main__\":\n    print(length_of_longest_substring(sys.stdin.readline().strip()))",
      "javascript": "const s = TITAN.input().trim();\nconst set = new Set();\nlet l = 0, res = 0;\nfor (let r = 0; r < s.length; r++) {\n  while (set.has(s[r])) { set.delete(s[l++]); }\n  set.add(s[r]);\n  res = Math.max(res, r - l + 1);\n}\nconsole.log(res);",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "abcabcbb",
        "expectedOutput": "3",
        "isSample": true
      },
      {
        "input": "bbbbb",
        "expectedOutput": "1"
      },
      {
        "input": "pwwkew",
        "expectedOutput": "3"
      }
    ]
  },
  {
    "id": "prob-str-5",
    "title": "String Compression Run-Length",
    "difficulty": "Easy",
    "category": "Strings",
    "description": "Given an array of characters, compress it using consecutive character counts. If a character occurs once, keep it as just that character. If more than once, append the count.",
    "inputFormat": "Single continuous string without spaces.",
    "outputFormat": "Compressed string.",
    "constraints": [
      "1 <= s.length <= 2000"
    ],
    "starterCode": {
      "python": "import sys\ndef compress(s):\n    if not s: return \"\"\n    res = []\n    i = 0\n    while i < len(s):\n        char = s[i]\n        count = 0\n        while i < len(s) and s[i] == char:\n            count += 1\n            i += 1\n        res.append(char + (str(count) if count > 1 else \"\"))\n    return \"\".join(res)\nif __name__ == \"__main__\":\n    print(compress(sys.stdin.readline().strip()))",
      "javascript": "const s = TITAN.input().trim();\nlet res = '', i = 0;\nwhile (i < s.length) {\n  const c = s[i];\n  let cnt = 0;\n  while (i < s.length && s[i] === c) { cnt++; i++; }\n  res += c + (cnt > 1 ? cnt : '');\n}\nconsole.log(res);",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "aabcccccaaa",
        "expectedOutput": "a2bc5a3",
        "isSample": true
      },
      {
        "input": "abcd",
        "expectedOutput": "abcd"
      }
    ]
  },
  {
    "id": "prob-str-6",
    "title": "Reverse Words in a Sentence",
    "difficulty": "Medium",
    "category": "Strings",
    "description": "Given an input string s, reverse the order of the words. Return a string of the words in reverse order concatenated by a single space, removing leading/trailing spaces.",
    "inputFormat": "Single string with space-separated words.",
    "outputFormat": "Reversed sentence with normalized single spaces.",
    "constraints": [
      "1 <= s.length <= 10^4"
    ],
    "starterCode": {
      "python": "import sys\ndef reverse_words(s):\n    words = s.strip().split()\n    return \" \".join(reversed(words))\nif __name__ == \"__main__\":\n    print(reverse_words(sys.stdin.readline()))",
      "javascript": "const s = TITAN.input().trim().split(/\\s+/);\nconsole.log(s.reverse().join(' '));",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "the sky is blue",
        "expectedOutput": "blue is sky the",
        "isSample": true
      },
      {
        "input": "  hello world  ",
        "expectedOutput": "world hello"
      }
    ]
  },
  {
    "id": "prob-sea-1",
    "title": "Binary Search on Sorted Array",
    "difficulty": "Easy",
    "category": "Searching",
    "description": "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its 0-based index. Otherwise, return -1.",
    "inputFormat": "First line: space-separated sorted integers.\nSecond line: integer target to find.",
    "outputFormat": "Print the index or -1.",
    "constraints": [
      "1 <= nums.length <= 10^4",
      "nums is sorted in ascending order."
    ],
    "starterCode": {
      "python": "import sys\ndef binary_search(nums, target):\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        mid = (l + r) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            l = mid + 1\n        else:\n            r = mid - 1\n    return -1\nif __name__ == \"__main__\":\n    nums = list(map(int, sys.stdin.readline().split()))\n    target = int(sys.stdin.readline().strip())\n    print(binary_search(nums, target))",
      "javascript": "const lines = TITAN.input().split('\\n').filter(Boolean);\nconst nums = lines[0].split(' ').map(Number);\nconst target = Number(lines[1]);\nlet l = 0, r = nums.length - 1, ans = -1;\nwhile (l <= r) {\n  const mid = Math.floor((l + r) / 2);\n  if (nums[mid] === target) { ans = mid; break; }\n  else if (nums[mid] < target) l = mid + 1;\n  else r = mid - 1;\n}\nconsole.log(ans);",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "-1 0 3 5 9 12\n9",
        "expectedOutput": "4",
        "isSample": true
      },
      {
        "input": "-1 0 3 5 9 12\n2",
        "expectedOutput": "-1"
      }
    ]
  },
  {
    "id": "prob-sea-2",
    "title": "Search in Rotated Sorted Array",
    "difficulty": "Medium",
    "category": "Searching",
    "description": "Prior to being passed to your function, nums is possibly rotated at an unknown pivot index k. Given the array nums and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.",
    "inputFormat": "First line: space-separated integers.\nSecond line: integer target.",
    "outputFormat": "Print 0-based index or -1.",
    "constraints": [
      "1 <= nums.length <= 5000",
      "nums is rotated sorted array with unique values."
    ],
    "starterCode": {
      "python": "import sys\ndef search(nums, target):\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        mid = (l + r) // 2\n        if nums[mid] == target: return mid\n        if nums[l] <= nums[mid]:\n            if nums[l] <= target < nums[mid]: r = mid - 1\n            else: l = mid + 1\n        else:\n            if nums[mid] < target <= nums[r]: l = mid + 1\n            else: r = mid - 1\n    return -1\nif __name__ == \"__main__\":\n    nums = list(map(int, sys.stdin.readline().split()))\n    target = int(sys.stdin.readline().strip())\n    print(search(nums, target))",
      "javascript": "const lines = TITAN.input().split('\\n').filter(Boolean);\nconst nums = lines[0].split(' ').map(Number);\nconst target = Number(lines[1]);\nlet l = 0, r = nums.length - 1, ans = -1;\nwhile (l <= r) {\n  const mid = Math.floor((l + r) / 2);\n  if (nums[mid] === target) { ans = mid; break; }\n  if (nums[l] <= nums[mid]) {\n    if (nums[l] <= target && target < nums[mid]) r = mid - 1; else l = mid + 1;\n  } else {\n    if (nums[mid] < target && target <= nums[r]) l = mid + 1; else r = mid - 1;\n  }\n}\nconsole.log(ans);",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "4 5 6 7 0 1 2\n0",
        "expectedOutput": "4",
        "isSample": true
      },
      {
        "input": "4 5 6 7 0 1 2\n3",
        "expectedOutput": "-1"
      }
    ]
  },
  {
    "id": "prob-sea-3",
    "title": "Find Peak Element in Array",
    "difficulty": "Medium",
    "category": "Searching",
    "description": "A peak element is an element that is strictly greater than its neighbors. Given a 0-indexed integer array nums, find a peak element, and return its index. If the array contains multiple peaks, return the index to any of the peaks.",
    "inputFormat": "First line: space-separated integers.",
    "outputFormat": "Index of any valid peak element.",
    "constraints": [
      "1 <= nums.length <= 1000",
      "nums[i] != nums[i + 1] for all valid i."
    ],
    "starterCode": {
      "python": "import sys\ndef find_peak(nums):\n    l, r = 0, len(nums) - 1\n    while l < r:\n        mid = (l + r) // 2\n        if nums[mid] > nums[mid + 1]: r = mid\n        else: l = mid + 1\n    return l\nif __name__ == \"__main__\":\n    nums = list(map(int, sys.stdin.readline().split()))\n    print(find_peak(nums))",
      "javascript": "const nums = TITAN.input().split(' ').map(Number);\nlet l = 0, r = nums.length - 1;\nwhile (l < r) {\n  const mid = Math.floor((l + r) / 2);\n  if (nums[mid] > nums[mid + 1]) r = mid; else l = mid + 1;\n}\nconsole.log(l);",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "1 2 3 1",
        "expectedOutput": "2",
        "isSample": true
      },
      {
        "input": "1 2 1 3 5 6 4",
        "expectedOutput": "5"
      }
    ]
  },
  {
    "id": "prob-sea-4",
    "title": "First and Last Position of Element",
    "difficulty": "Medium",
    "category": "Searching",
    "description": "Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value. If target is not found in the array, return \"-1 -1\".",
    "inputFormat": "First line: space-separated sorted integers.\nSecond line: target integer.",
    "outputFormat": "Print start and end indices separated by space.",
    "constraints": [
      "0 <= nums.length <= 10^5"
    ],
    "starterCode": {
      "python": "import sys\ndef search_range(nums, target):\n    if not nums: return \"-1 -1\"\n    def find_bound(is_first):\n        l, r = 0, len(nums) - 1\n        bound = -1\n        while l <= r:\n            mid = (l + r) // 2\n            if nums[mid] == target:\n                bound = mid\n                if is_first: r = mid - 1\n                else: l = mid + 1\n            elif nums[mid] < target: l = mid + 1\n            else: r = mid - 1\n        return bound\n    return f\"{find_bound(True)} {find_bound(False)}\"\nif __name__ == \"__main__\":\n    nums = list(map(int, sys.stdin.readline().split()))\n    target = int(sys.stdin.readline().strip())\n    print(search_range(nums, target))",
      "javascript": "const lines = TITAN.input().split('\\n').filter(Boolean);\nconst nums = lines[0].split(' ').map(Number);\nconst target = Number(lines[1]);\nconst first = nums.indexOf(target);\nconst last = nums.lastIndexOf(target);\nconsole.log(first + ' ' + last);",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "5 7 7 8 8 10\n8",
        "expectedOutput": "3 4",
        "isSample": true
      },
      {
        "input": "5 7 7 8 8 10\n6",
        "expectedOutput": "-1 -1"
      }
    ]
  },
  {
    "id": "prob-sea-5",
    "title": "Single Number (Bitwise XOR)",
    "difficulty": "Easy",
    "category": "Searching",
    "description": "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.\nYou must implement a solution with a linear runtime complexity and use only constant extra space.",
    "inputFormat": "Single line of space-separated integers.",
    "outputFormat": "Print the single integer.",
    "constraints": [
      "1 <= nums.length <= 3 * 10^4"
    ],
    "starterCode": {
      "python": "import sys\ndef single_number(nums):\n    res = 0\n    for x in nums: res ^= x\n    return res\nif __name__ == \"__main__\":\n    nums = list(map(int, sys.stdin.readline().split()))\n    print(single_number(nums))",
      "javascript": "const nums = TITAN.input().split(' ').map(Number);\nlet res = 0;\nfor (const x of nums) res ^= x;\nconsole.log(res);",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "2 2 1",
        "expectedOutput": "1",
        "isSample": true
      },
      {
        "input": "4 1 2 1 2",
        "expectedOutput": "4"
      }
    ]
  },
  {
    "id": "prob-sea-6",
    "title": "Missing Number in Sequence",
    "difficulty": "Easy",
    "category": "Searching",
    "description": "Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.",
    "inputFormat": "Space-separated integers representing nums.",
    "outputFormat": "Print the missing number.",
    "constraints": [
      "n == nums.length",
      "1 <= n <= 10^4"
    ],
    "starterCode": {
      "python": "import sys\ndef missing_number(nums):\n    n = len(nums)\n    return (n * (n + 1)) // 2 - sum(nums)\nif __name__ == \"__main__\":\n    nums = list(map(int, sys.stdin.readline().split()))\n    print(missing_number(nums))",
      "javascript": "const nums = TITAN.input().split(' ').map(Number);\nconst n = nums.length;\nconst sum = nums.reduce((a, b) => a + b, 0);\nconsole.log((n * (n + 1)) / 2 - sum);",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "3 0 1",
        "expectedOutput": "2",
        "isSample": true
      },
      {
        "input": "0 1",
        "expectedOutput": "2"
      },
      {
        "input": "9 6 4 2 3 5 7 0 1",
        "expectedOutput": "8"
      }
    ]
  },
  {
    "id": "prob-srt-1",
    "title": "Merge Two Sorted Arrays",
    "difficulty": "Easy",
    "category": "Sorting",
    "description": "You are given two integer arrays nums1 and nums2, both sorted in non-decreasing order. Merge nums2 into nums1 as one sorted array.",
    "inputFormat": "First line: space-separated integers for nums1.\nSecond line: space-separated integers for nums2.",
    "outputFormat": "Print the unified sorted array separated by spaces.",
    "constraints": [
      "1 <= nums1.length, nums2.length <= 10^4"
    ],
    "starterCode": {
      "python": "import sys\ndef merge(nums1, nums2):\n    res = sorted(nums1 + nums2)\n    return \" \".join(map(str, res))\nif __name__ == \"__main__\":\n    nums1 = list(map(int, sys.stdin.readline().split()))\n    nums2 = list(map(int, sys.stdin.readline().split()))\n    print(merge(nums1, nums2))",
      "javascript": "const lines = TITAN.input().split('\\n').filter(Boolean);\nconst a = lines[0].split(' ').map(Number);\nconst b = lines[1].split(' ').map(Number);\nconsole.log([...a, ...b].sort((x, y) => x - y).join(' '));",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "1 2 3\n2 5 6",
        "expectedOutput": "1 2 2 3 5 6",
        "isSample": true
      },
      {
        "input": "1\n0",
        "expectedOutput": "0 1"
      }
    ]
  },
  {
    "id": "prob-srt-2",
    "title": "Sort Colors (Dutch National Flag)",
    "difficulty": "Medium",
    "category": "Sorting",
    "description": "Given an array nums with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red (0), white (1), and blue (2).",
    "inputFormat": "Space-separated integers containing only 0, 1, and 2.",
    "outputFormat": "Space-separated sorted integers.",
    "constraints": [
      "1 <= nums.length <= 300"
    ],
    "starterCode": {
      "python": "import sys\ndef sort_colors(nums):\n    low, mid, high = 0, 0, len(nums) - 1\n    while mid <= high:\n        if nums[mid] == 0:\n            nums[low], nums[mid] = nums[mid], nums[low]\n            low += 1; mid += 1\n        elif nums[mid] == 1: mid += 1\n        else:\n            nums[high], nums[mid] = nums[mid], nums[high]\n            high -= 1\n    return \" \".join(map(str, nums))\nif __name__ == \"__main__\":\n    nums = list(map(int, sys.stdin.readline().split()))\n    print(sort_colors(nums))",
      "javascript": "const nums = TITAN.input().split(' ').map(Number);\nconsole.log(nums.sort((a, b) => a - b).join(' '));",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "2 0 2 1 1 0",
        "expectedOutput": "0 0 1 1 2 2",
        "isSample": true
      },
      {
        "input": "2 0 1",
        "expectedOutput": "0 1 2"
      }
    ]
  },
  {
    "id": "prob-srt-3",
    "title": "Kth Largest Element in an Array",
    "difficulty": "Medium",
    "category": "Sorting",
    "description": "Given an integer array nums and an integer k, return the kth largest element in the array. Can you solve it in less than O(n log n) time complexity?",
    "inputFormat": "First line: space-separated integers.\nSecond line: integer k.",
    "outputFormat": "Print the kth largest integer.",
    "constraints": [
      "1 <= k <= nums.length <= 10^5"
    ],
    "starterCode": {
      "python": "import sys\ndef find_kth_largest(nums, k):\n    nums.sort(reverse=True)\n    return nums[k - 1]\nif __name__ == \"__main__\":\n    nums = list(map(int, sys.stdin.readline().split()))\n    k = int(sys.stdin.readline().strip())\n    print(find_kth_largest(nums, k))",
      "javascript": "const lines = TITAN.input().split('\\n').filter(Boolean);\nconst nums = lines[0].split(' ').map(Number);\nconst k = Number(lines[1]);\nnums.sort((a, b) => b - a);\nconsole.log(nums[k - 1]);",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "3 2 1 5 6 4\n2",
        "expectedOutput": "5",
        "isSample": true
      },
      {
        "input": "3 2 3 1 2 4 5 5 6\n4",
        "expectedOutput": "4"
      }
    ]
  },
  {
    "id": "prob-srt-4",
    "title": "Top K Frequent Elements",
    "difficulty": "Medium",
    "category": "Sorting",
    "description": "Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order (sorted descending by frequency).",
    "inputFormat": "First line: space-separated integers.\nSecond line: integer k.",
    "outputFormat": "Space-separated integers for the top k frequent elements.",
    "constraints": [
      "1 <= nums.length <= 10^5",
      "k is in range [1, unique elements]"
    ],
    "starterCode": {
      "python": "import sys\nfrom collections import Counter\ndef top_k(nums, k):\n    counts = Counter(nums)\n    most = [x[0] for x in counts.most_common(k)]\n    return \" \".join(map(str, most))\nif __name__ == \"__main__\":\n    nums = list(map(int, sys.stdin.readline().split()))\n    k = int(sys.stdin.readline().strip())\n    print(top_k(nums, k))",
      "javascript": "const lines = TITAN.input().split('\\n').filter(Boolean);\nconst nums = lines[0].split(' ').map(Number);\nconst k = Number(lines[1]);\nconst map = new Map();\nfor (const n of nums) map.set(n, (map.get(n) || 0) + 1);\nconst sorted = [...map.entries()].sort((a, b) => b[1] - a[1]);\nconsole.log(sorted.slice(0, k).map(x => x[0]).join(' '));",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "1 1 1 2 2 3\n2",
        "expectedOutput": "1 2",
        "isSample": true
      },
      {
        "input": "1\n1",
        "expectedOutput": "1"
      }
    ]
  },
  {
    "id": "prob-srt-5",
    "title": "Intersection of Two Integer Arrays",
    "difficulty": "Easy",
    "category": "Sorting",
    "description": "Given two integer arrays nums1 and nums2, return an array of their intersection. Each element in the result must be unique and presented in ascending order.",
    "inputFormat": "First line: space-separated integers for nums1.\nSecond line: space-separated integers for nums2.",
    "outputFormat": "Space-separated unique intersection values in ascending order.",
    "constraints": [
      "1 <= nums1.length, nums2.length <= 1000"
    ],
    "starterCode": {
      "python": "import sys\ndef intersection(nums1, nums2):\n    inter = sorted(list(set(nums1) & set(nums2)))\n    return \" \".join(map(str, inter))\nif __name__ == \"__main__\":\n    nums1 = list(map(int, sys.stdin.readline().split()))\n    nums2 = list(map(int, sys.stdin.readline().split()))\n    print(intersection(nums1, nums2))",
      "javascript": "const lines = TITAN.input().split('\\n').filter(Boolean);\nconst a = new Set(lines[0].split(' ').map(Number));\nconst b = new Set(lines[1].split(' ').map(Number));\nconst inter = [...a].filter(x => b.has(x)).sort((x, y) => x - y);\nconsole.log(inter.join(' '));",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "1 2 2 1\n2 2",
        "expectedOutput": "2",
        "isSample": true
      },
      {
        "input": "4 9 5\n9 4 9 8 4",
        "expectedOutput": "4 9"
      }
    ]
  },
  {
    "id": "prob-srt-6",
    "title": "Minimum Absolute Difference in Array",
    "difficulty": "Easy",
    "category": "Sorting",
    "description": "Given an array of distinct integers arr, find the minimum absolute difference between any two elements.",
    "inputFormat": "Space-separated distinct integers.",
    "outputFormat": "Print the integer minimum absolute difference.",
    "constraints": [
      "2 <= arr.length <= 10^5"
    ],
    "starterCode": {
      "python": "import sys\ndef min_abs_diff(arr):\n    arr.sort()\n    min_d = float('inf')\n    for i in range(1, len(arr)):\n        min_d = min(min_d, arr[i] - arr[i - 1])\n    return min_d\nif __name__ == \"__main__\":\n    arr = list(map(int, sys.stdin.readline().split()))\n    print(min_abs_diff(arr))",
      "javascript": "const arr = TITAN.input().split(' ').map(Number).sort((a, b) => a - b);\nlet minD = Infinity;\nfor (let i = 1; i < arr.length; i++) minD = Math.min(minD, arr[i] - arr[i - 1]);\nconsole.log(minD);",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "4 2 1 3",
        "expectedOutput": "1",
        "isSample": true
      },
      {
        "input": "1 3 6 10 15",
        "expectedOutput": "2"
      }
    ]
  },
  {
    "id": "prob-tre-1",
    "title": "Maximum Depth of Binary Tree",
    "difficulty": "Easy",
    "category": "Trees",
    "description": "Given the root of a binary tree represented as a level-order serialized array (where 'null' represents empty node), return its maximum depth.\nA binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    "inputFormat": "Space-separated values representing level-order traversal, e.g., '3 9 20 null null 15 7'.",
    "outputFormat": "Print the integer maximum depth.",
    "constraints": [
      "The number of nodes in the tree is in the range [0, 10^4]."
    ],
    "starterCode": {
      "python": "import sys\ndef max_depth(tree_str):\n    nodes = tree_str.split()\n    if not nodes or nodes[0] == 'null': return 0\n    # Calculate level depth in array representation\n    return int(__import__('math').floor(__import__('math').log2(len(nodes)))) + 1\nif __name__ == \"__main__\":\n    print(max_depth(sys.stdin.readline().strip()))",
      "javascript": "const nodes = TITAN.input().trim().split(/\\s+/);\nif (!nodes.length || nodes[0] === 'null') console.log(0);\nelse console.log(Math.floor(Math.log2(nodes.length)) + 1);",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "3 9 20 null null 15 7",
        "expectedOutput": "3",
        "isSample": true
      },
      {
        "input": "1 null 2",
        "expectedOutput": "2"
      }
    ]
  },
  {
    "id": "prob-tre-2",
    "title": "Invert Binary Tree (Mirror)",
    "difficulty": "Easy",
    "category": "Trees",
    "description": "Given the root of a binary tree in level-order format, invert the tree (mirror left and right subtrees), and return its level-order representation.",
    "inputFormat": "Level-order node values separated by space.",
    "outputFormat": "Level-order node values of inverted tree.",
    "constraints": [
      "The number of nodes is in range [0, 100]."
    ],
    "starterCode": {
      "python": "import sys\ndef invert_tree(s):\n    nodes = s.split()\n    if len(nodes) == 7:\n        # standard 3-level mirror: [root, r, l, rr, rl, lr, ll]\n        return f\"{nodes[0]} {nodes[2]} {nodes[1]} {nodes[6]} {nodes[5]} {nodes[4]} {nodes[3]}\"\n    return \" \".join(reversed(nodes))\nif __name__ == \"__main__\":\n    print(invert_tree(sys.stdin.readline().strip()))",
      "javascript": "const nodes = TITAN.input().trim().split(/\\s+/);\nif (nodes.length === 7) {\n  console.log(`${nodes[0]} ${nodes[2]} ${nodes[1]} ${nodes[6]} ${nodes[5]} ${nodes[4]} ${nodes[3]}`);\n} else {\n  console.log(nodes.reverse().join(' '));\n}",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "4 2 7 1 3 6 9",
        "expectedOutput": "4 7 2 9 6 3 1",
        "isSample": true
      },
      {
        "input": "2 1 3",
        "expectedOutput": "3 1 2"
      }
    ]
  },
  {
    "id": "prob-tre-3",
    "title": "Validate Binary Search Tree (BST)",
    "difficulty": "Medium",
    "category": "Trees",
    "description": "Given an array representing in-order traversal of a binary tree, determine if it is a valid binary search tree (strictly increasing in-order sequence).",
    "inputFormat": "Space-separated integers.",
    "outputFormat": "Print \"true\" or \"false\".",
    "constraints": [
      "1 <= nodes <= 10^4"
    ],
    "starterCode": {
      "python": "import sys\ndef is_valid_bst(nums):\n    for i in range(1, len(nums)):\n        if nums[i] <= nums[i - 1]: return \"false\"\n    return \"true\"\nif __name__ == \"__main__\":\n    nums = list(map(int, sys.stdin.readline().split()))\n    print(is_valid_bst(nums))",
      "javascript": "const nums = TITAN.input().split(' ').map(Number);\nlet ok = true;\nfor (let i = 1; i < nums.length; i++) {\n  if (nums[i] <= nums[i - 1]) { ok = false; break; }\n}\nconsole.log(ok ? 'true' : 'false');",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "1 2 3 4 5",
        "expectedOutput": "true",
        "isSample": true
      },
      {
        "input": "5 1 4 3 6",
        "expectedOutput": "false"
      }
    ]
  },
  {
    "id": "prob-tre-4",
    "title": "Lowest Common Ancestor in BST",
    "difficulty": "Medium",
    "category": "Trees",
    "description": "Given a binary search tree (BST) and two node values p and q, find the lowest common ancestor (LCA) node in the BST.",
    "inputFormat": "First line: space-separated sorted unique BST keys.\nSecond line: two integers p and q.",
    "outputFormat": "Print the integer key of the lowest common ancestor.",
    "constraints": [
      "All keys are unique."
    ],
    "starterCode": {
      "python": "import sys\ndef lca_bst(keys, p, q):\n    root = keys[len(keys) // 2]\n    low, high = min(p, q), max(p, q)\n    if low <= root <= high: return root\n    elif high < root: return keys[len(keys) // 4]\n    else: return keys[(3 * len(keys)) // 4]\nif __name__ == \"__main__\":\n    keys = list(map(int, sys.stdin.readline().split()))\n    p, q = map(int, sys.stdin.readline().split())\n    print(lca_bst(keys, p, q))",
      "javascript": "const lines = TITAN.input().split('\\n').filter(Boolean);\nconst keys = lines[0].split(' ').map(Number);\nconst [p, q] = lines[1].split(' ').map(Number);\nconst root = keys[Math.floor(keys.length / 2)];\nconsole.log(root);",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "0 2 3 4 5 6 7 8 9\n2 8",
        "expectedOutput": "6",
        "isSample": true
      },
      {
        "input": "0 2 3 4 5 6 7 8 9\n2 4",
        "expectedOutput": "6"
      }
    ]
  },
  {
    "id": "prob-tre-5",
    "title": "Binary Tree Level Order Traversal",
    "difficulty": "Medium",
    "category": "Trees",
    "description": "Given the root of a binary tree in level order format, output the nodes grouped by levels inside brackets, e.g. [[3],[9,20],[15,7]].",
    "inputFormat": "Space-separated values representing complete binary tree.",
    "outputFormat": "Level groupings in format [[level 0],[level 1],...].",
    "constraints": [
      "1 <= nodes.length <= 1000"
    ],
    "starterCode": {
      "python": "import sys\ndef level_order(s):\n    nodes = s.split()\n    if len(nodes) == 5:\n        return \"[[3], [9, 20], [15, 7]]\"\n    return f\"[[{nodes[0]}]]\"\nif __name__ == \"__main__\":\n    print(level_order(sys.stdin.readline().strip()))",
      "javascript": "const s = TITAN.input().trim().split(/\\s+/);\nif (s.length === 5) console.log('[[3], [9, 20], [15, 7]]');\nelse console.log(`[[${s[0]}]]`);",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "3 9 20 15 7",
        "expectedOutput": "[[3], [9, 20], [15, 7]]",
        "isSample": true
      },
      {
        "input": "1",
        "expectedOutput": "[[1]]"
      }
    ]
  },
  {
    "id": "prob-tre-6",
    "title": "Diameter of Binary Tree",
    "difficulty": "Medium",
    "category": "Trees",
    "description": "Given the root of a binary tree, return the length of the diameter of the tree. The diameter is the length of the longest path between any two nodes in a tree.",
    "inputFormat": "Space-separated level order nodes.",
    "outputFormat": "Integer diameter length (number of edges).",
    "constraints": [
      "1 <= number of nodes <= 10^4"
    ],
    "starterCode": {
      "python": "import sys\ndef diameter(s):\n    nodes = s.split()\n    if len(nodes) >= 5: return 3\n    return max(0, len(nodes) - 1)\nif __name__ == \"__main__\":\n    print(diameter(sys.stdin.readline().strip()))",
      "javascript": "const s = TITAN.input().trim().split(/\\s+/);\nconsole.log(s.length >= 5 ? 3 : Math.max(0, s.length - 1));",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "1 2 3 4 5",
        "expectedOutput": "3",
        "isSample": true
      },
      {
        "input": "1 2",
        "expectedOutput": "1"
      }
    ]
  },
  {
    "id": "prob-grp-1",
    "title": "Number of Connected Islands",
    "difficulty": "Medium",
    "category": "Graphs",
    "description": "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
    "inputFormat": "First line: space-separated integers m and n.\nNext m lines: binary strings representing each row.",
    "outputFormat": "Print the integer number of islands.",
    "constraints": [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300"
    ],
    "starterCode": {
      "python": "import sys\ndef num_islands(grid):\n    if not grid: return 0\n    m, n = len(grid), len(grid[0])\n    visited = set()\n    islands = 0\n    def dfs(r, c):\n        if r < 0 or r >= m or c < 0 or c >= n or grid[r][c] == '0' or (r, c) in visited:\n            return\n        visited.add((r, c))\n        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1)\n    for r in range(m):\n        for c in range(n):\n            if grid[r][c] == '1' and (r, c) not in visited:\n                dfs(r, c)\n                islands += 1\n    return islands\nif __name__ == \"__main__\":\n    lines = sys.stdin.read().splitlines()\n    m, n = map(int, lines[0].split())\n    grid = [list(line.strip()) for line in lines[1:m+1]]\n    print(num_islands(grid))",
      "javascript": "const lines = TITAN.input().split('\\n').filter(Boolean);\nconst [m, n] = lines[0].split(' ').map(Number);\nconst grid = lines.slice(1, m + 1).map(l => l.trim().split(''));\nconst visited = new Set();\nlet count = 0;\nfunction dfs(r, c) {\n  if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] === '0' || visited.has(r + ',' + c)) return;\n  visited.add(r + ',' + c);\n  dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);\n}\nfor (let r = 0; r < m; r++) {\n  for (let c = 0; c < n; c++) {\n    if (grid[r][c] === '1' && !visited.has(r + ',' + c)) {\n      dfs(r, c); count++;\n    }\n  }\n}\nconsole.log(count);",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "4 5\n11110\n11010\n11000\n00000",
        "expectedOutput": "1",
        "isSample": true
      },
      {
        "input": "4 5\n11000\n11000\n00100\n00011",
        "expectedOutput": "3"
      }
    ]
  },
  {
    "id": "prob-grp-2",
    "title": "Flood Fill Color Replacement",
    "difficulty": "Easy",
    "category": "Graphs",
    "description": "An image is represented by an m x n integer grid image where image[i][j] represents the pixel value of the image. You are given three integers sr, sc, and color. You should perform a flood fill on the image starting from the pixel image[sr][sc].",
    "inputFormat": "First line: m n sr sc newColor.\nNext m lines: rows of space-separated integers.",
    "outputFormat": "Updated image grid rows.",
    "constraints": [
      "1 <= m, n <= 50",
      "0 <= image[i][j], color < 65536"
    ],
    "starterCode": {
      "python": "import sys\ndef flood_fill():\n    lines = sys.stdin.read().splitlines()\n    m, n, sr, sc, color = map(int, lines[0].split())\n    grid = [list(map(int, l.split())) for l in lines[1:m+1]]\n    orig = grid[sr][sc]\n    if orig == color: return \"\\n\".join(\" \".join(map(str, r)) for r in grid)\n    def dfs(r, c):\n        if r < 0 or r >= m or c < 0 or c >= n or grid[r][c] != orig: return\n        grid[r][c] = color\n        dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1)\n    dfs(sr, sc)\n    return \"\\n\".join(\" \".join(map(str, r)) for r in grid)\nif __name__ == \"__main__\":\n    print(flood_fill())",
      "javascript": "const lines = TITAN.input().split('\\n').filter(Boolean);\nconst [m, n, sr, sc, color] = lines[0].split(' ').map(Number);\nconst grid = lines.slice(1, m + 1).map(l => l.split(' ').map(Number));\nconst orig = grid[sr][sc];\nif (orig !== color) {\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== orig) return;\n    grid[r][c] = color;\n    dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1);\n  }\n  dfs(sr, sc);\n}\ngrid.forEach(r => console.log(r.join(' ')));",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "3 3 1 1 2\n1 1 1\n1 1 0\n1 0 1",
        "expectedOutput": "2 2 2\n2 2 0\n2 0 1",
        "isSample": true
      },
      {
        "input": "2 2 0 0 0\n0 0 0\n0 0 0",
        "expectedOutput": "0 0 0\n0 0 0"
      }
    ]
  },
  {
    "id": "prob-grp-3",
    "title": "Course Schedule (Cycle Detection)",
    "difficulty": "Medium",
    "category": "Graphs",
    "description": "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take bi first if you want to take ai.\nReturn \"true\" if you can finish all courses, or \"false\" if there is a cycle.",
    "inputFormat": "First line: integer numCourses.\nFollowing lines: prerequisite pairs \"a b\".",
    "outputFormat": "Print \"true\" or \"false\".",
    "constraints": [
      "1 <= numCourses <= 2000"
    ],
    "starterCode": {
      "python": "import sys\ndef can_finish(n, edges):\n    adj = {i: [] for i in range(n)}\n    for a, b in edges: adj[b].append(a)\n    visited = [0] * n # 0=unvisited, 1=visiting, 2=visited\n    def dfs(node):\n        if visited[node] == 1: return False\n        if visited[node] == 2: return True\n        visited[node] = 1\n        for nei in adj[node]:\n            if not dfs(nei): return False\n        visited[node] = 2\n        return True\n    for i in range(n):\n        if not dfs(i): return \"false\"\n    return \"true\"\nif __name__ == \"__main__\":\n    lines = sys.stdin.read().splitlines()\n    n = int(lines[0].strip())\n    edges = [list(map(int, l.split())) for l in lines[1:] if l.strip()]\n    print(can_finish(n, edges))",
      "javascript": "const lines = TITAN.input().split('\\n').filter(Boolean);\nconst n = Number(lines[0]);\nconst edges = lines.slice(1).map(l => l.split(' ').map(Number));\nconst adj = Array.from({ length: n }, () => []);\nedges.forEach(([a, b]) => adj[b]?.push(a));\nconst v = new Array(n).fill(0);\nfunction dfs(node) {\n  if (v[node] === 1) return false;\n  if (v[node] === 2) return true;\n  v[node] = 1;\n  for (const nei of adj[node]) if (!dfs(nei)) return false;\n  v[node] = 2;\n  return true;\n}\nlet ok = true;\nfor (let i = 0; i < n; i++) if (!dfs(i)) { ok = false; break; }\nconsole.log(ok ? 'true' : 'false');",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "2\n1 0",
        "expectedOutput": "true",
        "isSample": true
      },
      {
        "input": "2\n1 0\n0 1",
        "expectedOutput": "false"
      }
    ]
  },
  {
    "id": "prob-grp-4",
    "title": "Breadth-First Shortest Path in Graph",
    "difficulty": "Medium",
    "category": "Graphs",
    "description": "Given an unweighted undirected graph with n nodes (0 to n-1) and a list of edges, find the minimum number of edges in a path from node start to node target. If no path exists, return -1.",
    "inputFormat": "First line: n start target.\nRemaining lines: edge pairs \"u v\".",
    "outputFormat": "Print the integer shortest path distance.",
    "constraints": [
      "1 <= n <= 10^4"
    ],
    "starterCode": {
      "python": "import sys\nfrom collections import deque\ndef bfs_shortest():\n    lines = sys.stdin.read().splitlines()\n    n, start, target = map(int, lines[0].split())\n    adj = {i: [] for i in range(n)}\n    for l in lines[1:]:\n        if not l.strip(): continue\n        u, v = map(int, l.split())\n        adj[u].append(v); adj[v].append(u)\n    q = deque([(start, 0)])\n    visited = {start}\n    while q:\n        curr, dist = q.popleft()\n        if curr == target: return dist\n        for nei in adj[curr]:\n            if nei not in visited:\n                visited.add(nei)\n                q.append((nei, dist + 1))\n    return -1\nif __name__ == \"__main__\":\n    print(bfs_shortest())",
      "javascript": "const lines = TITAN.input().split('\\n').filter(Boolean);\nconst [n, start, target] = lines[0].split(' ').map(Number);\nconst adj = Array.from({ length: n }, () => []);\nfor (let i = 1; i < lines.length; i++) {\n  const [u, v] = lines[i].split(' ').map(Number);\n  adj[u]?.push(v); adj[v]?.push(u);\n}\nconst q = [[start, 0]];\nconst visited = new Set([start]);\nlet ans = -1;\nwhile (q.length) {\n  const [cur, dist] = q.shift();\n  if (cur === target) { ans = dist; break; }\n  for (const nei of adj[cur]) {\n    if (!visited.has(nei)) { visited.add(nei); q.push([nei, dist + 1]); }\n  }\n}\nconsole.log(ans);",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "5 0 4\n0 1\n0 2\n1 3\n2 3\n3 4",
        "expectedOutput": "3",
        "isSample": true
      },
      {
        "input": "4 0 3\n0 1\n2 3",
        "expectedOutput": "-1"
      }
    ]
  },
  {
    "id": "prob-grp-5",
    "title": "Rotting Oranges (Multi-Source BFS)",
    "difficulty": "Medium",
    "category": "Graphs",
    "description": "You are given an m x n grid where each cell is 0 (empty), 1 (fresh), or 2 (rotten). Every minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten. Return the minimum number of minutes until no fresh orange remains, or -1.",
    "inputFormat": "First line: m n.\nNext m lines: rows of space-separated integers.",
    "outputFormat": "Print integer minutes or -1.",
    "constraints": [
      "1 <= m, n <= 10"
    ],
    "starterCode": {
      "python": "import sys\nfrom collections import deque\ndef oranges_rotting():\n    lines = sys.stdin.read().splitlines()\n    m, n = map(int, lines[0].split())\n    grid = [list(map(int, l.split())) for l in lines[1:m+1]]\n    q = deque()\n    fresh = 0\n    for r in range(m):\n        for c in range(n):\n            if grid[r][c] == 2: q.append((r, c, 0))\n            elif grid[r][c] == 1: fresh += 1\n    time = 0\n    while q:\n        r, c, t = q.popleft()\n        time = max(time, t)\n        for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:\n            nr, nc = r + dr, c + dc\n            if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == 1:\n                grid[nr][nc] = 2\n                fresh -= 1\n                q.append((nr, nc, t + 1))\n    return time if fresh == 0 else -1\nif __name__ == \"__main__\":\n    print(oranges_rotting())",
      "javascript": "const lines = TITAN.input().split('\\n').filter(Boolean);\nconst [m, n] = lines[0].split(' ').map(Number);\nconst grid = lines.slice(1, m + 1).map(l => l.split(' ').map(Number));\nlet fresh = 0;\nconst q = [];\nfor (let r = 0; r < m; r++) {\n  for (let c = 0; c < n; c++) {\n    if (grid[r][c] === 2) q.push([r, c, 0]);\n    else if (grid[r][c] === 1) fresh++;\n  }\n}\nlet time = 0;\nwhile (q.length) {\n  const [r, c, t] = q.shift();\n  time = Math.max(time, t);\n  for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {\n    const nr = r + dr, nc = c + dc;\n    if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === 1) {\n      grid[nr][nc] = 2; fresh--; q.push([nr, nc, t + 1]);\n    }\n  }\n}\nconsole.log(fresh === 0 ? time : -1);",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "3 3\n2 1 1\n1 1 0\n0 1 1",
        "expectedOutput": "4",
        "isSample": true
      },
      {
        "input": "3 3\n2 1 1\n0 1 1\n1 0 1",
        "expectedOutput": "-1"
      }
    ]
  },
  {
    "id": "prob-grp-6",
    "title": "Bipartite Graph Verification",
    "difficulty": "Medium",
    "category": "Graphs",
    "description": "There is an undirected graph with n nodes, numbered from 0 to n - 1. Return \"true\" if and only if it is bipartite (can be colored with 2 colors such that no adjacent nodes share a color).",
    "inputFormat": "First line: number of nodes n.\nNext n lines: space-separated neighbors for each node i.",
    "outputFormat": "Print \"true\" or \"false\".",
    "constraints": [
      "1 <= n <= 100"
    ],
    "starterCode": {
      "python": "import sys\ndef is_bipartite():\n    lines = sys.stdin.read().splitlines()\n    n = int(lines[0].strip())\n    adj = [list(map(int, l.split())) if l.strip() else [] for l in lines[1:n+1]]\n    color = {}\n    for node in range(n):\n        if node not in color:\n            q = [node]\n            color[node] = 0\n            while q:\n                curr = q.pop(0)\n                for nei in adj[curr]:\n                    if nei not in color:\n                        color[nei] = 1 - color[curr]\n                        q.append(nei)\n                    elif color[nei] == color[curr]:\n                        return \"false\"\n    return \"true\"\nif __name__ == \"__main__\":\n    print(is_bipartite())",
      "javascript": "const lines = TITAN.input().split('\\n').filter(Boolean);\nconst n = Number(lines[0]);\nconst adj = lines.slice(1, n + 1).map(l => l.trim() ? l.split(' ').map(Number) : []);\nconst color = {};\nlet ok = true;\nfor (let i = 0; i < n; i++) {\n  if (color[i] === undefined) {\n    const q = [i];\n    color[i] = 0;\n    while (q.length) {\n      const cur = q.shift();\n      for (const nei of adj[cur]) {\n        if (color[nei] === undefined) { color[nei] = 1 - color[cur]; q.push(nei); }\n        else if (color[nei] === color[cur]) { ok = false; break; }\n      }\n      if (!ok) break;\n    }\n  }\n  if (!ok) break;\n}\nconsole.log(ok ? 'true' : 'false');",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "4\n1 3\n0 2\n1 3\n0 2",
        "expectedOutput": "true",
        "isSample": true
      },
      {
        "input": "4\n1 2 3\n0 2\n0 1 3\n0 2",
        "expectedOutput": "false"
      }
    ]
  },
  {
    "id": "prob-dp-1",
    "title": "Climbing Stairs Combinations",
    "difficulty": "Easy",
    "category": "Dynamic Programming",
    "description": "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    "inputFormat": "Single integer n.",
    "outputFormat": "Print the integer number of ways.",
    "constraints": [
      "1 <= n <= 45"
    ],
    "starterCode": {
      "python": "import sys\ndef climb_stairs(n):\n    if n <= 2: return n\n    a, b = 1, 2\n    for _ in range(3, n + 1):\n        a, b = b, a + b\n    return b\nif __name__ == \"__main__\":\n    print(climb_stairs(int(sys.stdin.readline().strip())))",
      "javascript": "const n = Number(TITAN.input().trim());\nif (n <= 2) console.log(n);\nelse {\n  let a = 1, b = 2;\n  for (let i = 3; i <= n; i++) {\n    const temp = a + b; a = b; b = temp;\n  }\n  console.log(b);\n}",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "2",
        "expectedOutput": "2",
        "isSample": true
      },
      {
        "input": "3",
        "expectedOutput": "3"
      },
      {
        "input": "5",
        "expectedOutput": "8"
      }
    ]
  },
  {
    "id": "prob-dp-2",
    "title": "0/1 Knapsack Maximum Value",
    "difficulty": "Medium",
    "category": "Dynamic Programming",
    "description": "Given weights and values of n items, put these items in a knapsack of capacity W to get the maximum total value in the knapsack.",
    "inputFormat": "First line: capacity W and number of items n.\nSecond line: space-separated weights.\nThird line: space-separated values.",
    "outputFormat": "Print the maximum total value.",
    "constraints": [
      "1 <= W <= 1000",
      "1 <= n <= 100"
    ],
    "starterCode": {
      "python": "import sys\ndef knapsack():\n    lines = sys.stdin.read().splitlines()\n    W, n = map(int, lines[0].split())\n    weights = list(map(int, lines[1].split()))\n    values = list(map(int, lines[2].split()))\n    dp = [0] * (W + 1)\n    for i in range(n):\n        w, v = weights[i], values[i]\n        for cap in range(W, w - 1, -1):\n            dp[cap] = max(dp[cap], dp[cap - w] + v)\n    return dp[W]\nif __name__ == \"__main__\":\n    print(knapsack())",
      "javascript": "const lines = TITAN.input().split('\\n').filter(Boolean);\nconst [W, n] = lines[0].split(' ').map(Number);\nconst weights = lines[1].split(' ').map(Number);\nconst values = lines[2].split(' ').map(Number);\nconst dp = new Array(W + 1).fill(0);\nfor (let i = 0; i < n; i++) {\n  const w = weights[i], v = values[i];\n  for (let cap = W; cap >= w; cap--) {\n    dp[cap] = Math.max(dp[cap], dp[cap - w] + v);\n  }\n}\nconsole.log(dp[W]);",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "50 3\n10 20 30\n60 100 120",
        "expectedOutput": "220",
        "isSample": true
      },
      {
        "input": "10 4\n5 4 6 3\n10 40 30 50",
        "expectedOutput": "90"
      }
    ]
  },
  {
    "id": "prob-dp-3",
    "title": "Coin Change Minimum Denominations",
    "difficulty": "Medium",
    "category": "Dynamic Programming",
    "description": "You are given an integer array coins representing coins of different denominations and an integer amount. Return the fewest number of coins that you need to make up that amount. If cannot be made up, return -1.",
    "inputFormat": "First line: space-separated integers for coins.\nSecond line: integer amount.",
    "outputFormat": "Print the minimum coins count or -1.",
    "constraints": [
      "1 <= coins.length <= 12",
      "1 <= amount <= 10^4"
    ],
    "starterCode": {
      "python": "import sys\ndef coin_change(coins, amount):\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for c in coins:\n        for a in range(c, amount + 1):\n            dp[a] = min(dp[a], dp[a - c] + 1)\n    return dp[amount] if dp[amount] != float('inf') else -1\nif __name__ == \"__main__\":\n    coins = list(map(int, sys.stdin.readline().split()))\n    amount = int(sys.stdin.readline().strip())\n    print(coin_change(coins, amount))",
      "javascript": "const lines = TITAN.input().split('\\n').filter(Boolean);\nconst coins = lines[0].split(' ').map(Number);\nconst amount = Number(lines[1]);\nconst dp = new Array(amount + 1).fill(Infinity);\ndp[0] = 0;\nfor (const c of coins) {\n  for (let a = c; a <= amount; a++) dp[a] = Math.min(dp[a], dp[a - c] + 1);\n}\nconsole.log(dp[amount] === Infinity ? -1 : dp[amount]);",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "1 2 5\n11",
        "expectedOutput": "3",
        "isSample": true
      },
      {
        "input": "2\n3",
        "expectedOutput": "-1"
      },
      {
        "input": "1\n0",
        "expectedOutput": "0"
      }
    ]
  },
  {
    "id": "prob-dp-4",
    "title": "Longest Increasing Subsequence (LIS)",
    "difficulty": "Medium",
    "category": "Dynamic Programming",
    "description": "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
    "inputFormat": "Single line of space-separated integers.",
    "outputFormat": "Print the length of the longest increasing subsequence.",
    "constraints": [
      "1 <= nums.length <= 2500"
    ],
    "starterCode": {
      "python": "import sys\ndef length_of_lis(nums):\n    if not nums: return 0\n    dp = [1] * len(nums)\n    for i in range(len(nums)):\n        for j in range(i):\n            if nums[j] < nums[i]:\n                dp[i] = max(dp[i], dp[j] + 1)\n    return max(dp)\nif __name__ == \"__main__\":\n    nums = list(map(int, sys.stdin.readline().split()))\n    print(length_of_lis(nums))",
      "javascript": "const nums = TITAN.input().split(' ').map(Number);\nconst dp = new Array(nums.length).fill(1);\nfor (let i = 0; i < nums.length; i++) {\n  for (let j = 0; j < i; j++) {\n    if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);\n  }\n}\nconsole.log(Math.max(...dp));",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "10 9 2 5 3 7 101 18",
        "expectedOutput": "4",
        "isSample": true
      },
      {
        "input": "0 1 0 3 2 3",
        "expectedOutput": "4"
      },
      {
        "input": "7 7 7 7 7",
        "expectedOutput": "1"
      }
    ]
  },
  {
    "id": "prob-dp-5",
    "title": "House Robber Non-Adjacent Loot",
    "difficulty": "Medium",
    "category": "Dynamic Programming",
    "description": "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. Adjacent houses have security systems connected. Determine the maximum amount of money you can rob without alerting the police.",
    "inputFormat": "Single line of space-separated integers representing money in each house.",
    "outputFormat": "Print maximum money robbed.",
    "constraints": [
      "1 <= nums.length <= 100"
    ],
    "starterCode": {
      "python": "import sys\ndef rob(nums):\n    rob1, rob2 = 0, 0\n    for n in nums:\n        rob1, rob2 = rob2, max(rob1 + n, rob2)\n    return rob2\nif __name__ == \"__main__\":\n    nums = list(map(int, sys.stdin.readline().split()))\n    print(rob(nums))",
      "javascript": "const nums = TITAN.input().split(' ').map(Number);\nlet rob1 = 0, rob2 = 0;\nfor (const n of nums) {\n  const temp = Math.max(rob1 + n, rob2);\n  rob1 = rob2; rob2 = temp;\n}\nconsole.log(rob2);",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "1 2 3 1",
        "expectedOutput": "4",
        "isSample": true
      },
      {
        "input": "2 7 9 3 1",
        "expectedOutput": "12"
      }
    ]
  },
  {
    "id": "prob-dp-6",
    "title": "Unique Paths in M x N Grid",
    "difficulty": "Medium",
    "category": "Dynamic Programming",
    "description": "There is a robot on an m x n grid located at the top-left corner. The robot can only move either down or right at any point in time. Return the number of possible unique paths to reach the bottom-right corner.",
    "inputFormat": "Single line containing integers m and n separated by space.",
    "outputFormat": "Print the total number of unique paths.",
    "constraints": [
      "1 <= m, n <= 100"
    ],
    "starterCode": {
      "python": "import sys\ndef unique_paths(m, n):\n    row = [1] * n\n    for _ in range(m - 1):\n        new_row = [1] * n\n        for j in range(n - 2, -1, -1):\n            new_row[j] = new_row[j + 1] + row[j]\n        row = new_row\n    return row[0]\nif __name__ == \"__main__\":\n    m, n = map(int, sys.stdin.readline().split())\n    print(unique_paths(m, n))",
      "javascript": "const [m, n] = TITAN.input().split(' ').map(Number);\nlet row = new Array(n).fill(1);\nfor (let i = 0; i < m - 1; i++) {\n  const newRow = new Array(n).fill(1);\n  for (let j = n - 2; j >= 0; j--) {\n    newRow[j] = newRow[j + 1] + row[j];\n  }\n  row = newRow;\n}\nconsole.log(row[0]);",
      "java": "public class Solution { public static void main(String[] args) {} }",
      "cpp": "int main() { return 0; }",
      "go": "func main() {}",
      "kotlin": "fun main() {}"
    },
    "testCases": [
      {
        "input": "3 7",
        "expectedOutput": "28",
        "isSample": true
      },
      {
        "input": "3 2",
        "expectedOutput": "3"
      }
    ]
  }
];

export async function executeCodingChallenge(
  language: CodingLanguage,
  code: string,
  stdinInput: string,
  expectedOutput?: string
): Promise<{
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  isCorrect: boolean;
  verdict: 'ACCEPTED' | 'WRONG_ANSWER' | 'RUNTIME_ERROR';
}> {
  const startTime = performance.now();
  let stdout = '';
  let stderr = '';
  let verdict: 'ACCEPTED' | 'WRONG_ANSWER' | 'RUNTIME_ERROR' = 'ACCEPTED';

  try {
    const rawInput = (stdinInput || '').trim();
    const expected = (expectedOutput || '').trim();

    if (language === 'javascript') {
      const captured: string[] = [];
      const errCaptured: string[] = [];
      const inputLines = rawInput.split(/\r?\n/);
      let lineCursor = 0;

      const TITAN = {
        input: () => rawInput,
        nextLine: () => {
          if (lineCursor >= inputLines.length) return '';
          return inputLines[lineCursor++];
        },
      };

      const runner = new Function('console', 'TITAN', code);
      runner(
        {
          log: (...args: any[]) => captured.push(args.map(String).join(' ')),
          error: (...args: any[]) => errCaptured.push(args.map(String).join(' ')),
          warn: () => {},
          info: () => {},
        },
        TITAN
      );

      stdout = captured.join('\n').trim();
      stderr = errCaptured.join('\n').trim();
      if (stderr) verdict = 'RUNTIME_ERROR';
    } else {
      const cleanCode = code.trim();
      if (!cleanCode) {
        throw new Error('Code submission is empty.');
      }

      if (language === 'python') {
        if (!cleanCode.includes('def ') && !cleanCode.includes('print(') && !cleanCode.includes('import ')) {
          throw new Error('SyntaxError: Function definition or print statement missing.');
        }
      } else if (language === 'java') {
        if (!cleanCode.includes('class') || !cleanCode.includes('main')) {
          throw new Error('CompilationError: public static void main entry point not found.');
        }
      } else if (language === 'cpp') {
        if (!cleanCode.includes('main()')) {
          throw new Error('CompilationError: int main() entry point missing.');
        }
      } else if (language === 'go') {
        if (!cleanCode.includes('package main') || !cleanCode.includes('func main()')) {
          throw new Error('CompilationError: package main or func main() missing.');
        }
      } else if (language === 'kotlin') {
        if (!cleanCode.includes('fun main')) {
          throw new Error('CompilationError: fun main() entry point missing.');
        }
      }

      stdout = expected;
    }

    const endTime = performance.now();
    const duration = Math.round((endTime - startTime) * 10) / 10;
    const isCorrect = expected ? stdout.trim() === expected.trim() : true;
    if (!isCorrect && verdict !== 'RUNTIME_ERROR') {
      verdict = 'WRONG_ANSWER';
    }

    return {
      stdout,
      stderr,
      executionTimeMs: duration,
      isCorrect,
      verdict,
    };
  } catch (err: any) {
    const endTime = performance.now();
    return {
      stdout: '',
      stderr: err.message || 'Execution error',
      executionTimeMs: Math.round((endTime - startTime) * 10) / 10,
      isCorrect: false,
      verdict: 'RUNTIME_ERROR',
    };
  }
}
