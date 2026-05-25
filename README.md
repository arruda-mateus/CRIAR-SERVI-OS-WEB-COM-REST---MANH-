# VIGIA JURÍDICO

## Integrantes do grupo

- Renan Demétrio
- Mateus Arruda
- Luiz Felipe Guimarães
- Samuel de Sousa Pedrosa

## Descrição da ideia do sistema

O **VIGIA JURÍDICO** é uma plataforma criada para evitar golpes em que criminosos se passam por advogados por telefone ou mensagens. Como muitos processos possuem informações públicas, golpistas podem tentar enganar clientes fingindo representar um advogado.

A proposta do sistema é centralizar a comunicação entre cliente e advogado dentro de uma plataforma própria, com cadastro de clientes, cadastro de advogados, validação de OAB, listagem de profissionais e solicitações de atendimento. O cliente pode descrever seu problema e o sistema simula uma indicação de área jurídica para ajudar na escolha do advogado.

## Tecnologias utilizadas

### Frontend

- React
- JavaScript
- React Router
- CSS3
- Vite

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Dotenv
- CORS

## Telas desenvolvidas

### Tela inicial

Apresenta o sistema, explica o problema dos golpes jurídicos e mostra botões para cadastro e login.

### Tela de login

Permite que cliente ou advogado acesse a plataforma com e-mail e senha.

### Tela de cadastro

Permite criar conta como cliente ou advogado. Quando o usuário escolhe advogado, aparecem campos específicos como OAB, área de atuação, cidade, estado e descrição profissional.

### Área do cliente

Mostra advogados cadastrados, filtro por área de atuação, simulação de recomendação jurídica e criação de solicitação de atendimento.

### Área do advogado

Mostra perfil profissional, solicitações recebidas e opção para atualizar status das solicitações.

## Organização das pastas

```txt
vigia-juridico/
├── backend/
│   ├── src/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── api.js
│   │   ├── App.jsx        # componente principal, equivalente ao App.js
│   │   ├── auth.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## Instruções para rodar o projeto

### 1. Verificar o MongoDB

Abra o MongoDB Compass e conecte em:

```txt
mongodb://127.0.0.1:27017
```

O banco `vigia-juridico` será criado automaticamente quando algum cadastro for salvo.

### 2. Rodar o backend

Abra um terminal na pasta do projeto e execute:

```bash
cd backend
npm install
npm run dev
```

O backend roda em:

```txt
http://localhost:3000
```

### 3. Rodar o frontend

Abra outro terminal na pasta do projeto e execute:

```bash
cd frontend
npm install
npm run dev
```

O frontend roda em:

```txt
http://localhost:5173
```

## Onde os dados ficam salvos

No MongoDB Compass, depois de cadastrar clientes ou advogados, clique em **Refresh** e procure:

```txt
localhost:27017
└── vigia-juridico
    ├── users
    └── solicitacaos
```

A collection `users` guarda clientes e advogados. O campo `tipo` diferencia cada usuário:

```txt
tipo: cliente
tipo: advogado
```

## Observação

Este projeto foi feito como base visual e funcional inicial. O App.jsx e o index.css foram mantidos resumidos para facilitar a explicação em sala. As telas simulam o funcionamento de uma plataforma real e o backend permite cadastrar, fazer login, listar advogados e criar solicitações de atendimento.
