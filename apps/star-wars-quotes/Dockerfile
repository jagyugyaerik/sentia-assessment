FROM node:10.15.2-alpine AS appbuild
WORKDIR /usr/src/app
COPY . ./
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]