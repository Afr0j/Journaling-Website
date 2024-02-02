import jwt from "jsonwebtoken"
const verifyToken = (req, res, next) => {
  
    const accessToken = req.cookies.accessToken|| req.headers.Authorization;
    if (!accessToken) {
      return res.status(401).redirect("/user/login");
    }
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY); 
      req.user = decoded;
       
    } catch (error) {
      console.log(error);
      res.status(401).redirect("/user/login");
    }
    // console.log("verified");
    next();
}

export {verifyToken}