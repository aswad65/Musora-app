import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMusicContext } from "../../Context/MusicContext";
import toast from "react-hot-toast";

export const useDeletePlaylist = () => {
    const { DeletePlaylist } = useMusicContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (playlistId) => DeletePlaylist(playlistId),
        onSuccess: () => {
            toast.success("Playlist deleted successfully");
            queryClient.invalidateQueries(["get-playlist-title"]);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Failed to delete playlist");
        }
    });
};

export const useDeleteMusicFromPlaylist = () => {
    const { DeleteMusicFromPlaylist } = useMusicContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ playlistId, musicId }) => DeleteMusicFromPlaylist(playlistId, musicId),
        onSuccess: (_, variables) => {
            toast.success("Music removed from playlist");
            // Fixed query key to match useGetplaylist.jsx
            queryClient.invalidateQueries(["playlist", variables.playlistId]);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Failed to remove music");
        }
    });
};