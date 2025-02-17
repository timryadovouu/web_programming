# FROM node:16

# WORKDIR /frontend

# COPY package*.json ./

# RUN npm install

# COPY . .

# EXPOSE 80

# CMD ["npm", "start"]

FROM node:16 AS builder
WORKDIR /frontend
COPY package*.json ./
RUN npm install
COPY . .
# ARG REACT_APP_API_URL
# ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

# Stage 2: Nginx для продакшн-сервера
FROM nginx:latest
COPY --from=builder /frontend/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
