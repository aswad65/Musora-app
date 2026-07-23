import jwt from "jsonwebtoken";
const IsAUTh=(req,res,next)=>{
  try{  
     const token = req.cookies?.token

     
    if(!token){
        return res.status(401).json({ message: "Unauthorized , please login first" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token Expired , please login again" });
        }
        req.user = user;
        next();
    });}
    catch(err){
        console.error(err);
        res.status(500).json({ message: err.message });
    }
}
export default IsAUTh;