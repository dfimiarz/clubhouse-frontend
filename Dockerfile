FROM node:21-apline as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build

FROM nginx:alpine as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
EXPOSE 80 443
CMD ["nginx","-g","daemon off;"]
