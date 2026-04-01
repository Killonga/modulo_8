import { Router } from "express";
import { login, register } from "../controllers/auth.controllers.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
// router.get("/login", (req, res) => {
//   res.sendFile(path.join(process.cwd(), "public/login.html"));
// });

router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ mensaje: "Logout exitoso" });
});

export default router;
