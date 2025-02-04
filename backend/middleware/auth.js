const jwt = require("jsonwebtoken")

module.exports = function (req, res, next) {
    const token = req.header("x-auth-token");
    if (!token) {
        return res.status(401).json({msg: "No token, unauthorized access"});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({msg: "Invalid token"});
    }
};