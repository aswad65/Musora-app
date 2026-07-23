import { useQuery } from "@tanstack/react-query";
import { useMusicContext } from "../../Context/MusicContext";

const useGetMusicBymusicId=(musicId)=>{
    const {GetMusicBymusicId}=useMusicContext();
    return useQuery({       
        queryKey:["musicById", musicId],
        queryFn:()=>GetMusicBymusicId(musicId),
        enabled:!!musicId
    })
}  
export default useGetMusicBymusicId; 