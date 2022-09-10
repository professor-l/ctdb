# Info about Docker setup.

## What is docker?

Docker is a containerization tool that makes it easy to reproduce builds of a piece of software. Docker-compose 
is a tool that comes with Docker and makes it possible to orchestrate the creation and management of several docker
containers at once. To install docker, go to <https://docs.docker.com/engine/install/>. 

## How is docker used in ctdb?

Ctdb has two files related to docker. The first, `Dockerfile` is instructions for docker to create/recreate a 
container with ctdb in it and then start it when asked to. The second is `docker-compose.yml`. `docker-compose.yml`
has instructions for docker to create two docker containers and one docker volume. A docker volume is a datastore that 
persists on the hard disk even if the docker container is shut down or deleted. The containers created by `docker-compose.yml`
include ctdb itself and then an instance of Postgres to act as the database for ctdb. You do not need to have Postgres or 
ctdb running on your local machine -- they both run in docker. The volume created is for the Postgres data, so that it is
not lost during reboots. 

## How do I use docker as a developer of ctdb?

Once you have docker installed, you should set a Postgres password in your `.env` file. For example:
```
POSTGRES_PASSWORD=hunter2
```

After this you can simply run `docker-compose up --build -d` and check `http://localhost:3000/graphql` once the command 
completes. To pull down the docker containers, run `docker-compose down`. Remember to bring the docker containers down
and then back up again to see any changes you make, since the container actually contains a copy of all the source code 
and migrations, and will not reflect changes to the original without being rebuilt. 
