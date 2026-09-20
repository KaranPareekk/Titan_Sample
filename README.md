# 🪐 TITAN OS — Interactive Engineering Learning & Workstation Platform

> **An interactive, browser-native developer workstation and engineering learning OS built for modern programmers and computer science students.**

[![Live Demo](https://img.shields.io/badge/Live_Deployment-Vercel-000?style=for-the-badge&logo=vercel)](https://titan-sample.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/KaranPareekk/Titan_Sample)
[![Judge Ready](https://img.shields.io/badge/Status-Submission_Ready-emerald?style=for-the-badge)](https://titan-sample.vercel.app/)

---

## 🌐 Live Links
- **Live Application:** [https://titan-sample.vercel.app/](https://titan-sample.vercel.app/)
- **GitHub Repository:** [https://github.com/KaranPareekk/Titan_Sample](https://github.com/KaranPareekk/Titan_Sample)
- **HackIndia Fork:** [https://github.com/KaranPareekk/ai-first-startup-hackathon-build-a-startup-using-ai-only-titanos](https://github.com/KaranPareekk/ai-first-startup-hackathon-build-a-startup-using-ai-only-titanos)

---

## 🎯 Problem Statement
Computer science and engineering students often face a fragmented learning experience — juggling separate tools for coding, algorithm visualization, database practice, digital logic design, and exam assessments, while reading abstract theory without hands-on feedback.

**TITAN_OS** combines coding, data structures, digital logic, computer architecture, database management, simulations, assessments, notes, and interactive practice into one unified, browser-native workstation. It allows students to learn concepts by experimenting with them rather than only reading theory.

---

## 🚀 Core Features

### 1. ⚡ CodeLab IDE with On-Demand Interactive Terminal
- **Interactive Polyglot Runtime:** Write and run Python, Java, and JavaScript directly in the browser.
- **On-Demand STDIN Prompting:** No pre-compile input buffers needed. When code calls `input()`, `Scanner`, or `prompt()`, execution pauses and prompts directly in the interactive terminal (`[INPUT REQUIRED] > `).
- **Ruled Paper Obsidian Editor:** Custom line-ruled editor with syntax tracking, multi-tab file explorer, and file import/export.

### 2. 🧠 DSA Visualizer & Algorithm Engines
- Interactive step-by-step animations with real-time state array/table inspections, pseudo-code execution tracking, and adjustable playback speeds:
  - **Dynamic Programming:** 0/1 Knapsack, Coin Change, Longest Increasing Subsequence (LIS), Matrix Chain Multiplication, Word Break.
  - **Patterns & Core Algorithms:** Two Pointers, Sliding Window, Quick Sort (Lomuto Partition), Topological Sort (Kahn's Algorithm), Kruskal's MST, Dijkstra, Binary Search, and more.

### 3. 🔌 Digital Logic Circuit Simulator & Complex Blueprints
- Wire logic gates (`AND`, `OR`, `NOT`, `XOR`, `NAND`, `XNOR`, Switches, LEDs) in a real-time reactive simulation canvas.
- **Complex Industrial Blueprints:**
  - **4-Bit ALU / Processor Core** (ADD, SUB, AND, OR, XOR operations with zero flag)
  - **4-Function Digital Calculator**
  - **2-Bit Binary Array Multiplier** ($A_1A_0 \times B_1B_0 \rightarrow P_3P_2P_1P_0$)
  - **4-Bit Adder / Subtractor** (2's Complement ripple adder)
  - **Sequence Detector FSM** (detects `101` pattern)

### 4. 🏆 Problem Arena & Evaluation Engine
- **42 Curated Coding Challenges** across 7 standardized topics:
  - `Arrays`, `Strings`, `Searching`, `Sorting`, `Trees`, `Graphs`, `Dynamic Programming`.
- **Two-Level Collapsible Navigation:** Topic selector bar with live solved progress counters (`Arrays 1/6`), expanding into problem challenge pills.
- **Judge V2 Evaluation Engine:** Instant automated test-case runner supporting Python, Java, JavaScript, C++, Go, and Kotlin.
- **Verified Certificate Generator:** Generates verifiable completion certificates with cryptographic hashes.

### 5. 🗄️ Relational DBMS Workbench
- In-memory relational SQL engine supporting `CREATE TABLE`, `INSERT`, `SELECT`, `WHERE`, `ORDER BY`, `GROUP BY`, `JOIN`, and `UPDATE`.
- Real-time schema inspector, table data explorer, and pre-seeded database templates.
- Deep Tech Navy / Cyan workbench theme.

### 6. 🤖 Multi-Provider AI Copilot
- Context-aware engineering assistant supporting:
  - **Google Gemini** (Gemini 2.5 Flash / Pro)
  - **OpenAI** (GPT-4o)
  - **Anthropic Claude**
  - **Groq**
- Real-time technical explanations, code debugging, and architectural diagrams.

### 7. ☁️ In-App Cloudinary Dock (Sponsor Integration)
- Native split-screen media drawer docked into the top bar.
- On-demand asset upload, CDN transformation preview, and profile avatar optimization.

### 8. 🌐 Unified Developer Hub
- Quick-access dock connecting top platforms: GitHub, Vercel, Render, GitKraken, Netlify, LinkedIn, and LeetCode.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18, TypeScript, Vite |
| **Styling & Design** | TailwindCSS, Lucide Icons, Custom CSS Variables |
| **Runtimes & Interpreters** | In-Browser JS Async Engine, Python/Java Emulated Runners |
| **Relational Database** | In-Memory Relational SQL Engine |
| **Circuit Engine** | Custom Reactive Topology Evaluation Graph |
| **Media & CDN** | Cloudinary REST API & Optimization Engine |
| **AI Models** | Google Gemini API (google-genai), Multi-Provider Architecture |
| **Deployment** | Vercel Edge Network |

---

## 👥 Team
- **Karan Pareek** (Creator / Lead Developer) — `saritapareek578@gmail.com`
- **Ishika Dayal** (Team Member) — `dayalishika2@gmail.com`

---

## 💻 Local Development

```bash
# 1. Clone repository
git clone https://github.com/KaranPareekk/Titan_Sample.git
cd Titan_Sample

# 2. Install dependencies
bun install
# or npm install

# 3. Start development server
bun run dev
# or npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
