import { useMutation } from "@tanstack/react-query";
import { useMusicContext } from "../../Context/MusicContext";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
const useDeleteMusic = () => {
    const queryClient = useQueryClient();
    const { DeleteMusic } = useMusicContext();
    return useMutation({
        mutationFn: ({ musicId }) => DeleteMusic(musicId),
        onSuccess: () => {
            toast.success("Music Deleted");
            queryClient.invalidateQueries(["GetALLMusic"]);


        }
    })
}
export default useDeleteMusic;