
import { useQuery } from '@tanstack/react-query'
import { useUserContext } from '../Context/UserContext'
export const useGetUser = () => {
    const {getUser}=useUserContext()
    return useQuery({
        queryKey: ["user"], // unique key
        queryFn: getUser,
        onSuccess: () => {
            console.log("User fetched successfully");
        },
        onError: (err) => {
            console.error(err);
        }
    });
   
  
}
