# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./app/

# Install the dependencies
RUN yarn install

# Copy the source code to the container
COPY . /app/

# Set the NODE_ENV environment variable to production
ENV NODE_ENV=production

# Expose port 3000
EXPOSE 3000

# Start the server
CMD ["yarn", "dev"]
