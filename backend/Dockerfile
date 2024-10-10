# Use uma imagem base do Node.js
FROM node:18

# Cria o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copia o arquivo package.json e package-lock.json
COPY package*.json ./

# Instala apenas as dependências de produção
RUN npm install --production

# Copia o código da aplicação para dentro do contêiner
COPY . .

# Executa o build do TypeScript
RUN npm run build

# Define o comando para iniciar o aplicativo
CMD ["node", "dist/index.js"]
