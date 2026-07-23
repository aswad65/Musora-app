import { useQuery } from "@tanstack/react-query";
import { useMusicContext } from "../../Context/MusicContext";

export const useGetplaylist = (titleId) => {
  const { GetPlaylist } = useMusicContext();
  

  return useQuery({
    queryKey: ["playlist", titleId], // ✅ include id
    queryFn: async () => {
      return await GetPlaylist(titleId); // ✅ pass id + return
    },
    enabled: !!titleId, // ✅ only run when id exists
  });
};