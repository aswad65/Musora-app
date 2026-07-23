import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useUserContext } from "../../Context/UserContext";
import { useQueryClient } from "@tanstack/react-query";

const useFollowUser = () => {
  const { FollowUser } = useUserContext();
  const queryClient = useQueryClient();

 return useMutation({
  mutationKey: ["FollowUser"], 
  mutationFn: (userId) => FollowUser(userId),

  onSuccess: (data) => {
    const res = data.data.result[0][0]; // 👈 important

    toast.success(res.Message); // show backend message
    console.log(res);
    queryClient.invalidateQueries(["GetNotification"]);
     queryClient.invalidateQueries(["GetAllUsers"]);
     queryClient.invalidateQueries(["GetFollower"]);
     queryClient.invalidateQueries(["GetFollowuserId"]);
     queryClient.invalidateQueries(["GetCommentBymusicId"]);
     queryClient.invalidateQueries(["GetMusicByUserId"]);
  }
});
  }

export default useFollowUser;