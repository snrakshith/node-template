/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { decode } from "jsonwebtoken";
import { StatusCodes, getReasonPhrase } from "http-status-codes";

import ErrorResponse from "../utils/ErrorResponse";
import asyncHandler from "./async";
import { resError } from "../utils/response";

/**
 * @deprecated Not in use, instead use "protect method"
 */
// Check if token is passed with user request
export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization || req.headers.authorization === null) {
      return resError(
        res,
        StatusCodes.UNAUTHORIZED,
        getReasonPhrase(StatusCodes.UNAUTHORIZED) + ", " + "Token is missing"
      );
    }

    next();
  }
);

// Protect routes
export const checkBearerToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Set token from Bearer token in header
      token = req.headers.authorization.split(" ")[1];
    }

    // Make sure token exists
    if (!token) {
      return resError(
        res,
        StatusCodes.UNAUTHORIZED,
        getReasonPhrase(StatusCodes.UNAUTHORIZED) + ", " + "Token is missing"
      );
    }

    try {
      next();
    } catch (err) {
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );
    }
  }
);

// Grant access to specific roles
export const authorize = (userRole: string) => {
  return (req: any, res: Response, next: NextFunction) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Set token from Bearer token in header
      token = req.headers.authorization.split(" ")[1];
    }

    const decodedTokenData = decode(token);
    const convertTokenToString = JSON.stringify(decodedTokenData);
    const tokenToJson = JSON.parse(convertTokenToString);
    const checkRole = tokenToJson?.userRole?.includes(userRole);

    try {
      if (checkRole) {
        next();
      } else {
        return resError(
          res,
          401,
          `${userRole?.toUpperCase()}, not authorized to access this route`
        );
      }
    } catch (err) {
      resError(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Something went wrong!..`
      );
    }
  };
};
