const jwt = require('jsonwebtoken');

module.exports = (req,resp,next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token,'Now_is_the_time_for_all_good_men_to_come_to_the_aid_of_their_party'); // will throw error if token not valid
        next();
    }
    catch(error) {
        resp.status(401).json({message: 'Error getting authentication token'})
    }

}
