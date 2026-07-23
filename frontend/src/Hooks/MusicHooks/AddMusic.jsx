import { useMutation } from "@tanstack/react-query"
import { useMusicContext } from "../../Context/MusicContext"
import toast from "react-hot-toast"
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from '@tanstack/react-router';
const useAddMusic = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { addMusic } = useMusicContext();

    return useMutation({
        mutationFn: ({ FormData }) => addMusic(FormData),

        onSuccess: async () => {
            toast.success("Music Added");
            
            await queryClient.invalidateQueries({
                queryKey: ["GetALLMusic"],
            });

            queryClient.invalidateQueries({ queryKey: ["GetMusicById"] });
            queryClient.invalidateQueries({ queryKey: ["albums"] });

            navigate({ to: "/" });
        },

        onError: (err) => {
            console.error(err);
            toast.error(err?.response?.data?.message || "Music Not Added");
        },
    });
};

export default useAddMusic;