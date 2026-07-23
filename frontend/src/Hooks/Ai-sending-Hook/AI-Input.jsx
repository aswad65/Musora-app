import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAIMusic } from '../../Context/AI-Context'

const useAiInput = () => {
    const {Ai_prompt}=useAIMusic()
  return (
    useMutation({
        mutationFn:(prompt)=>Ai_prompt(prompt),
     
        onError:(err)=>{
            toast.error(err.message);
        }
    })
  )
}

export default useAiInput
