import jwt from "jsonwebtoken";

export const verifyToken = (req,res,next) => {
    const token = req.cookies.access_token;
   // console.log(token);
    if(!token){
        return res.status(403).json({msg : "Token not found"});
    }
    try{
        const user = jwt.verify(token,process.env.JWT_SECRET); // return an object -> user : { id,isAdmin};
        console.log(user);
        if(user){
            req.user = user;
            next();
        }
        else{
            return res.status(403).json({msg : "User not found"});
        }
    } catch(err){
        return res.status(403).json({msg:"Invalid token"});
    }
}

export const verifyUser = (req,res,next)=>{
    verifyToken(req,res,next, ()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        }
        else{
            return res.status(403).json({msg:"You are not Authorized"});
        }
    })
}

export const verifyAdmin = (req,res,next)=>{
    verifyToken(req,res,next, ()=>{
        if(req.user.isAdmin){
            next();
        }
        else{
            return res.status(403).json({msg:"You are not Authorized"});
        }
    })
}