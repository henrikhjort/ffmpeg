# Use an official Node runtime as a parent image
FROM node:16

# Set the working directory
WORKDIR /usr/src/app

# Install FFmpeg 4.4 or later
RUN apt-get update && \
  apt-get install -y software-properties-common && \
  add-apt-repository ppa:jonathonf/ffmpeg-4 && \
  apt-get update && \
  apt-get install -y ffmpeg

# Verify FFmpeg version
RUN ffmpeg -version

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install project dependencies
RUN npm install

# Bundle app source
COPY . .

# Your app binds to port 1337, make sure the container does too
EXPOSE 1337

# Define the command to run your app
CMD ["npm", "start"]
