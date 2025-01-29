# Usar una imagen base oficial de Node.js basada en Debian Buster
FROM node:18-buster

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el package.json y el package-lock.json (si lo tienes) para instalar dependencias
COPY package*.json ./

# Instalar las dependencias de Node.js
RUN npm install

# Instalar Apertium desde los repositorios de Debian Buster
RUN apt-get update && \
    apt-get install -y apertium apertium-es-gl

# Copiar el resto de los archivos de la aplicación
COPY . .

# Exponer el puerto en el que tu aplicación escuchará
EXPOSE 3001

# Definir el comando por defecto para ejecutar la aplicación
CMD ["node", "server.js"]
