import { PrismaClient } from "../generated/prisma";

// Instancia o cliente do Prisma
export const prisma = new PrismaClient();

// Exporta por padrão para compatibilidade com outros arquivos do projeto
export default prisma;
