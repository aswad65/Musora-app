
import { prompt_send_toPythonService ,DemucsMusic_Vocalseparated_AiService} from '../services/Ai-service.js';
import { processAndMergeAudio } from '../services/audioProcessor.js';
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure temp and output directories exist
const TEMP_DIR = path.join(__dirname, "../../temp/audio");
const PUBLIC_GEN_DIR = path.join(__dirname, "../../public/generated");

// Initialize directories on module load
(async () => {
  await fs.ensureDir(TEMP_DIR);
  await fs.ensureDir(PUBLIC_GEN_DIR);
})();

export const Prompt_send_toPython = async (req, res) => {
    const { prompt } = req.body;

    try {
        const result = await prompt_send_toPythonService(prompt);
        
        // Check if the result is audio (array of URLs) or text
        if (Array.isArray(result) && result.length > 0) {
            // If it's audio, process and merge
            const mergedAudioUrl = await processAndMergeAudio(result);
            console.log({
                type: "audio",
                audioUrl: mergedAudioUrl
            });
            
            return res.json({
                type: "audio",
                audioUrl: mergedAudioUrl
            });
        } else {
            // If it's text, return as is
            return res.json({
                type: "text",
                content: result
            });
        }
    } catch (error) {
        console.error("Error in Prompt_send_toPython:", error);
        res.status(500).json({
            type: "text",
            content: `Sorry, I'm having trouble processing your request right now. Please try again later. Error: ${error.message}`
        });
    }
};

export const DemucsMusic_Vocalseparated_AiController = async (req, res) => {
  let inputFilePath = null;
  let audioSource = null;
  
  try {
    console.log("\n========== [STEP 1] Request received ==========");
    console.log("Request received! req.file:", req.file);
    console.log("Request body:", req.body);
    
    // Check if we have an uploaded file (from user's computer)
    if (req.file) {
      audioSource = "UPLOADED_FILE";
      console.log("\n========== [STEP 2] Audio source detected: UPLOADED_FILE ==========");
      console.log("Using uploaded file from AImulter:", req.file.path);
      inputFilePath = req.file.path;
    } 
    // If no uploaded file, check if we have an audio URL (from My Music)
    else if (req.body.audioUrl) {
      audioSource = "AUDIO_URL";
      console.log("\n========== [STEP 2] Audio source detected: AUDIO_URL ==========");
      console.log("Fetching file from URL:", req.body.audioUrl);
      
      // Download the file from the URL to temp directory
      const response = await axios({
        method: "GET",
        url: req.body.audioUrl.startsWith("http") 
          ? req.body.audioUrl 
          : `http://localhost:3000${req.body.audioUrl}`,
        responseType: "stream"
      });
      
      const fileName = path.basename(req.body.audioUrl);
      inputFilePath = path.join(TEMP_DIR, `${Date.now()}_${fileName}`);
      
      // Pipe the response to a file
      const writer = fs.createWriteStream(inputFilePath);
      response.data.pipe(writer);
      
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
      
      console.log("\n========== [STEP 3] Download completed ==========");
      console.log("Downloaded file to:", inputFilePath);
    } 
    
    else {
      return res.status(400).json({
        type: "text",
        content: "No audio file or URL provided"
      });
    }

    // ----------------------
    // VALIDATION STEPS
    // ----------------------
    console.log("\n========== [STEP 4] Creating absolute path ==========");
    const originalPath = inputFilePath;
    inputFilePath = path.resolve(inputFilePath);
    console.log("Original path:", originalPath);
    console.log("Absolute path:", inputFilePath);

    console.log("\n========== [STEP 5] Checking if file exists ==========");
    const fileExists = await fs.pathExists(inputFilePath);
    console.log("File exists:", fileExists);
    if (!fileExists) {
      throw new Error("Audio file does not exist before sending to Gradio");
    }

    console.log("\n========== [STEP 6] Checking file size ==========");
    const stat = await fs.stat(inputFilePath);
    console.log("File size:", stat.size, "bytes");
    if (stat.size === 0) {
      throw new Error("Downloaded audio file is empty.");
    }

    console.log("\n========== [STEP 7] Sending file to Gradio ==========");

    // ----------------------
    // GRADIO API INTEGRATION
    // ----------------------
    
    const result = await DemucsMusic_Vocalseparated_AiService(inputFilePath);
    console.log("\n========== [STEP 8] Gradio call completed successfully ==========");
 
    
    // ----------------------
    // PROCESS GRADIO RESULTS
    // ----------------------
    console.log("\n========== [STEP 9] Processing Gradio results ==========");
    
    // Validate the Gradio result structure
    if (!result || !Array.isArray(result) || result.length < 2) {
      throw new Error("Invalid Gradio result structure: data array missing or too short");
    }
    
    // Extract the vocals and no_vocals from their wrapped { visible, value }
    const vocalsWrapper = result[0];
    const noVocalsWrapper = result[1];
    
    if (!vocalsWrapper?.value?.url || !noVocalsWrapper?.value?.url) {
      throw new Error("Invalid Gradio result structure: missing value.url in first two elements");
    }
    
    const vocalsGradioFile = vocalsWrapper.value;
    const noVocalsGradioFile = noVocalsWrapper.value;
    
    console.log("Extracted vocals URL:", vocalsGradioFile.url);
    console.log("Extracted no_vocals URL:", noVocalsGradioFile.url);
    
    // Helper function to download Gradio file to public directory using its URL
    const saveGradioFileFromUrl = async (gradioFileData, fileNameSuffix) => {
        const downloadUrl = gradioFileData.url;
        const originalFileName = gradioFileData.orig_name || "unknown";
        const fileExtension = path.extname(originalFileName) || ".wav";
        
        console.log(`Downloading ${fileNameSuffix} from URL:`, downloadUrl);
        
        const downloadResponse = await axios({
            method: 'GET',
            url: downloadUrl,
            responseType: 'stream'
        });
        
        const savedFileName = `${Date.now()}_${fileNameSuffix}${fileExtension}`;
        const savedFilePath = path.join(PUBLIC_GEN_DIR, savedFileName);
        
        const writer = fs.createWriteStream(savedFilePath);
        downloadResponse.data.pipe(writer);
        
        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
        
        return `/generated/${savedFileName}`;
    };
    
    const vocalsUrl = await saveGradioFileFromUrl(vocalsGradioFile, 'vocals');
    const noVocalsUrl = await saveGradioFileFromUrl(noVocalsGradioFile, 'no_vocals');
    
    console.log("Final separated files saved:");
    console.log("  Vocals:", vocalsUrl);
    console.log("  No Vocals:", noVocalsUrl);
    
    // ----------------------
    // RETURN RESPONSE
    // ----------------------
    console.log("\n========== [STEP 10] Returning response to client ==========");
    console.log({type: "separated_audio",
        vocalsUrl: vocalsUrl,
        noVocalsUrl: noVocalsUrl
      }
      )
    res.json({
        type: "separated_audio",
        vocalsUrl: vocalsUrl,
        noVocalsUrl: noVocalsUrl
    });
    
  } catch (error) {
    console.error("Error in Demucs controller:", error);
    res.status(500).json({
      type: "text",
      content: `Sorry, there was an error: ${error.message}`
    });
  }
}
