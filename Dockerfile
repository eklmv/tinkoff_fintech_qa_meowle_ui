FROM node:13.12.0-alpine as build
WORKDIR /app
ARG REACT_APP_CATS_API_URL
ARG REACT_APP_REACTION_URL
ARG REACT_APP_PHOTOS_API_URL
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
RUN npm install react-scripts@3.4.1 -g --silent
COPY . ./
RUN npm run build

FROM nginx:stable
COPY ./nginx.conf /etc/nginx/conf.d/nginx.conf
COPY --from=build /app/build/ /var/www/