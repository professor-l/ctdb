# Start with a Docker image running the latest version of node.
FROM node:latest

# Set timezone
ENV TZ=America/New_York
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Copy over source code and migrations and config necessary to run the GraphQL API
WORKDIR /ctdb
COPY ./prisma ./prisma
COPY ./src ./src
COPY ./package.json ./
COPY ./tsconfig.json ./

# Install npm packages as necessary
RUN npm install

# Expose port used to serve GraphQL API
EXPOSE 3000

# Tell Docker to start this container by setting the environment variable and then running any migrations and then starting the GraphQL server. 
ENTRYPOINT export DATABASE_URL="postgresql://postgres:${POSTGRES_PASSWORD}@db:5432/ctdb" && npx prisma migrate dev && npm start
