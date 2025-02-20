# ================ STEP-1 ================
FROM node:16 AS builder

WORKDIR /frontend

COPY package*.json ./

RUN npm install

COPY . .

# ARG REACT_APP_API_URL
# ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

# ================ STEP-2 ================
FROM nginx:latest

COPY --from=builder /frontend/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
