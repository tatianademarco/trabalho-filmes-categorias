# Sistema Web de Gerenciamento de Filmes e Categorias

Este é um site para gerenciamento de filmes e categorias, desenvolvido utilizando HTML, CSS e Java Script e bibliotecas de estlização para uma interface dinâmica e responsiva e utilizando o framework Spring Boot para o backend. A API é documentada com Swagger e permite operações CRUD completas em filmes e categorias.

## Visão Geral

Este projeto tem como objetivo fornecer uma interface intuitiva para o gerenciamento de filmes e suas respectivas categorias, com suporte a operações de upload de imagens, pesquisa e classificação.

![DiagramaTrabalhoWeb](https://github.com/tatianademarco/Site-Filmes-Categorias/assets/113955857/9a81140d-e475-4826-9709-21fd69aadacb)

## Funcionalidades

- **CRUD de Filmes**: Criação, leitura, atualização e exclusão de filmes.
- **CRUD de Categorias**: Criação, leitura, atualização e exclusão de categorias.
- **Upload de Imagens**: Suporte a upload de imagens de filmes.
- **Pesquisa**: Pesquisa de filmes por nome.
- **Documentação**: API documentada com Swagger.

## Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas:

- [Git](https://git-scm.com/)
- [Java JDK 11+](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
- [Maven](https://maven.apache.org/)
- [Node.js e npm](https://nodejs.org/en/)
- [MySQL](https://www.mysql.com/)

## Instalação

### Clonando o Repositório

Clone o repositório para sua máquina local:

```bash
git clone https://github.com/tatianademarco/trabalho-filmes-categorias.git
```

Navegue até o diretório do backend:
```
cd backend
```

Construa o projeto com Maven:
```
mvn clean install
```
Crie um banco de dados MySQL e atualize o arquivo application.properties no diretório src/main/resources com suas credenciais:
```
spring.datasource.url=jdbc:mysql://localhost:3306/nome_do_seu_banco
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
spring.jpa.hibernate.ddl-auto=update
```
Execute o servidor Spring Boot:
```
mvn spring-boot:run
```
O backend deve estar rodando em http://localhost:8080

Agora vá para o frontend:
```
cd frontend
```
Instale as dependências e inicialize um servidor web simples usando o módulo http-server:
```
npm install -g http-server
```
Depois de instalado, execute o servidor dentro do diretório do seu projeto:
```
http-server
```
Para executar os testes:
```
mvn test
```
