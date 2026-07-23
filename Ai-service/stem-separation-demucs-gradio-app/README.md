#### 🚀 Demucs + Gradio: Build a Local AI Music Stem Separator

This project is a local web application built with Gradio that uses the high-level Demucs API from Facebook Research (Meta) for audio stem separation.

It runs entirely in Python, starting with a setup script that installs dependencies and downloads the model weights so everything is ready before you launch the app. The weights are stored locally in a cache and reused on later runs, so the download only happens once.

When you open the app, it runs on localhost in the browser, where you can upload an audio track and press a button to separate it into six stems: drums, bass, guitar, piano, vocals, and other.

The generated outputs are saved in the output folder.

#### 👉 Links & Resources
- [fal.ai Demucs Model](https://fal.ai/models/fal-ai/demucs)  
- [Gradio Web Interface](https://www.gradio.app/)
- [Demucs GitHub Repository](https://github.com/facebookresearch/demucs)

---


#### 🚀 Clone and Run

```bash
# Clone the repository
git clone https://github.com/Ashot72/stem-separation-demucs-gradio-app
cd stem-separation-demucs-gradio-app

# First-time setup
setup.bat

# Start the app
run.bat

# The app will be available at http://127.0.0.1:7860
```
🛠 Debugging in VS Code 

Install Microsoft’s [Python Debugger](https://marketplace.visualstudio.com/items?itemName=ms-python.debugpy) extension 

Open the Run view (View → Run or Ctrl+Shift+D) to access the debug configuration

📺 **Video** [Watch on YouTube](https://youtu.be/5MdXkAZQc6M) 