import axios from "axios"
import { useContext,createContext } from "react"


const AIContext = createContext()
export const AIMusicProvider = ({children}) => {
    const Ai_prompt=async(prompt)=>{
        try {
            const data = await axios.post("http://localhost:3000/api/users/Prompt_send_toPython",{prompt})
            return data
        } catch (error) {
            console.log(error)
        }
    }
 const Ai_Karoke_servie=async(formdata)=>{
    try {
        // Send form data directly, don't wrap in object
        const data = await axios.post("http://localhost:3000/api/users/Karoke_send_toPython", formdata, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        return data
    } catch (error) {
        console.error("Error in Ai_Karoke_servie:", error.response?.data || error.message);
        toast.error(error.response?.data?.message || error.message || "Failed to send song to karaoke");
    }
}
  return (
    <AIContext.Provider value={{Ai_prompt,Ai_Karoke_servie}}>
      {children}
    </AIContext.Provider>
  )
}
export const useAIMusic = () => {
  return useContext(AIContext)

}

