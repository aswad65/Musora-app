import { useQuery } from "@tanstack/react-query"
import { useMusicContext } from "../../Context/MusicContext";

const useGetLikeMusicById = (id) => {
  const { GetlikeMusicbyId } = useMusicContext();

  return useQuery({
    queryKey: ["likeMusicbyId", id],

    queryFn: () => GetlikeMusicbyId(id),

    enabled: !!id,

    onError: (err) => {
      console.error(err);
    },
  });
};

export default useGetLikeMusicById;