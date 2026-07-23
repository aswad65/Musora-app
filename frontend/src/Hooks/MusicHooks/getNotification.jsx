import { useQuery } from "@tanstack/react-query";
import { useMusicContext } from "../../Context/MusicContext";
const useGetNotification = () => {

    const { getNotification } = useMusicContext();

    return useQuery({
        queryKey: ["notifications"],

        queryFn:()=>getNotification(),

        refetchInterval: 5000, // every 5 sec

        refetchOnWindowFocus: true,
    });
};
export default useGetNotification;