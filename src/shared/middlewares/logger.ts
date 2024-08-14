/* eslint-disable @typescript-eslint/no-explicit-any */
// Middleware goes in here..

export const logger = async (req: any, res: any, next: () => void) => {
  console.log("Executed middleware");
  next();
};
