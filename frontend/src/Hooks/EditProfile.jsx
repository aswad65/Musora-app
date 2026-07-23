import { useMutation } from "@tanstack/react-query"
import { useUserContext } from "../Context/UserContext"
import toast from "react-hot-toast"
import { useQueryClient } from "@tanstack/react-query";

const useEditProfile = () => {
    const queryClient = useQueryClient();
    const { EditProfile } = useUserContext()
    return useMutation({
        mutationFn: ( {formdata} ) => EditProfile(formdata),
        onSuccess: () => {
            toast.success("Profile updated successfully")
               queryClient.invalidateQueries(["userProfile"]);
        },
        onError: (err) => {
            console.error(err)
            toast.error(err?.response?.data?.message || "Failed to update profile")
        }
    })
}
export default useEditProfile