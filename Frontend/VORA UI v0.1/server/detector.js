export const ALGO_PATTERNS = [
  { name: 'Binary Search', complexity: 'O(log n)', color: '#00f0ff', patterns: [/\bbinarySearch\b/i, /mid\s*=\s*\(?(left|low)\s*\+\s*(right|high)\)?\s*\/\s*2/, /while\s*\((left|low)\s*<=\s*(right|high)\)/] },
  { name: 'Quick Sort', complexity: 'O(n log n)', color: '#a855f7', patterns: [/\bquickSort\b/i, /\bpartition\b/i, /\bpivot\b/i] },
  { name: 'Merge Sort', complexity: 'O(n log n)', color: '#3b82f6', patterns: [/\bmergeSort\b/i, /\bmerge\b\(.*\)/, /divide\s*and\s*conquer/i] },
  { name: 'Bubble Sort', complexity: 'O(n²)', color: '#ef4444', patterns: [/\bbubbleSort\b/i, /for.*for.*if.*(swap|temp)/] },
  { name: 'Dijkstra', complexity: 'O((V+E) log V)', color: '#f59e0b', patterns: [/\bdijkstra\b/i, /\bpriorityQueue\b/i, /dist\[v\]\s*>\s*dist\[u\]\s*\+\s*weight/, /adj\[u\]\.push/i] },
  { name: 'BFS/DFS', complexity: 'O(V+E)', color: '#10b981', patterns: [/\bbfs\b/i, /\bdfs\b/i, /visited\s*=\s*(new|set|\[)/, /queue\.(push|enqueue|add)/i, /stack\.(push|add)/i] },
  { name: 'Dynamic Programming', complexity: 'O(n²)', color: '#ec4899', patterns: [/dp\[i\]\[j\]/, /dp\[i\b\]/, /\bmemo\b/, /Math\.max\(dp/, /Math\.min\(dp/] },
  { name: 'Linked List', complexity: 'O(n)', color: '#14b8a6', patterns: [/\bhead\b/, /\bnext\b/, /\bprev\b/, /\.next\b/i] },
];

export const LANGUAGE_PATTERNS = {
  python: {
    name: 'Python',
    patterns: [/\bdef\b/, /:\s*$/, /\bprint\(/, /\bimport\b/],
    antiPatterns: [/[;{}]/]
  },
  cpp: {
    name: 'C++',
    patterns: [/#include/, /std::/, /\bcout\b/, /\bcin\b/, /using\s+namespace/],
  },
  java: {
    name: 'Java',
    patterns: [/\bpublic\s+class\b/, /\bSystem\.out\.println\b/, /\bString\[\]\s+args\b/, /import\s+java\./],
  },
  javascript: {
    name: 'JavaScript',
    patterns: [/\bconsole\.log\b/, /\bconst\s+.*=/, /\bfunction\b/, /=>/],
  },
  typescript: {
    name: 'TypeScript',
    patterns: [/\binterface\b/, /\btype\b\s+\w+\s*=/, /:\s*(string|number|boolean|any|void)\b/],
  },
  rust: {
    name: 'Rust',
    patterns: [/\bfn\b/, /\bmatch\b\s+/, /\bpub\b\s+/, /println!\(/, /\blet\s+mut\b/],
  },
  go: {
    name: 'Go',
    patterns: [/\bpackage\b\s+main\b/, /\bfunc\b/, /fmt\.Println\(/, /import\s+"\w+"/],
  },
  c: {
    name: 'C',
    patterns: [/#include\s+<stdio\.h>/, /\bprintf\(/, /\bscanf\(/, /\bint\s+main\b/],
  }
};

export const detectLanguage = (code) => {
  if (!code) return null;
  
  for (const [key, lang] of Object.entries(LANGUAGE_PATTERNS)) {
    if (lang.patterns.some(p => p.test(code))) return key;
  }
  return null;
};

export const detectAlgorithm = (code) => {
  for (const algo of ALGO_PATTERNS) {
    if (algo.patterns.some(p => p.test(code))) return algo;
  }
  return { name: 'Custom Algorithm', complexity: 'O(n)', color: '#fbbf24' };
};
