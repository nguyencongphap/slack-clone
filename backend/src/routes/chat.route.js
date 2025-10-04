import express from "express";
import { getStreamToken } from "../controllers/chat.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Our endpoints. the path in these endpoints will be appended to the path where we use this router
// protectRoute is the middleware we make to make this endpoint more secure
router.get("/token", protectRoute, getStreamToken);

export default router;
