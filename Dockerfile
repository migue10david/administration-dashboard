FROM node:20-alpine

WORKDIR /app

# Copiar dependencias e instalar
COPY package*.json ./
COPY prisma ./prisma 
RUN npm ci

# Copiar aplicación
COPY . .

# Build de producción (optimizado)
RUN npm run build

# Puerto y comando de inicio
EXPOSE 3000
CMD ["npm", "start"]
