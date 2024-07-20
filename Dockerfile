# Base image
FROM node:20

RUN apt-get update && apt-get install -y build-essential

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

RUN npm i bcrypt
# Bundle app source
COPY . .

# Copy the .env and .env.development files
COPY .env ./

# Creates a "dist" folder with the production build
RUN npm run build

# Expose the port on which the app will run
EXPOSE 3000

# Start the server using the production build
CMD ["node","dist/main.js"]