import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized, please login again" });
  }
};

export default protect;