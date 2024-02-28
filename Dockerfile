# Use an official Node.js runtime as a parent image
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/app

RUN apt-get update && \
  apt-get install -y ffmpeg

# Copy package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Install any dependencies
RUN npm install

# Copy the rest of your application's source code from your host to your image filesystem.
COPY . .

# Build your TypeScript files
RUN npm run build

# Inform Docker that the container is listening on the specified port at runtime.
EXPOSE 3000

# Define the command to run your app using CMD which defines your runtime
CMD ["node", "dist/index.js"]
