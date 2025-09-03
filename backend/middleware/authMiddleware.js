// Middleware para proteger rutas que requieren autenticación
export const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        // Establecer req.user para que esté disponible en los controladores
        req.user = req.session.user;
        return next();
    }
    return res.status(401).json({ error: "No autenticado" });
};
