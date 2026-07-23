import { useQuery } from "@tanstack/react-query";
import { useMusicContext } from "../../Context/MusicContext";

const useGetplaylistTitles = () => {
  const { GetplaylistTitles } = useMusicContext();

  return useQuery({
    queryKey: ["playlistTitles"],
    queryFn: async () => {
      return await GetplaylistTitles();
    },
  });
};

export default useGetplaylistTitles;