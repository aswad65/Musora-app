import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { useUserContext } from '../Context/UserContext'
export const useLogin = () => {
    const {Loginuser}=useUserContext()
  return (
        useMutation({
            mutationFn: Loginuser,
              onSucess:()=>{
            console.log("User logged in successfully");
        },
        
      
        onError:(err)=>{
            console.error(err);
        }
    }
    )
    )
   
  
}
