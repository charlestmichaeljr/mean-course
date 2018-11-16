const jwt = require('jsonwebtoken');

module.exports = (req,resp,next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token,process.env.JWT_KEY,); // will throw error if token not valid
        req.userData = { email: decodedToken.email, userId: decodedToken.userId};
        next();
    }
    catch(error) {
        resp.status(401).json({message: 'You are not authenticated'})
    }

}
