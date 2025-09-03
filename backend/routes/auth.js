import express from "express";
import session from "express-session";
import {
    registerUser,
    loginUser,
    logoutUser,
    checkAuth,
} from "../controllers/authController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// Verificar estado de autenticación (sin middleware - accesible siempre)
router.get("/check", checkAuth);
// Registro
router.post("/register", registerUser);
// Login
router.post("/login", loginUser);
// Logout
router.post("/logout", logoutUser);

// Ruta protegida para obtener perfil del usuario
router.get("/profile", isAuthenticated, (req, res) => {
    res.json({ user: req.session.user });
});

export default router;
