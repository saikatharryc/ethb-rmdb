FROM node:10
WORKDIR /main_app
COPY package*.json ./
RUN yarn
COPY . .
EXPOSE 3000
CMD [ "yarn", "run" ,"dev"]