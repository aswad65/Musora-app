import traceback
from pathlib import Path

import gradio as gr

from demucs_runner import (
    PROJECT_ROOT,
    load_pipeline,
    separate_audio,
)

STEM_ORDER = [
    "vocals",
    "no_vocals",
]

def _stem_updates_hidden() -> tuple:
    return tuple(gr.update(value=None, visible=False) for _ in STEM_ORDER)

def _stem_updates_from_paths(paths: dict[str, Path]) -> tuple:
    out: list = []
    for s in STEM_ORDER:
        p = paths.get(s)
        if p is not None:
            out.append(gr.update(value=str(p), visible=True))
        else:
            out.append(gr.update(value=None, visible=False))
    return tuple(out)

# track_tqdm=True: Demucs uses tqdm inside apply_model; Gradio patches tqdm so that bar shows in the UI (no progress() calls needed here).
def on_separate(audio, progress=gr.Progress(track_tqdm=True)):
    hidden = _stem_updates_hidden()
    no_header = gr.update(value="", visible=False)

    if audio is None:
        yield (*hidden, no_header, "Upload an audio file (MP3, WAV, …).")
        return

    try:
        load_pipeline()
        path = audio if isinstance(audio, str) else getattr(audio, "name", None) or str(audio)
        paths = separate_audio(path)
        yield (
            *_stem_updates_from_paths(paths),
            gr.update(value="### Stems", visible=True),
            gr.update(value=""),
        )
    except Exception:
        yield (*hidden, no_header, f"```\n{traceback.format_exc()}\n```")

def build_ui():
    with gr.Blocks(title="Demucs stem separation") as demo:
        gr.Markdown(
            "## Stem Separation\n\nUpload a mix, then run separate",
            elem_id="app_title",
        )
        with gr.Row():
            inp = gr.Audio(
                label="Input mix",
                type="filepath",
                sources=["upload"],
                editable=False,
            )
        with gr.Row():
            go = gr.Button("Separate", variant="primary")
        status = gr.Markdown(elem_id="status_line")
        stems_header = gr.Markdown(value="", visible=False, elem_id="stems_header")
        outs = [
            gr.Audio(
                label=name,
                type="filepath",
                interactive=False,
                editable=False,
                visible=False,
            )
            for name in STEM_ORDER
        ]
        go.click(
            on_separate,
            inputs=[inp],
            outputs=[*outs, stems_header, status],
            show_progress="full",
        )
    return demo

if __name__ == "__main__":
    demo = build_ui()


demo.launch(
    server_name="0.0.0.0",
    server_port=int(os.environ.get("PORT", 7960)),
    share=False,
    footer_links=[],
    css_paths=PROJECT_ROOT / "app.css",
)
