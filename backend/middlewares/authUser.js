// import jwt from 'jsonwebtoken'

// //user authentication middleware
// const authUser= async(req,res,next)=>{
//     try{
        
//         const{token}= req.headers
//         if(!token){
//             return res.json({success:false,message:'Not Authorised Login Again'})
//         }
//         const token_decode=jwt.verify(token,process.env.JWT_SECRET)
//         req.body.userId = token_decode.id
//         next()

//     }catch(error){
//         console.log(error)
//         res.json({success:false,message:error.message})
//     }

    
// }

// export default authUser

import jwt from 'jsonwebtoken'

// user authentication middleware
const authUser = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.json({ success: false, message: 'Not Authorised. Login Again' });
        }

        const token = authHeader.split(" ")[1];
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        // Attach to req.user instead of req.body
        req.user = { userId: token_decode.id };

        next();

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export default authUser;


