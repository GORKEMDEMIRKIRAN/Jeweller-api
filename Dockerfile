


FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
# RUN npm install
RUN npm ci

COPY . .

# Produce build
RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start"]