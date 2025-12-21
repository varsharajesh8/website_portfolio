# EECS 281 Project 4 — Drone Delivery (C++)

**Modes:** `MST`, `FASTTSP`, `OPTTSP`

This project implements three classic graph problems on a set of 2D points (delivery locations):

- **MST:** Build a minimum spanning tree under **campus/border connectivity constraints** (medical vs. main campus).
- **FASTTSP:** Produce a **fast near-optimal** Traveling Salesperson tour (heuristic / approximation).
- **OPTTSP:** Compute the **optimal** TSP tour using **branch-and-bound** with effective lower bounds and pruning.

## Highlights
- Efficient distance computation (no full distance matrix for large inputs in MST/FASTTSP).
- Careful data structure choices for performance at large `n`.
- Branch-and-bound pruning strategy for optimal TSP at smaller `n`.

## How to run
```bash
make
./drone -m MST < input.txt
./drone -m FASTTSP < input.txt
./drone -m OPTTSP < input.txt
```

> Course spec includes constraints on libraries and optimization (`-O3`) and requires correct formatting of output.
