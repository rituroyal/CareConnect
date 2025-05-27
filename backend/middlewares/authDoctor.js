

import jwt from 'jsonwebtoken'

// doctor authentication middleware
const authDoctor = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.json({ success: false, message: 'Not Authorised. Login Again' });
        }
        const dToken = authHeader.split(' ')[1]; // Get token after 'Bearer '
        // Verify the token
        const token_decode = jwt.verify(dToken, process.env.JWT_SECRET);
        req.docId = token_decode.id; // Attach doctor ID to request object
        next();

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export default authDoctor;