import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(`./environments/.env.${process.env.NODE_ENV}`),
});

export function signAccessToken(userId: any, userRole: string) {
  return new Promise((resolve, reject) => {
    const payload = {
      userRole,
    };
    const secret = process.env.ACCESS_TOKEN_SECRET as string;
    const options = {
      expiresIn: "15m",
      issuer: "recanteur",
      audience: userId,
    };

    jwt.sign(payload, secret, options, (error, token) => {
      if (error) {
        console.log(error.message);
        return reject("Internal Server Error");
      }
      resolve(token);
    });
  });
}

export function signRefreshToken(userId: string, userRole: string) {
  return new Promise((resolve, reject) => {
    const payload = { userRole };
    const secret = process.env.REFRESH_TOKEN_SECRET as string;
    const options = {
      expiresIn: "5h",
      issuer: "recanteur",
      audience: userId,
    };

    jwt.sign(payload, secret, options, (error, token) => {
      if (error) {
        console.log(error.message);
        return reject("Internal Server Error");
      }
      resolve(token);
    });
  });
}

export function verifyAccessToken(req: any, res: any, next: any) {
  if (!req.headers["authorization"])
    return next(
      res.status(401).json({
        status: false,
        message: "Unauthorized",
      })
    );

  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (error: any, payload: any) => {
      if (error) {
        return next(
          res.status(401).json({
            status: false,
            message: "Unauthorized",
          })
        );

        // const message =
        //   error.name === "JsonWebTokenError" ? "Unauthorized" : error.message;
        // return next(message);
      }
      req.payload = payload;
      next();
    }
  );
}

export function verifyRefreshToken(refreshToken: string) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
      (error, payload: any) => {
        if (error) return reject({ message: error.message });

        resolve(payload);
      }
    );
  });
}
