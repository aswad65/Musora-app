import { useQuery } from "@tanstack/react-query";
import { useMusicContext } from "../../Context/MusicContext";

const useGetMyMusic = () => {
    const { GetMyMusic } = useMusicContext();

    return useQuery({
        queryKey: ["GetMyMusic"],
        queryFn: GetMyMusic,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export default useGetMyMusic