import { useMutation, useQuery } from "@tanstack/react-query"
import { useMusicContext } from "../../Context/MusicContext"
import { Music } from "lucide-react"
import toast from "react-hot-toast"
import { useQueryClient } from "@tanstack/react-query";

const useLikeMusic=()=>{
    const {LikedMusic}=useMusicContext()
    const queryClient = useQueryClient();
    return useMutation({
         mutationFn:({MusicId,ownerId})=>LikedMusic(MusicId,ownerId),
        onSuccess:(data)=>{
            if(data?.message?.[0]?.Status==="Liked"){
                toast.success("Music Liked")
            
            }
            else{
                toast.error("Music Unliked")
            }
              queryClient.invalidateQueries(["GetALLMusic"]);
              queryClient.invalidateQueries(["musicById"]);

                queryClient.invalidateQueries(["GetlikedMusic"]);
                queryClient.invalidateQueries(["GetlikeMusicbyId"]);
                queryClient.invalidateQueries(["GetNotification"]);

        }
    })
}
export default useLikeMusic