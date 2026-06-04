import { Request, Response, NextFunction } from "express";
import * as authService from '../services/auth-service';
import { deleteUserAccount } from '../services/auth-service';
import jwt from 'jsonwebtoken'; 
import bcrypt from 'bcrypt';
import prisma from "../database/prisma";

// Middleware para verificar o token de autenticação JWT nas requisições
export const checkAuthToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Token de acesso não fornecido" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        
        (req as any).user = decoded; 
        
        next(); 
    } catch (error) {
        return res.status(401).json({ error: "Token inválido ou expirado" });
    }
};

// Cadastro (Sign Up) de Usuário
export const register = async (req: Request, res: Response) => { 
    try {
        const newUser = await authService.registerUser(req.body);

        return res.status(201).json({
            message: "Bem vindo " + newUser.name,
            user: { id: newUser.id, name: newUser.name, email: newUser.email }
        });
    } catch (error: any) {
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        return res.status(500).json({ error: "Erro interno no servidor" });
    }
}; 

// Login tradicional com E-mail e Senha
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                authenticated: false,
                error: "Preencha todos os campos obrigatórios",
            });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !user.password) {
            return res.status(401).json({
                authenticated: false,
                error: "E-mail ou senha inválidos"
            });
        }

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
            return res.status(401).json({
                authenticated: false,
                error: "E-mail ou senha inválidos"
            });
        }

        return res.status(200).json({
            authenticated: true,
            message: "Login realizado com sucesso",
            redirect: "home",
            session: {
                active: true,
            },
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        return res.status(500).json({
            authenticated: false,
            error: "Erro interno no servidor",
        });
    }
};

// Autenticação com o SSO Google
export const googleAuth = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;
        
        const user = await authService.authenticateGoogleUser(token, req.body);

        return res.status(200).json({
            authenticated: true,
            message: "Bem vindo " + user.name,
            redirect: "home",
            session: {
                active: true,
            },
            user: { id: user.id, name: user.name, email: user.email }
        });

    } catch (error: any) {
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        return res.status(500).json({ error: "Erro interno no servidor" });
    }
};

// Exclusão de conta de usuário (Delete Account)
export const deleteMe = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const userId = (req as any).user.id; 
        const targetUserId = req.params.id;

        if (targetUserId && targetUserId !== userId) {
            return res.status(403).json({ error: "Você não tem permissão para realizar esta ação" });
        }

        await deleteUserAccount(userId);
        
        return res.status(204).send();
        
    } catch (error: any) {
        if (error.message === 'Usuário não encontrado.') {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Erro interno no servidor ao tentar excluir conta.' });
    }
};