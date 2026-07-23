import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAIMusic } from '../../Context/AI-Context'

const useAiKarokeService = () => {
    const {Ai_Karoke_servie}=useAIMusic()
  return (
    useMutation({
        mutationFn:(formdata)=>Ai_Karoke_servie(formdata), // Now expecting just formdata, not { formdata }
        onSuccess:(data)=>{
            toast.success("karaoke has been created!");
            console.log("Karaoke creation success:", data);
        },
        onError:(err)=>{
            console.error("Karaoke creation error:", err);
            toast.error(err.message || "Failed to create karaoke");
        }
    })
  )
}

export default useAiKarokeService
