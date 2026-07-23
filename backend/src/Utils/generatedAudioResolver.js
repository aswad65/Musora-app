import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '../../');
const PUBLIC_GENERATED_DIR = path.join(PROJECT_ROOT, 'public', 'generated');
const UPLOADS_DIR = path.join(PROJECT_ROOT, 'uploads');

const normalizeGeneratedPath = (input) => {
  if (!input) return null;

  const rawValue = String(input).trim();
  if (!rawValue) return null;

  const candidates = [];

  if (rawValue.startsWith('http://') || rawValue.startsWith('https://')) {
    try {
      const parsedUrl = new URL(rawValue);
      const pathname = decodeURIComponent(parsedUrl.pathname);
      candidates.push(path.resolve(PROJECT_ROOT, pathname.replace(/^\/+/, '')));
      candidates.push(path.resolve(PROJECT_ROOT, 'public', pathname.replace(/^\/+/, '')));
    } catch {
      // Ignore invalid URLs and continue.
    }
  }

  const normalized = rawValue.replace(/^\/+/, '');
  candidates.push(path.resolve(PROJECT_ROOT, normalized));
  candidates.push(path.resolve(PROJECT_ROOT, 'public', normalized));
  candidates.push(path.resolve(PUBLIC_GENERATED_DIR, normalized));
  candidates.push(path.resolve(PUBLIC_GENERATED_DIR, path.basename(normalized)));
  candidates.push(path.resolve(PUBLIC_GENERATED_DIR, normalized.replace(/^generated[\\/]/, '')));

  return candidates.find((candidate) => fsSync.existsSync(candidate)) || null;
};

export const resolveGeneratedAudioInput = async (req) => {
  const uploadedAudio = req.files?.audio?.[0];
  if (uploadedAudio) {
    return { type: 'file', file: uploadedAudio };
  }

  const generatedAudioPath = req.body?.generatedAudioPath || req.body?.generatedMusic || req.body?.audioPath;
  if (!generatedAudioPath) {
    return null;
  }

  const resolvedPath = normalizeGeneratedPath(generatedAudioPath);
  if (!resolvedPath) {
    throw new Error('Generated audio file could not be found');
  }

  await fs.mkdir(UPLOADS_DIR, { recursive: true });

  const copiedFileName = `generated-${Date.now()}-${path.basename(resolvedPath)}`;
  const copiedFilePath = path.join(UPLOADS_DIR, copiedFileName);
  await fs.copyFile(resolvedPath, copiedFilePath);

  const buffer = await fs.readFile(copiedFilePath);

  return {
    type: 'generated',
    file: {
      buffer,
      originalname: path.basename(resolvedPath),
      mimetype: 'audio/wav',
    },
  };
};
