import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMusicContext } from "../../Context/MusicContext";
import { toast } from "react-hot-toast";

 const useDoComment = () => {
  const { doComment } = useMusicContext();
  const queryClient = useQueryClient(); // 🔥 important

  return useMutation({
    mutationFn: ({ musicId, comment ,ownerId}) => doComment({ musicId, comment,ownerId }),

    onSuccess: () => {
      toast.success("Comment added 🎉");
      queryClient.invalidateQueries(["GetNotification"]);
      
      // 🔥 THIS IS THE FIX
      queryClient.invalidateQueries(["playlistTitles"]);
    },

    onError: () => {
      toast.error("Error adding comment ❌");
    },
  });
};
export default useDoComment;