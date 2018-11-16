const jwt = require('jsonwebtoken');

module.exports = (req,resp,next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token,'Now_is_the_time_for_all_good_men_to_come_to_the_aid_of_their_party'); // will throw error if token not valid
        req.userData = { email: decodedToken.email, userId: decodedToken.userId};
        next();
    }
    catch(error) {
        resp.status(401).json({message: 'You are not authenticated'})
    }

}
