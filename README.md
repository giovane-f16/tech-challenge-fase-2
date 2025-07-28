# Tech Challenge Fase 2

API RESTful desenvolvida com **Node.js** e **TypeScript**, com os seguintes recursos:
- Criar de Posts
- Listar de Posts
- Editar de Posts
- Excluir de Posts

Para visualização completa, o projeto está integrado com o [Swagger](https://swagger.io/) a fim de facilitar a visualização e testes dos endpoints.

## Link de produção

A aplicação está disponível em:
[https://tech-challenge-fase-2-54i9.onrender.com/](https://tech-challenge-fase-2-54i9.onrender.com/)

## Persistência de dados
O projeto utiliza o [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) para armazenar os dados.


## Requisitos
1. Docker e Docker compose

> https://www.docker.com/

2. Instância no MongoDB Atlas

> https://www.mongodb.com/products/platform/atlas-database

3. Token JWT

> https://www.jwt.io/


## Como usar
1. Clone o projeto

```bash
git clone https://github.com/giovane-f16/tech-challenge-fase-2.git
```

2. Configure o arquivo **.env** utilizando como base o **[.env-example](./app/.env.example)**.

3. Suba o container

```bash
docker compose up --build -d
```
A aplicação estará disponível no [http://localhost:3000/](http://localhost:3000/).