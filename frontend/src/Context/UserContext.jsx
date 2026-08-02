import React, { createContext, useContext } from 'react'
import axios from 'axios'
axios.defaults.withCredentials = true
import toast, { Toaster } from 'react-hot-toast';
import router from '../routes/router';
const UserContext = createContext()
const USER_API_BASE_URL = 'https://musora-app-production.up.railway.app/api/users'

export const UserProvider = ({ children }) => {
    const Registeruser = async (data) => {
        try {
            const res = await axios.post(`${USER_API_BASE_URL}/register`, { name: data.name, email: data.email, password: data.password })
            toast.success(res?.data?.message || "Registration successful");
            router.navigate({to:"/"}) 
        }
        catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Registration failed");
        }
    }
    const Loginuser = async (data) => {
        try {
            const res = await axios.post(`${USER_API_BASE_URL}/login`, { email: data.email, password: data.password })
            toast.success(res?.data?.message || "Login successful");
            router.navigate({to:"/"}) 
            
        
        }
        catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Login failed");
        }
    }
const getUser = async () => {
    try {
        const res = await axios.get(
            `${USER_API_BASE_URL}/getuser`,
            { withCredentials: true }
        );

        return res.data?.message || null;
    } catch (err) {
        console.error(err);
        throw err; // 🔥 never return undefined
    }
};
const getAllUsers = async () => {
    try {
        const res = await axios.get(
            `${USER_API_BASE_URL}/getallusers`,
            { withCredentials: true }
        );
         return res.data?.message || [];}
        catch (err) {
        console.error(err);
        throw err; // 🔥 never return undefined
    }
}
async function GetSingleUser(Id){
    try {
        const res = await axios.get(
            `${USER_API_BASE_URL}/getuser/${Id}`,
            { withCredentials: true }
        );
        return res.data?.message || null;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const EditProfile=async(formdata)=>{
    
    try {
console.log("data"+formdata);

        const res = await axios.put(
            `${USER_API_BASE_URL}/update-profile`,formdata,
            { withCredentials: true }
        );
        
        toast.success(res?.data?.message || "Profile updated successfully");
        return res.data?.message || null;
    } catch (err) {
        console.error(err);
        toast.error(err?.response?.data?.message || "Failed to update profile");
        throw err;
    }
}
const getUserProfile=async()=>{
    try {
        const res = await axios.get(`${USER_API_BASE_URL}/loginUser`, { withCredentials: true });
        return res.data?.message || null;
    } catch (err) {
        console.error(err);
        throw err;
    }
}
const FollowUser=async(Id)=>{
    console.log("follow "+Id);
    
    try {
        const res = await axios.post(`${USER_API_BASE_URL}/follow`, {  Followinguser:Id }, { withCredentials: true });
        return res || null;
    } catch (err) {
        console.error(err);
        toast.error(err?.response?.data?.message || "Action failed");
        throw err;
    }   
}

const LogoutUser=async()=>{
    try {
        const res = await axios.post(`${USER_API_BASE_URL}/logout`, {}, { withCredentials: true });
        toast.success(res?.data?.message || "Logout successful");
        return res || null;
    } catch (err) {
        console.error(err);
        toast.error(err?.response?.data?.message || "Logout failed");
        throw err;
    }
}

return (
    <UserContext.Provider value={{ Registeruser, Loginuser, LogoutUser, getUser, getAllUsers, GetSingleUser, getUserProfile, EditProfile, FollowUser }}>
        {children}
        <Toaster
            position="top-center"
            reverseOrder={false}
        />
    </UserContext.Provider>
)

}

// eslint-disable-next-line react-refresh/only-export-components
export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within UserContextProvider");
    }
    return context;
};
