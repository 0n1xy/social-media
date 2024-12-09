import { home, notification, startChat } from "@/controllers/EJS_Controller";

import { Router } from "express";

const router = Router();

router.get("/chat", startChat);
router.get("/notification", notification);
router.get("/", home);
export default router;
