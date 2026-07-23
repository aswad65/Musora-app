import { useQuery } from "@tanstack/react-query";
import { useMusicContext } from "../../Context/MusicContext";
import toast from "react-hot-toast";

const useGetCommentBymusicId = (musicId) => {
  const { GetCommentBymusicId } = useMusicContext();

  return useQuery({
    queryKey: ["comments", musicId],

    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      return GetCommentBymusicId(id);
    },

    enabled: !!musicId,

    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Failed to fetch comments"
      );
    },
  });
};

export default useGetCommentBymusicId;