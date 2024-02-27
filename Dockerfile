# Use an official Node runtime as a parent image
FROM node:16

# Set the working directory
WORKDIR /usr/src/app

# Install build dependencies for FFmpeg
RUN apt-get update && \
  apt-get install -y \
  build-essential \
  yasm \
  nasm \
  pkg-config \
  libx264-dev \
  libx265-dev \
  libnuma-dev \
  libvpx-dev \
  libfdk-aac-dev \
  libmp3lame-dev \
  libopus-dev \
  wget \
  tar

# Download FFmpeg 5.1.4
RUN wget https://ffmpeg.org/releases/ffmpeg-5.1.4.tar.xz

# Extract FFmpeg
RUN tar xf ffmpeg-5.1.4.tar.xz

# Build FFmpeg
RUN cd ffmpeg-5.1.4 && \
  ./configure \
  --enable-gpl \
  --enable-libx264 \
  --enable-libx265 \
  --enable-libvpx \
  --enable-libfdk-aac \
  --enable-libmp3lame \
  --enable-libopus \
  --enable-nonfree && \
  make -j$(nproc) && \
  make install

# Clean up the tar file and build directory
RUN rm -rf ffmpeg-5.1.4.tar.xz ffmpeg-5.1.4

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install project dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose the port your app runs on
EXPOSE 1337

# Define the command to run your app
CMD [ "npm", "start" ]
