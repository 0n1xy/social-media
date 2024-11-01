import { startChat } from "@/controllers/EJS_Controller";

import { Router } from "express";

const router = Router();

router.get("/chat", startChat);

export default router;
