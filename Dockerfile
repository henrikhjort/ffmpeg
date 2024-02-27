# Use an official Node runtime as a parent image
FROM node:16

# Set the working directory
WORKDIR /usr/src/app

# Install build dependencies for FFmpeg and handle potential errors
RUN apt-get update -qq && \
  apt-get install -y --no-install-recommends \
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
  tar || exit 1

# Download and extract FFmpeg 4.4
RUN wget https://ffmpeg.org/releases/ffmpeg-4.4.4.tar.xz && \
  tar xf ffmpeg-4.4.4.tar.xz

# Build FFmpeg from source
RUN cd ffmpeg-4.4.4 && \
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

# Clean up the downloaded and extracted files to keep the image size down
RUN rm -rf ffmpeg-4.4.4.tar.xz ffmpeg-4.4.4

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of your application's source code
COPY . .

# Expose the port your app will run on
EXPOSE 1337

# Define the command to run your app
CMD ["npm", "start"]
