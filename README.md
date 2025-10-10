# Desafio Prático - Desenvolvedor Full-stack

Esta é uma aplicação web full-stack desenvolvida como parte do processo seletivo. O sistema gerencia dados de infraestrutura escolar, permitindo a importação de dados via CSV e a manipulação completa (CRUD) dos registros através de uma interface web. devido ao tempo foi feito o parse do csv do dicionario do dataset, utilizando seus dados para criar a propria tabela para a inserçao dos dados, tornando o projeto mais intuitivo no tempo dado, e fazendo a limpeza e possiveis correçao dos dados (colunas duplicadas e outros). 

---

## Tecnologias utilizadas

#### **Backend**
* **Ambiente de Execução:** Node.js
* **Framework:** Express.js
* **Banco de Dados:** MySQL com o driver `mysql2` (suporte a Promises)
* **Manipulação de Arquivos:** `Multer` para upload e `csv-parser` para leitura de CSV.
* **Outros:** `cors` para política de recursos, `nodemon` para desenvolvimento.

#### **Frontend**
* **Biblioteca:** React
* **Build Tool:** Vite
* **Roteamento:** React Router DOM
* **UI Components:** React Modal

---

## Instruções para execução local

Para executar este projeto, é necessário ter **Node.js (v18+)** e **MySQL Server** instalados em um ambiente **WSL (Windows Subsystem for Linux)**.

#### **1. Preparação do Ambiente**

a. **Clone o repositório:**
```bash
git clone https://github.com/neo-Angelo/fullstack_crud.git
```

b. **Instale as dependências do Backend:**
```bash
cd backend
npm install
```

c. **Instale as dependências do Frontend:**
* Em um novo terminal, navegue até a pasta do frontend:
```bash
cd frontend
npm install
```

#### **2. Configuração do Banco de Dados**

a. **Inicie o serviço do MySQL no WSL:**
```bash
sudo service mysql start
```

b. **Crie a base de dados:**
* Faça login no MySQL como root (será solicitada a senha que você configurou na instalação):
```bash
sudo mysql -u root -p
```
* Dentro do console MySQL, execute o comando:
```sql
CREATE DATABASE IF NOT EXISTS escolas;
EXIT;
```
c. **Crie o usuário da aplicação:**
* Ainda dentro do console MySQL, execute os comandos abaixo para criar o usuário `admin` com a senha `admin` e dar a ele as permissões necessárias.
```sql
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin';
GRANT ALL PRIVILEGES ON escolas.* TO 'admin'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```
*Este é o usuário que a aplicação backend usará para se conectar ao banco de dados, necessario para utilizar a aplicacao, voce pode mudar tambem no codigo o nome e senha do mesmo.*


#### **3. Execução da Aplicação**

*Você precisará de dois terminais abertos para rodar a aplicação.*

a. **Inicie o servidor Backend:**
* No terminal da pasta `backend`, execute:
```bash
nodemon app.js ou node app.js
```
* O servidor estará disponível em `http://localhost:3000`.

b. **Inicie o servidor Frontend:**
* No terminal da pasta `frontend`, execute:
```bash
npm run dev
```
* A aplicação estará disponível em `http://localhost:5173`.

---

## Instruções para uso do sistema

Após a aplicação ser iniciada, siga os passos abaixo para operar o sistema:

1.  **Criar a Tabela de Dados:**
    * Antes de usar a aplicação, é necessário criar a tabela principal. Com o servidor backend rodando, abra seu navegador e acesse a seguinte URL:
    `http://localhost:3000/criar-tabela`
    * Aguarde a mensagem de sucesso. A tabela `escolas_dependencias` será criada no banco de dados.

2.  **Importar os Dados:**
    * Acesse a aplicação em `http://localhost:5173`.
    * No menu de navegação no topo, clique em **"Upload de CSV"**.
    * Use o seletor de arquivos para escolher o arquivo `Escola_Dependencias_062025.csv`.
    * Clique em "Enviar" e aguarde a conclusão da importação.

3.  **Gerenciar os Dados (CRUD):**
    * No menu de navegação, clique em **"Ver Dados (CRUD)"**.
    * A página exibirá uma tabela com os dados importados.
    * **Visualizar Detalhes:** Clique no botão "Detalhes" em qualquer linha para ver todas as informações daquele registro.
    * **Excluir:** Clique no botão "Excluir" para remover um registro (uma confirmação será solicitada).
    * **Adicionar:** Clique no botão "Adicionar Novo" no topo da página para abrir um formulário e criar um novo registro.
    * **Editar:** Clique no botão "Editar" em qualquer linha para abrir um formulário preenchido e alterar os dados daquele registro.

<img width="1902" height="946" alt="Image" src="https://github.com/user-attachments/assets/2895bb99-650a-4fc0-8db6-4adf65dfa7e0" />
