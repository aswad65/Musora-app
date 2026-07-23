import { useQuery } from "@tanstack/react-query";
import { useMusicContext } from "../../Context/MusicContext";

const useGetFollower = (userId) => {
  const { GetFollower } = useMusicContext();
  

  return useQuery({
    queryKey: ["GetFollower", userId], 
    queryFn: () => GetFollower(userId),
    enabled: !!userId, // Only run if userId is provided
    onError: (err) => {
      console.error(err);
    }
  });
};

export default useGetFollower;;
