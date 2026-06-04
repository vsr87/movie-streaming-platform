import { Request, Response, NextFunction } from "express";
import * as authService from '../services/auth-service';
import { deleteUserAccount } from '../services/auth-service';
import jwt from 'jsonwebtoken'; 
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || "mock_client_id");

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

export const register = async (req: Request, res: Response) => { 
    try {
        const { name, email, password } = req.body;

        const newUser = await authService.registerUser({ name, email, password });

        return res.status(201).json({
            message: "Bem vindo " + newUser.name,
            user: { id: newUser.id, name: newUser.name, email: newUser.email }
        });

    } catch (error: any) {
        return res.status(error.status || 500).json({ error: error.message || "Erro interno" });
    }
};
export const googleLogin = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;

        // 1. O Controller manda o token e o req.body para o SERVICE fazer o trabalho pesado!
        const user = await authService.authenticateGoogleUser(token, req.body);

        // 2. Se deu tudo certo, o Controller apenas monta a resposta de sucesso
        return res.status(200).json({
            authenticated: true,
            message: "Bem vindo " + user.name,
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

    } catch (error: any) {
        // 3. Se o Service atirou um erro (throw { status: 400, message: "..." }), o Controller apanha aqui
        const statusCode = error.status || 500;
        const errorMessage = error.message || "Erro ao autenticar com o Google";

        return res.status(statusCode).json({
            authenticated: false,
            error: errorMessage,
        });
    }
};

export const deleteMe = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const userId = (req as any).user.id; 
        const targetUserId = req.params.id; // Verifica se tem algum ID na URL

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

