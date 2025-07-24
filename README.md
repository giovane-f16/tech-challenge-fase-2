# Tech Challenge Fase 2

API Feita em NodeJS + Typescript com os recursos de:
- Criação de Posts
- Listagem de Posts
- Edição de Posts
- Exclusão de Posts

Para visualização completa, o projeto está integrado com o [Swagger](https://swagger.io/) a fim de facilitar a compreensão.

## Persistência de dados
O projeto utiliza o SaaS [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) para persistência dos dados.


## Guia de uso
1. Clone o projeto

`git clone https://github.com/giovane-f16/tech-challenge-fase-2.git`

2. Configure o arquivo **.env** utilizando como base o **[.env-example](./app/.env.example)**.

É necessário criar um banco no mongo DB Atlas e um token JWT.

3. Suba o container

`docker compose up --build -d`