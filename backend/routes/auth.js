import express from 'express';
import session from 'express-session';
import { registerUser, loginUser, logoutUser } from '../controllers/authController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

// Registro
router.post('/register', registerUser);
// Login
router.post('/login', loginUser);
// Logout
router.post('/logout', logoutUser);

// Ejemplo de ruta protegida
// router.get('/profile', isAuthenticated, (req, res) => {
//     res.json({ user: req.session.user });
// });

export default router;
