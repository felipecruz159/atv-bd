

3. # 🚀 Atividade Backend Node.js integrado ao Mongodb
>> Projeto criado na aula de Laboratório de Banco de Dados

## Intregantes
1. Marcos Felipe Cruz Beraldo
2. Rafael Gomes Fernandes

### 🎯Objetivo
A API de Jogadores tem como objetivo gerenciar informações sobre jogadores de Valorant. Ela fornece operações básicas, como criar, recuperar, atualizar e excluir informações sobre jogadores.A API de Jogadores tem como objetivo gerenciar informações sobre jogadores de eSports. Ela fornece operações básicas, como criar, recuperar, atualizar e excluir informações sobre jogadores.

## 📦Packages Utilizados
```
npm i express
npm i mongodb@4.2
npm i dotenv
npm i nodemon --dev
npm i express-validator
npm i bcryptjs
npm i jsonwebtoken
npm i cors
```

## 📝Função de cada um dos pacotes
<table><thead><tr><th>Pacote</th><th>Descrição</th></tr></thead><tbody><tr><td><code>express</code></td><td>Framework web rápido, flexível e minimalista para Node.js.</td></tr><tr><td><code>mongodb</code></td><td>Driver oficial do MongoDB para Node.js.</td></tr><tr><td><code>dotenv</code></td><td>Carrega variáveis ​​de ambiente do arquivo .env para o processo.env.</td></tr><tr><td><code>cors</code></td><td>Middleware que permite a comunicação entre diferentes domínios na web.</td></tr><tr><td><code>express-validator</code></td><td>Middleware para validação de dados de entrada em solicitações HTTP.</td></tr><tr><td><code>nodemon</code> (dev)</td><td>Ferramenta que monitora as alterações no código-fonte e reinicia automaticamente o servidor.</td></tr>
<tr>
<td><code>jsonwebtoken</code></td>
<td>Implementação do JWT em NodeJS </td>
</tr>
<tr>
<td><code>bcryptjs</code></td>
<td>Bcrypt é um algoritmo de geração de hashs para senhas </td>
</tr>
<tr>
<td><code>cors</code></td>
<td>Habilita o CORS Cross-Origin resource sharing</td>
</tr>
</tbody></table>

## ➡ Rotas e Funcionalidades
>> Listar Todos os Jogadores

Rota: GET /api/jogador<br>
Descrição: Retorna a lista de todos os jogadores cadastrados.<br>
Exemplo de Requisição HTTP:<br>

```
GET http://localhost:4000/api/jogador
Content-Type: application/json
Obter Jogador por ID
```
Rota: GET /api/jogadores/id/:id<br>
Descrição: Retorna as informações de um jogador específico com base no ID.<br>
Exemplo de Requisição HTTP:<br>
```
GET http://localhost:4000/api/jogadores/id/65148bd244ebc9a0839992c3
Content-Type: application/json
Obter Jogadores por Nome
```
Rota: GET /api/jogadores/nome/:nome<br>
Descrição: Retorna os jogadores cujo nome contenha a string especificada, realizando a busca de forma case-insensitive.<br>
Exemplo de Requisição HTTP:<br>
```
GET http://localhost:4000/api/jogadores/nome/santos
Content-Type: application/json
```
## Listar Jogadores Maiores de Idade<br>
Rota: GET /api/jogadores/maiores<br>
Descrição: Retorna a lista de jogadores cuja idade está entre 18 e 40 anos.<br>
Exemplo de Requisição HTTP:<br>
```
GET http://localhost:4000/api/jogadores/maiores
Content-Type: application/json
Excluir Jogador por ID
``````
Rota: DELETE /api/jogadores/:id<br>
Descrição: Exclui o jogador com base no ID fornecido.<br>
Exemplo de Requisição HTTP:<br>
```
DELETE http://localhost:4000/api/jogadores/65148ef27f51284f2df939f0
Content-Type: application/json
Inserir Novo Jogador
```
Rota: POST /api/jogadores<br>
Descrição: Insere um novo jogador no banco de dados.<br>
Exemplo de Requisição HTTP:<br>
```
POST http://localhost:4000/api/jogadores
Content-Type: application/json

{
    "nome": "Heitor Tomazela",
    "nacionalidade": "Brasileiro",
    "nick": "kct o inverso",
    "time": {
        "nome": "Oddik",
        "regiao": "BR"
    },
    "idade": 23
}
```
## Alterar Informações de um Jogador<br>
Rota: PUT /api/jogadores<br>
Descrição: Altera as informações de um jogador com base no ID fornecido.<br>
Exemplo de Requisição HTTP:<br>
```
PUT http://localhost:4000/api/jogadores
Content-Type: application/json

{
    "_id": "65148f057f51284f2df939f1",
    "nome": "Heitor Tomazela",
    "nacionalidade": "Brasileiro",
    "nick": "tck",
    "time": {
        "nome": "Oddik",
        "regiao": "BR"
    },
    "idade": 23
}
```
