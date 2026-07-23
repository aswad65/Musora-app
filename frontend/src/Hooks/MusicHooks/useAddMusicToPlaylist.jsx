import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMusicContext } from "../../Context/MusicContext";
import { toast } from "react-hot-toast";

const useAddMusicToPlaylist = () => {
  const { addMusicInsidePlaylist } = useMusicContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ musicIds, playlistId }) => {
      // Since the backend only supports adding one by one, we use Promise.all
      const promises = musicIds.map((musicId) =>
        addMusicInsidePlaylist(musicId, playlistId)
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      toast.success("Music added to playlist successfully!");
      queryClient.invalidateQueries(["playlist"]);
    },
    onError: (error) => {
      // Access the backend error message if available
      const backendMessage = error?.response?.data?.message || error?.message;
      toast.error(backendMessage || "Error adding music to playlist");
    },
  });
};

export default useAddMusicToPlaylist;
