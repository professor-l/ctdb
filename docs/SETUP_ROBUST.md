# Setting up a development environment

**NOTE:** If you don't quite need this much guidance, check out [SETUP_QUICK.md](https://github.com/professor-l/ctdb/blob/main/docs/SETUP_QUICK.md).

### Development

To develop for a project like this, I recommend a proper code editor, if not a full-blown IDE. I use [vim](https://www.vim.org/) or [VSCodium](https://vscodium.com/), a derivative of [VS Code](https://code.visualstudio.com/), depending on the workload. I highly recommend VS Code for beginners, but you're welcome to use anything you like!

### Dependencies

Our project relies on a few key technologies to work: currently, we use PostgreSQL for the database, and node.js/npm for the core application. We need to install both of these first.

### PostgreSQL
Our database needs a backend. Typically, for development environments, something like [sqlite](https://www.sqlite.org/index.html) is preferable, but it lacks features that we need, so we have to use something more robust. I chose [PostgreSQL](https://www.postgresql.org/).

To install PostgreSQL, follow the instructions for your operating system:

<details>
<summary>On <strong>MacOS</strong></summary>

Install the appropriate version of postgresql from [here](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads) - use the "Mac OS X" column (I use version 13.5 for development, anything 12 and up should be sufficient). Run the installer, using all default options, and set the superuser password as "1234".
</details>

<details>
<summary>On <strong>Windows</strong></summary>

Install the appropriate version of postgresql from [here](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads) - use the "Windows x86-64" column (I use version 13.5 for development, anything 12 and up should be sufficient). Run the installer, using all default options, and set the superuser password as "1234".
</details>

<details>
<summary>On <strong>Linux</strong></summary>

Use your package manager to install `postgresql` if it does not come with your operating system. Be sure to enable the `systemd` service or your distro's equivalent:

`sudo systemctl enable --now postgresql`
</details>

Once installed, you will need to set up your development database:

<details>
<summary>On <strong>Windows</strong> or <strong>MacOS</strong></summary>

Open the "pgAdmin" application, and in the topmost bar, navigate to `Object > Create > Database`. Create a database called "ctdb" - the owner "postgres" is fine for now.
</details>

<details>
<summary>On <strong>Linux</strong></summary>

Open a terminal and type the following:

`sudo su - postgres` (to switch to the `postgres` user)
`initdb -D /var/lib/postgres/data` (to initialize the database cluster)
`psql` (to ender a postgres shell)

Next, we will add a password to the `postgres` database account. type `\password postgres` and enter "1234" when prompted to set the password as "1234".

Finally, we can create our user and database:
```
CREATE ROLE ctdb LOGIN SUPERUSER PASSWORD 'ctdb';
CREATE DATABASE classic_tetris OWNER ctdb;
```

Now, quit out of the shell with `\q` and exit the postgres user account with `exit`.
</details>

### node.js and npm

To install node.js and npm, download an installer for your OS from [here](https://nodejs.org/en/download/), or use your own preferred installation method (like a package manager). In my development environment, I use the latest versions of node and npm (17.5.0 and 8.5.0 at the time of writing), but LTS should be fine, and earlier versions may also work fine; the only reason to upgrade is if our later setup throws errors.

### Cloning the repository

Next, we'll retrieve the source code from github, known as "cloning" the repository. You may download it from the website directly, but the preferred method is with the command line:

```
git clone https://github.com/professor-l/ctdb
cd ctdb
```

**NOTE:** If you're using VS Code or another code editor or IDE, now is the time to open it up!

### Setup

Now we can complete final setup.

#### Setting the database URL

From inside the project directory, we can now start the setup. First, copy the `.env.example` file (do **not** delete the original) into a new file simply called `.env`. With the command line, that's `cp .env.example .env`. Finally, edit the contents of `.env` to reflect your newly created database. Set the database url:

```
DATABASE_URL="postgres://ctdb:ctdb@localhost:5432/ctdb"
```

Here, `ctdb:ctdb` is your username and password from the PostgreSQL setup, and the final `ctdb` is the name of the database. If you forget these credentials, on Windows and MacOS you can check the connection details in pgAdmin by right-clicking on the PostgreSQL server in the left naviation tree and selecting "properties". For instance, if it isn't working, check the "connection" tab to see what port postgres is running on; if it's something other than `5432`, you can edit your `.env` file accordingly.

#### Node.js dependencies

Next, install all dependencies by running `npm install` from within the project root. If your node.js or npm versions are too out of date, this step will not work.

#### Database migrations

Next, we'll run some database migrations. Migrations allow the database structure to remain consistent across development environments and in production; They track the entire history of the database's structure, and ensure that it changes in the same way and in the same chronological order across all environments. This helps avoid confusion or errors. **Every time a developer changes the structure of the database (i.e. edits `prisma.schema`), they must also generate a migration.**

To run the existing migrations and bring your database up to speed, run the following command *inside the project directory*:

```
npx prisma migrate dev
```

If it runs without errors, you should see green text letting you know that the migrations were successful. Otherwise, review the setup steps or contact a contributor.

### Starting the project

To start the project, in a terminal inside the project folder, run `npm run dev`. If it spins up with out errors, it should let you know that it's running on localhost:3000. Test that by heading to `localhost:3000/graphql` in your browser. You should see a GraphiQL web interface.

Finally, we can test to see if the GraphQL API and database backend are working. First, we'll execute a mutation to add data to our database. In the left text field, type the following:

```graphql
mutation {
    createPlayer (
        name: "Elle"
        country: "US"
    ) {
        id
        name
        country
    }
} 
```

Now, hit the play button at the top of the page, and the right text field should populate with an API response:

```json
{
    "data": {
        "createPlayer": {
            "id": 1,
            "name": "Elle",
            "country": "US"
        }
    }
}
```

Next, we can run a query to retrieve the data we just created. Replace the text in the left field with the following:

```graphql
query {
    getPlayer(id: 1) {
        name
        country
        id
    }
}
```

Hit the play button again, and the right field should change to this:

```json
{
    "data": {
        "getPlayer": {
            "name": "Elle",
            "country": "US",
            "id": 1
        }
    }
}
```

Congratulations! You've successfully set up a `ctdb` development environment. Before you begin contributing, you'll want to check out the rest of the `docs/` directory, which I hope to eventually fill with helpful write-ups and links to resources on the various tools we use in this project: [git](https://git-scm.com/), [node.js](https://nodejs.org/en/), [graphql](https://graphql.org/), [typescript](https://www.typescriptlang.org/), [prisma](https://www.prisma.io/), and so much more.