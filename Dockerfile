FROM node:18 AS client

WORKDIR /app
COPY ./myblog-frontend .
RUN yarn
RUN npm run build



FROM node:18 AS admin

WORKDIR /app
COPY ./myblog-admin .
RUN yarn
RUN npm run build



FROM nginx:alpine

RUN mkdir -p /var/www/html/client
RUN mkdir -p /var/www/html/admin
COPY --from=client /app/dist /var/www/html/client
COPY --from=admin /app/dist /var/www/html/admin
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./cert /etc/ssl