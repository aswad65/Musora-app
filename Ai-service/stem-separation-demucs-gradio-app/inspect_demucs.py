import inspect
import sys
import demucs.api
import demucs

print('python', sys.version)
print('demucs module', demucs.__file__)
print('demucs version', getattr(demucs, '__version__', 'unknown'))
print('Separator signature:', inspect.signature(demucs.api.Separator))
print('save_audio signature:', inspect.signature(demucs.api.save_audio))
print('Separator has separate_audio_file:', hasattr(demucs.api.Separator, 'separate_audio_file'))
if hasattr(demucs.api.Separator, 'separate_audio_file'):
    print('separate_audio_file signature:', inspect.signature(demucs.api.Separator.separate_audio_file))
print('Separator source file:', inspect.getsourcefile(demucs.api.Separator))
