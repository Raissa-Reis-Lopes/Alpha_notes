
# Use uma imagem base do Node.js
FROM node:18

# Cria o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copia o arquivo package.json e package-lock.json
COPY package*.json ./

# Instala todas as dependências, incluindo as de desenvolvimento
RUN npm install

# Copia o código da aplicação para dentro do contêiner
COPY . .

# Executa o build do TypeScript
RUN npm run build

# Usa o nodemon para monitorar mudanças no código durante o desenvolvimento
CMD ["npx", "nodemon", "--exec", "npx ts-node", "src/index.ts"]


# # Use uma imagem base do Node.js
# FROM node:18

# # Cria o diretório de trabalho dentro do contêiner
# WORKDIR /usr/src/app

# # Copia o arquivo package.json e package-lock.json
# COPY package*.json ./

# # Instala todas as dependências, incluindo as de desenvolvimento
# RUN npm install

# # Copia o código da aplicação para dentro do contêiner
# COPY . .

# # Executa o build do TypeScript
# RUN npm run build

# # Usa o nodemon para monitorar mudanças no código durante o desenvolvimento
# CMD ["nodemon", "--exec", "ts-node", "src/index.ts"]