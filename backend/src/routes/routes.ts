import { Router } from 'express';
import { register, login, googleAuth, deleteMe, checkAuthToken } from '../controllers/authController';

const router = Router();

// Rotas de Autenticação
router.post('/register', register);
router.post('/login', login);
router.post('/auth/google', googleAuth);

// Rotas de Usuário (Exclusão)
router.delete('/users/me', checkAuthToken, deleteMe);
router.delete('/users/:id', checkAuthToken, deleteMe);

export default router;