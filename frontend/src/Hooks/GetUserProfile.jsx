
import { useQuery } from '@tanstack/react-query'
import { useUserContext } from '../Context/UserContext'
export const useGetUserProfile = () => {
    const {getUserProfile}=useUserContext()
    return useQuery({
        queryKey: ["userProfile"], // unique key
        queryFn: getUserProfile,
        onSuccess: () => {
            console.log("User fetched successfully");
        },
        onError: (err) => {
            console.error(err);
        }
    });
   
  
}
