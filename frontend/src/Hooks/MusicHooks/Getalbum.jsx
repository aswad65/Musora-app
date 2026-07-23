import { useQuery } from "@tanstack/react-query";
import { useMusicContext } from "../../Context/MusicContext"

const useGetalbum=()=>{
    const {Getalbum}=useMusicContext();
    return useQuery({
        queryKey:["albums"],
        queryFn:()=>Getalbum(),
    })
}
export default  useGetalbum;