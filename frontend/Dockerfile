# Etapa 1: Construir a aplicação
FROM node:18 AS build

# Criar um diretório para a aplicação
WORKDIR /usr/src/app

# Copiar os arquivos de package.json e package-lock.json
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar todo o código da aplicação para o diretório de trabalho
COPY . .

# Rodar o build do React (gera arquivos estáticos na pasta 'build')
RUN npm run build

# Etapa 2: Configurar o Nginx
FROM nginx:alpine

# Copiar os arquivos de build do React para o Nginx
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Copiar o arquivo de configuração do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor a porta em que o Nginx irá rodar
EXPOSE 80

# O Nginx já é o comando padrão na imagem
