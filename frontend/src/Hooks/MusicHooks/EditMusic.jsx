import { useMutation } from "@tanstack/react-query"
import { useMusicContext } from "../../Context/MusicContext"
import toast from "react-hot-toast"
import { useQueryClient } from "@tanstack/react-query";

const useEditMusic = () => {
    const queryClient = useQueryClient();
    const { editMusic } = useMusicContext()
    return useMutation({
        mutationFn: ({ FormData }) => editMusic(FormData),
        onSuccess: () => {
            toast.success("Music Updated")
               queryClient.invalidateQueries(["GetALLMusic"]);
               queryClient.invalidateQueries(["GetMyMusic"]);
               queryClient.invalidateQueries(["GetMusicById"]);
        },
        onError: (err) => {
            console.error(err)
            toast.error(err?.response?.data?.message || "Music Not Updated")
        }
    })
}
export default useEditMusic
