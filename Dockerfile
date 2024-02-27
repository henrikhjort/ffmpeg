FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Install ffmpeg
RUN apt-get update && \
  apt-get install -y ffmpeg

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install project dependencies
RUN npm install

# Bundle app source
COPY . .

# Your app binds to port 1337, make sure the container does too
EXPOSE 1337

# Define the command to run your app
CMD [ "npm", "start" ]