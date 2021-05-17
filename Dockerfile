FROM node:13.12.0-alpine as build
WORKDIR /app
ARG REACT_APP_CATS_API_URL
ARG REACT_APP_REACTION_URL
ARG REACT_APP_PHOTOS_API_URL
ARG CI_COMMIT_REF_NAME
COPY . ./
RUN npm install --production
RUN npm run build

FROM nginx:stable
COPY ./nginx.conf /etc/nginx/conf.d/nginx.conf
COPY --from=build /app/build/ /var/www/
