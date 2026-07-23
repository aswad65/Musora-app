import { useQuery } from "@tanstack/react-query";
import { useMusicContext } from "../../Context/MusicContext";

const useGetMusicById = (id) => {
  const { GetMusicById } = useMusicContext();
  

  return useQuery({
    queryKey: ["GetMusicById", id], 
    queryFn: () => GetMusicById(id),
    enabled: !!id, // Only run if id is provided
    onSuccess: () => {
      console.log("Music fetched successfully");
    },
    onError: (err) => {
      console.error(err);
    }
  });
};

export default useGetMusicById;;
