# Stage 1: Build Angular app
FROM node:20-alpine AS build

WORKDIR /app
COPY front/package*.json ./
RUN npm ci
COPY front/ ./
COPY data ./src/assets/data
RUN npm run build --prod

# Stage 2: Serve with NGINX
FROM nginx:alpine
COPY front/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY front/nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/dist/front/browser /usr/share/nginx/html

EXPOSE 80




