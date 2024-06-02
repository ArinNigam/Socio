import jwt from "jsonwebtoken";

export const authenticationMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({ msg: "Access Denied" });
    }

    const token = authHeader.split(" ")[1]; // object : {Bearer, token}
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ msg: "Not authorized to access this route" });
  }
};
