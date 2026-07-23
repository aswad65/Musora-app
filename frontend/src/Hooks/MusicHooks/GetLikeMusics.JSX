import { use } from "react"
import { useMusicContext } from "../../Context/MusicContext"
import { useQuery } from "@tanstack/react-query"

const useGetLikedMusic = () => {
    const{GetLikeMusic}=useMusicContext()
    return useQuery({
        queryKey:["GetlikedMusic"],
        queryFn:()=>GetLikeMusic(),
        onSuccess:()=>{
            console.log("liked music fetched successfully");
        }

    })
}
export default useGetLikedMusic