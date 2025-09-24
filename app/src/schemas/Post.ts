import { z } from "zod";

export const postSchema = z.object({
    titulo: z.string().min(1, "Título é obrigatório"),
    conteudo: z.string().min(1, "Conteúdo é obrigatório"),
    autor: z.string().min(1, "Autor é obrigatório"),
    thumbnail: z.string().optional()
});

export const partialPostSchema = postSchema.partial();