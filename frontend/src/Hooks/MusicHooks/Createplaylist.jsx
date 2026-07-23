import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMusicContext } from "../../Context/MusicContext";
import { toast } from "react-hot-toast";

 const useCreatePlaylist = () => {
  const { createPlaylist } = useMusicContext();
  const queryClient = useQueryClient(); // 🔥 important

  return useMutation({
    mutationFn: (title) => createPlaylist(title)  ,

    onSuccess: () => {
      toast.success("Playlist created 🎉");

      // 🔥 THIS IS THE FIX
      queryClient.invalidateQueries(["playlistTitles"]);
    },

    onError: () => {
      toast.error("Error creating playlist ❌");
    },
  });
};
export default useCreatePlaylist;