# Use an official Node runtime as a parent image
FROM node:16

# Set the working directory
WORKDIR /usr/src/app

# Install FFmpeg
RUN apt-get update && apt-get install -y wget \
  && mkdir /ffmpeg \
  && cd /ffmpeg \
  && wget https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz \
  && tar xvf ffmpeg-release-amd64-static.tar.xz --strip-components=1 \
  && mv ffmpeg ffprobe /usr/local/bin/ \
  && cd /usr/src/app \
  && rm -rf /ffmpeg

# Print FFmpeg version
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
