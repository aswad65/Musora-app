import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMusicContext } from "../../Context/MusicContext";
import toast from "react-hot-toast";

 const useDeleteComment = () => {
    const { DeleteComment } = useMusicContext();
    const queryClient = useQueryClient(); // 🔥 important
    return useMutation({
        mutationFn: (commentId) => DeleteComment(commentId),
        onSuccess: () => {
            toast.success("Comment deleted 🎉")
                queryClient.invalidateQueries(["comments"])
                },
        onError: () => {
            toast.error("Error deleting comment ❌")
        }
    })
}
export default useDeleteComment;