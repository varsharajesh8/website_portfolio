# Text Generation with a Homemade LSTM

This project implements character-level text generation using an LSTM built/trained in PyTorch (homemade training loop and sampling).

**What it does**
- Trains an LSTM language model on a text corpus
- Generates new text by sampling from the model one character at a time

**Files**
- `rajesh_lstm-2.py` — training + generation script
- `Rajesh_Coleridge_checkpt_dim256_lr0.0003.pth` — saved model checkpoint (example)

**How to run (example)**
```bash
python rajesh_lstm-2.py
```

> Note: Exact CLI flags and dataset paths (if any) are documented inside the script.
