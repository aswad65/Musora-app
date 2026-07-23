import { useQuery } from "@tanstack/react-query";
import { useMusicContext } from "../../Context/MusicContext";

const useGetalbumbyId=(albumId)=>{
    const {GetalbumById}=useMusicContext();
    return useQuery({
        queryKey:["albumById",albumId],
        queryFn:()=>GetalbumById(albumId),
        enabled:!!albumId,
    })
}
export default useGetalbumbyId