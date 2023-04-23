FROM node:16-alpine as builder
# RUN apk add --no-cache --virtual .build-deps python3 make g++
WORKDIR /app/
COPY ./ /app
RUN export NODE_OPTIONS=--openssl-legacy-provider
RUN node -v
RUN npm -v
RUN npm ci
RUN npm run build:dev

FROM nginx:alpine
COPY --from=builder /app/build/ /usr/share/nginx/html/

RUN sed -i 's/\.htm;/\.htm;\ntry_files \$uri \$uri\/ \/index.html\$args;/' /etc/nginx/conf.d/default.conf
RUN sed -i 's/80;/5000;/' /etc/nginx/conf.d/default.conf

EXPOSE 5000
STOPSIGNAL SIGTERM
CMD ["nginx", "-g", "daemon off;"]
