import { db } from '../db.js';
import bcrypt from 'bcrypt';

// Controlador para registrar un nuevo usuario
export const registerUser = async (req, res) => {
    try {
        console.log('Body recibido en registro:', req.body);
        const { username, email, password, first_name, last_name } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        // Verificar si el email ya existe
        const existingUser = await db.execute({
            sql: 'SELECT * FROM users WHERE email = :email OR username = :username',
            args: { email: email, username: username }
        });
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: 'El email o usuario ya está registrado' });
        }

        // Debug: Verificar la estructura de la tabla users
        const tableInfo = await db.execute('PRAGMA table_info(users)');
        console.log('Estructura de la tabla users:', tableInfo.rows);

        // Hashear la contraseña
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // Logging de valores antes de insertar
        console.log('Valores para insertar:', {
            username,
            email,
            password_hash: password_hash ? 'HASHEADA' : 'VACIA',
            first_name: first_name || null,
            last_name: last_name || null
        });

        // Insertar el nuevo usuario usando parámetros nombrados
        const result = await db.execute({
            sql: `INSERT INTO users (username, email, password_hash, first_name, last_name) VALUES (:username, :email, :password_hash, :first_name, :last_name)`,
            args: {
                username: username,
                email: email,
                password_hash: password_hash,
                first_name: first_name || null,
                last_name: last_name || null
            }
        });
        
        console.log('Insert result:', result);

        return res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error en registro:', error);
        console.error('Stack completo:', error.stack);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Controlador para login de usuario
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        const userResult = await db.execute({
            sql: 'SELECT * FROM users WHERE email = :email',
            args: { email: email }
        });
        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        const user = userResult.rows[0];
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        req.session.user = { id: user.id, username: user.username, email: user.email };
        return res.json({ message: 'Inicio de sesión exitoso', user: req.session.user });
    } catch (error) {
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Controlador para logout de usuario
export const logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'No se pudo cerrar sesión' });
        }
        res.clearCookie('connect.sid');
        return res.json({ message: 'Sesión cerrada correctamente' });
    });
};
