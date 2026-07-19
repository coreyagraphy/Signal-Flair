#!/usr/bin/env python3
"""Verify GPU transcription readiness. Reports honestly; never assumes CUDA."""
from __future__ import annotations

import shutil
import subprocess
import sys


def main() -> int:
    ok = True
    if shutil.which("nvidia-smi"):
        result = subprocess.run(["nvidia-smi", "--query-gpu=name,memory.total",
                                 "--format=csv,noheader"],
                                capture_output=True, text=True, timeout=30)
        print(f"GPU: {result.stdout.strip() or 'query failed'}")
    else:
        print("nvidia-smi not found — no NVIDIA GPU driver on this machine")
        ok = False
    try:
        import faster_whisper  # noqa: F401
        print("faster-whisper: installed")
        try:
            from faster_whisper import WhisperModel
            WhisperModel("tiny", device="cuda", compute_type="float16")
            print("CUDA model load: OK (tiny model)")
        except Exception as exc:
            print(f"CUDA model load failed ({exc}) — CPU fallback will be used")
            ok = False
    except ImportError:
        print("faster-whisper: NOT installed (pip install faster-whisper)")
        ok = False
    print("verify_gpu:", "READY" if ok else "NOT READY (CPU/energy fallback applies)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
