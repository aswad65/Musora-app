import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffprobeInstaller from "@ffprobe-installer/ffprobe";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);
import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const TEMP_DIR = path.join(__dirname, '../../temp/audio');
const PUBLIC_DIR = path.join(__dirname, '../../public/generated');

/**
 * Download audio from URL to local temp file
 * @param {string} url - Audio URL
 * @param {string} outputPath - Path to save file
 * @returns {Promise<string>} Path to saved file
 */
async function downloadAudio(audioSource, outputPath) {
    try {
        let url = audioSource;

        // Gradio file object
        if (typeof audioSource === "object" && audioSource !== null) {
            url = audioSource.url || audioSource.path;
        }

        console.log("Downloading from:", url);

        if (typeof url !== "string") {
            throw new Error(`Invalid audio source: ${JSON.stringify(audioSource)}`);
        }

        if (url.startsWith("data:audio")) {
            const base64Data = url.split(",")[1];
            await fs.writeFile(outputPath, base64Data, "base64");
            return outputPath;
        }

        const response = await axios.get(url, {
            responseType: "arraybuffer"
        });

        await fs.writeFile(outputPath, response.data);

        return outputPath;

    } catch (error) {
        console.error("Error downloading audio:", error);
        throw new Error(`Failed to download audio: ${error.message}`);
    }
}
/**
 * Merge multiple audio files into one using FFmpeg
 * @param {string[]} inputPaths - Array of local audio file paths
 * @param {string} outputPath - Path for merged output file
 * @returns {Promise<string>} Path to merged file
 */
async function mergeAudioFiles(inputPaths, outputPath) {
    return new Promise((resolve, reject) => {
        const ffmpegCommand = ffmpeg();
        
        // Add each input file
        inputPaths.forEach(filePath => {
            ffmpegCommand.input(filePath);
        });
        
        // Merge and export
        ffmpegCommand
            .on('start', (commandLine) => {
                console.log('FFmpeg process started with command:', commandLine);
            })
            .on('progress', (progress) => {
                console.log('Processing: ' + Math.round(progress.percent) + '% done');
            })
            .on('end', () => {
                console.log('Audio merge complete');
                resolve(outputPath);
            })
            .on('error', (err) => {
                console.error('Error merging audio:', err);
                reject(new Error(`Failed to merge audio: ${err.message}`));
            })
            .mergeToFile(outputPath, path.dirname(outputPath));
    });
}

/**
 * Process multiple audio URLs: download, merge, and clean up
 * @param {string[]} audioUrls - Array of audio URLs to merge
 * @returns {Promise<string>} Public URL to merged audio
 */
export async function processAndMergeAudio(audioUrls) {
    const uniqueId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const tempFiles = [];
    
    try {
        // Ensure directories exist
        await fs.ensureDir(TEMP_DIR);
        await fs.ensureDir(PUBLIC_DIR);
        
        console.log(`Starting to process ${audioUrls.length} audio segments`);
        
        // Download all audio files
        for (let i = 0; i < audioUrls.length; i++) {
            const tempPath = path.join(TEMP_DIR, `segment_${uniqueId}_${i}.wav`);
            console.log(`Downloading segment ${i + 1} of ${audioUrls.length}`);
            await downloadAudio(audioUrls[i], tempPath);
            tempFiles.push(tempPath);
        }
        
        // Merge the files
        const outputFileName = `final_song_${uniqueId}.wav`;
        const outputPath = path.join(PUBLIC_DIR, outputFileName);
        console.log('Merging audio segments');
        await mergeAudioFiles(tempFiles, outputPath);
        
        // Cleanup temp files
        console.log('Cleaning up temporary files');
        for (const file of tempFiles) {
            try {
                await fs.remove(file);
            } catch (cleanupErr) {
                console.warn('Failed to cleanup temp file:', cleanupErr);
            }
        }
        
        // Return public URL
        return `/generated/${outputFileName}`;
        
    } catch (error) {
        // Cleanup on error
        console.error('Error processing audio, cleaning up temp files');
        for (const file of tempFiles) {
            try {
                await fs.remove(file);
            } catch (cleanupErr) {
                console.warn('Failed to cleanup temp file during error:', cleanupErr);
            }
        }
        throw error;
    }
}

/**
 * Delete old generated files (keep files for 1 hour)
 */
export async function cleanupOldFiles() {
    try {
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        const files = await fs.readdir(PUBLIC_DIR);
        
        for (const file of files) {
            const filePath = path.join(PUBLIC_DIR, file);
            const stats = await fs.stat(filePath);
            if (stats.mtimeMs < oneHourAgo) {
                await fs.remove(filePath);
                console.log('Deleted old file:', file);
            }
        }
    } catch (error) {
        console.error('Error cleaning up old files:', error);
    }
}
