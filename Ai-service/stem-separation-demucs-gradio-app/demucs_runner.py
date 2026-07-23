from datetime import datetime
from pathlib import Path

import demucs.api
import torch as th

PROJECT_ROOT = Path(__file__).resolve().parent

# You can also use "htdemucs" if you prefer.
DEMUCS_MODEL = "htdemucs_6s"

_separator: demucs.api.Separator | None = None


def load_pipeline() -> None:
    global _separator

    if _separator is None:
        _separator = demucs.api.Separator(
            model=DEMUCS_MODEL,
            progress=True,
        )


def separate_audio(audio_path: str | Path) -> dict[str, Path]:
    load_pipeline()

    path = Path(audio_path)
    if not path.is_file():
        raise FileNotFoundError(f"Audio not found: {path}")

    origin, separated = _separator.separate_audio_file(path)

    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    out_dir = PROJECT_ROOT / "output" / f"demucs_{stamp}"
    out_dir.mkdir(parents=True, exist_ok=True)

    sr = _separator.samplerate

    result: dict[str, Path] = {}

    # Get vocals
    vocals = separated["vocals"]
    dest_vocals = out_dir / "vocals.wav"
    demucs.api.save_audio(
        vocals,
        str(dest_vocals),
        samplerate=sr,
        as_float=True,
    )
    result["vocals"] = dest_vocals

    # Get no_vocals (original - vocals)
    no_vocals = origin - vocals
    dest_no_vocals = out_dir / "no_vocals.wav"
    demucs.api.save_audio(
        no_vocals,
        str(dest_no_vocals),
        samplerate=sr,
        as_float=True,
    )
    result["no_vocals"] = dest_no_vocals

    return result