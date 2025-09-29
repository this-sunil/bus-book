import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    const authorization = req.header.authorization;
    if (!authorization || !authorization.startWith("Bearer ")) {
      return res.status(404).json({
        status: false,
        msg: "Missing Token !!!"
      });
    }
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY, {
      algorithms: ["HS256"]
    });
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(500).json({
      status: false,
      msg: "Invalid Expired Token !!!"
    });
  }
};

export const generateToken = async (user) => {
  const payload = {
    role: user.role
  };
  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    algorithm: "HS256",
    expiresIn: "30m"
  });
  return token;
};
