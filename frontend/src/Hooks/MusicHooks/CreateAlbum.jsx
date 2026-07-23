import { useMutation, useQueryClient} from "@tanstack/react-query"
import { useMusicContext } from "../../Context/MusicContext"
import toast from "react-hot-toast"

const useCreateAlbum = () => {
    const { CreateAlbum } = useMusicContext()
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ FormData }) => await CreateAlbum(FormData),
        onSuccess: () => {
            toast.success("Album created successfully");
            queryClient.invalidateQueries(["albums"]);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Failed to create album");
        }
    })
}
export default useCreateAlbum