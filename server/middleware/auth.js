const jwt = require("jsonwebtoken");

const auth= (req, res, next) => {
    const authHeader = req.headers["authorization"];

    //No token
    if (!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        if(err){
            return res.status(403).json({ message: "Invalid Token"});
        }

        req.user = decodedUser;
        next();
    });
};

module.exports = auth;