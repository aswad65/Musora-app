
import { useQuery } from '@tanstack/react-query'
import { useUserContext } from '../Context/UserContext'
export const useGetAlluser = () => {
    const { getAllUsers}=useUserContext()
    return useQuery({
        queryKey: ["GetAllUsers"], // unique key
        queryFn: getAllUsers,
        onSuccess: () => {
            console.log("Music fetched successfully");
        },
        onError: (err) => {
            console.error(err);
        }
    });
   
  
}