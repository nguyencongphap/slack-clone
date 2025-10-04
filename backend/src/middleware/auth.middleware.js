export const protectRoute = (req, res, next) => {
  // If user is not authenticated by Clerk (req.auth is of Clerk), we return resp immediately
  if (!req.auth().isAuthenticated) {
    return res
      .status(401)
      .json({ message: "Unauthorized - you must be logged in" });
  }

  next(); // proceed to executing the endpoint
};
