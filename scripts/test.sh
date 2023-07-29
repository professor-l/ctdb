# start up test db
docker-compose up -d test_db
# run db migrations on test db, don't provide seed data
npx dotenv -e .env.test -- prisma migrate reset --force --skip-seed
# run test suite
npx dotenv -e .env.test -- jest --config jest.config.ts ./test --detectOpenHandles
# destroy test db
docker-compose stop test_db
docker-compose rm -f test_db
