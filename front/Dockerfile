# Stage 1: Build Angular app
FROM node:20-alpine AS build

WORKDIR /app
COPY front/package*.json ./
RUN npm ci
COPY front/ ./
COPY data/ ./src/assets/data

RUN echo "🛠️ Vérification de /src/assets/data :" && ls -al ./src/assets/data || echo "❌ Dossier introuvable"
RUN npm run build:prod || (echo '❌ Build Angular échoué' && exit 1)
#RUN npm run build:prod


# Stage 2: Serve avec NGINX
FROM nginx:alpine
COPY front/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build app/dist/front/browser /usr/share/nginx/html

EXPOSE 80
