import { connectDB, sql } from "../database/db.js";

export const userservice = async (name, email, password) => {
    const pool = await connectDB();

try {
   const result = await pool.request()
        .input("name", sql.VarChar(100), name)
        .input("email", sql.VarChar(150), email)
        .input("password", sql.VarChar(255), password)
        .execute("RegisterUser");

    return result.recordset[0].UserId

} catch (error) {
    if (error.number === 2627) {
        throw new Error("Email already exists");
    }
    throw error;
}

};

export const userLoginService = async (email) => {
    const pool = await connectDB();

try {
   const result = await pool.request()
        .input("email", sql.VarChar(150), email)
        .execute('Login');

    return result.recordset[0];  

} catch (error) {
    if (error.number === 2627) {
        throw new Error("Email already exists");
    }
    throw error;
}

};
export const Getuser=async()=>{
    const pool = await connectDB();
    const result=await pool.request().execute("GetUsersbyId")
    return result.recordset
}
export const GetUserById=async(userId)=>{
    const pool = await connectDB();
    const result=await pool.request().input("userId", sql.Int, userId).execute("GetuserbyId");
    return result.recordset[0] || null;
}
export const followandUnfollow=async(FollowingId,UserId)=>{
    const pool = await connectDB();
    const result =await pool.request().input("FollowingId", sql.Int, FollowingId).input("UserId", sql.Int, UserId).execute("FollowUser");
    return result.recordsets;
}
export const GetAllUsers=async()=>{
    const pool = await connectDB();
    const result=await pool.request().execute("GetAllUsers")
    return result.recordset
}


export const UpdateUserProfile=async(userId,Name,UserPic)=>{
    console.log(Name);
    console.log(UserPic);
    
    
    const pool = await connectDB();
    const result=await pool.request().input("userId", sql.Int, userId).input("Name", sql.VarChar(100), Name).input("profile_pic", sql.VarChar(255), UserPic).execute("UpdateUserProfile")
    return result.recordset
}
export const loginUserData=async(userId)=>{
    const pool = await connectDB();
    const result=await pool.request().input("userId", sql.Int, userId).execute("GetUserProfileData")
    return result.recordset[0]
}