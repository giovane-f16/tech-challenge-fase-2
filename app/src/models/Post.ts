export interface Post {
	id: number;
	titulo: string;
	conteudo: string;
	autor: string;
	dataDeCriacao: string;
	dataDeAtualizacao?: string;
}
