# Setting up a development environment on Linux

First, install dependencies:

- PostgreSQL 13 (don't forget to also enable the service in systemd or )
- Node.js LTS and the accompanying npm version

Enter the postgres shell:

```bash
sudo su - postrges
psql
```

From the shell, create a new user and database:

```
CREATE ROLE username LOGIN SUPERUSER PASSWORD 'password';
CREATE DATABASE dbname OWNER username;
\q
```

In a normal shell once more, we can run setup:

```bash
git clone git@github.com:professor-l/ctdb.git
cd ctdb
echo 'DATABASE_URL="postgres://username:password@localhost:5432/dbname"' > .env
npm install
npx prisma migrate dev
```

You can now start the project with `npm run dev`, and a GraphiQL interface should be accessible from `http://localhost:3000/graphql`.