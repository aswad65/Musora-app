import { useMutation } from '@tanstack/react-query'
import { useUserContext } from '../Context/UserContext'
const useRegister = () => {
    const {Registeruser}=useUserContext()
  return (
    useMutation({
        mutationFn:Registeruser,
        onSuccess:()=>{
            console.log("User registered successfully");
        },
        onError:(err)=>{
            console.error(err);
        }
    })
  )
}

export default useRegister