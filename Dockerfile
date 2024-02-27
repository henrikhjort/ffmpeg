# Use an official Node runtime as a parent image
FROM node:16

# Set the working directory
WORKDIR /usr/src/app

# Install ffmpeg
RUN apt-get update && \
  apt-get install -y ffmpeg

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install project dependencies
RUN npm install

# If you're using TypeScript, install TypeScript and types globally (optional)
# This step is not strictly necessary if you're running the TypeScript compiler via an npm script
# RUN npm install -g typescript

# Bundle app source
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Your app binds to port 1337, make sure the container does too
# If 6774 is not used by your application, you don't need to expose it
EXPOSE 1337

# Define the command to run your app
# Ensure your package.json's "start" script points to the compiled JavaScript output, e.g., node dist/index.js
CMD [ "npm", "start" ]
