# Log Manager (logman) — EECS 281 Project 3

**Logman** is an interactive command-line tool for exploring large log files.
It reads a master log file (timestamp | category | message), builds indexes, and then enters a prompt-driven mode where you can search and curate an **excerpt list** of relevant entries.

## What it does
- **Parse & store** log entries with stable `entryID`s (0..N-1)
- **Search**
  - timestamp range (`t start|end`)
  - exact timestamp match (`m ts`)
  - category match (`c category`)
  - keyword search across category + message (`k keywords...`)
- **Build an excerpt list**
  - append by `entryID` (`a id`)
  - append latest search results (`r`)
  - delete / move entries within the excerpt list (`d`, `b`, `e`)
  - sort excerpt list (`s`) / clear it (`l`)
- **Print** latest search results (`g`) or excerpt list (`p`)

## Why it’s interesting
This project was a great exercise in choosing **multiple cooperating data structures** for speed and memory efficiency:
- parsing + normalization for **case-insensitive** search
- indexing strategies for **fast timestamp lookups**
- maintaining an excerpt list without excessive copying

## Tech
- C++ (STL containers + algorithms)
- Command-line parsing + interactive REPL

> Note: This is a course project implementation intended to demonstrate data structures, indexing, and careful performance tradeoffs.
