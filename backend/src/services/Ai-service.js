import axios from 'axios';
import { Client,handle_file } from "@gradio/client";
import fs from "fs-extra";
import path from "path";

export const prompt_send_toPythonService = async (prompt) => {
    try {
        const audioParts = [];

        for (let i = 0; i < 6; i++) {
            const res = await axios.post(
                "http://127.0.0.1:7860/gradio_api/run/generate_music",
                {
                    data: [
                        `${prompt}, part ${i + 1}, continuous music`,
                        true,
                        false
                    ]
                }
            );

            // IMPORTANT: extract audio result
            const audioUrl = res.data?.data?.[0];
            audioParts.push(audioUrl);
        }

        return audioParts;

    } catch (error) {
        console.log(error.response?.data || error.message);
    }
};

export const DemucsMusic_Vocalseparated_AiService=async (inputFilePath)=>{
    try {
            console.log("Connecting to Gradio client...");
            console.log("ssadsadsadsa",inputFilePath);
            
            const client = await Client.connect("http://127.0.0.1:7960");
            
        console.log("Calling Gradio predict('/on_separate') with absolute path:", inputFilePath);
        const result = await client.predict("/on_separate", {
            audio: handle_file(inputFilePath),
        });
            
            console.log("Full Gradio predict result:");
            console.dir(result, { depth: null });
            return result.data;
    } catch (error) {
        console.log("Error in Demucs service:", error);
        if (error.response) {
            console.log("Error response data:", error.response.data);
            console.log("Error response status:", error.response.status);
        }
        throw error; // Re-throw the error so the controller catches it
    }
}