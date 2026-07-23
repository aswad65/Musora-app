import { useQuery } from "@tanstack/react-query";
import { useMusicContext } from "../../Context/MusicContext";

const useGetAllMusic = () => {
  const { GetALLMusic } = useMusicContext();

  return useQuery({
    queryKey: ["GetALLMusic"], 
    queryFn: GetALLMusic,
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
    cacheTime: 1000 * 60 * 10, // Cache for 10 minutes (gcTime in v5)
    refetchOnWindowFocus: false, // Don't refetch when user switches windows
    retry: 1, // Retry once if failed
  });
};

export default useGetAllMusic;