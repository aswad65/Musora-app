import { useQuery } from '@tanstack/react-query'
import { useUserContext } from '../Context/UserContext'
export const useGetAllByuser = (userId) => {
    const { GetSingleUser } = useUserContext();

    return useQuery({
        queryKey: ["GetSingleUser", userId], // ✅ include userId
        queryFn: () => GetSingleUser(userId), // ✅ call here
        enabled: Boolean(userId),
    });
};