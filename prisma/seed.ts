import { MatchType, PrismaClient, RomVersion } from '@prisma/client';
import { faker } from "@faker-js/faker";
import sampleSize from "lodash/sampleSize";
import { Playstyle } from '../src/types';

const prisma = new PrismaClient();

const playerCount = 1000;
const matchCount = 20;

// TODO: Add more seeds in here, maybe add randomization too
// TODO: Abstractions possible with model attributes

function randomResults(playerId1: string, playerId2: string) {
  const scores = [
    Math.floor(Math.random() * 1300000),
    Math.floor(Math.random() * 1300000)
  ];

  return [
    {
      player: {
        connect: {
          id: playerId1
        }
      },
      styles: sampleSize(Playstyle),
      score: Math.max.apply(undefined, scores),
      rank: 1
    },
    {
      player: {
        connect: {
          id: playerId2
        }
      },
      styles: sampleSize(Playstyle),
      score: Math.min.apply(undefined, scores),
      rank: 2
    }
  ];
}

function randomGames(playerId1: string, playerId2: string) {

  const games = [];

  // first to?
  const n = sampleSize([3, 5, 7])[0];
  for (let i = 0; i < n; ++i) {
    const results = randomResults(playerId1, playerId2)

    games.push({
      timestamp: new Date(),
      results: {
        create: results,
      }
    });
  }

  return games;
  
}

function randomMatch(playerId1: string, playerId2: string) {
  return {
    rom: RomVersion.NTSC,
    timestamp: new Date(),
    type: MatchType.FRIENDLY,
    games: {
      create: randomGames(playerId1, playerId2)
    }
  };
}

async function main() {

  // random players
  const playerIds: string[] = [];

  for (let i = 0; i < playerCount; ++i) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const eloName = faker.internet.userName(firstName, lastName);
    const player = await prisma.player.upsert({
      where: { eloName },
      update: { },
      create: {
        eloName: `${eloName}${i}`,
        name: `${firstName} ${lastName}`,
        playstyles: sampleSize(Playstyle),
        country: faker.address.countryCode(),
      }
    });

    playerIds.push(player.id);
  }

  const matches = [];
  for (let i = 0; i < matchCount; ++i) {
    const players = sampleSize(playerIds, 2);
    matches.push(randomMatch(players[0], players[1]));
  }

  const organization = await prisma.organization.upsert({
    where: { name: "Tetris Testing Grounds" },
    update: {},
    create: {
      name: "Tetris Testing Grounds",
      description: "Perfect for all of your testing needs.",
    },
  });

  const testEvent = await prisma.event.upsert({
    where: { name: "Test Event" },
    update: {},
    create: {
      name: "Test Event",
      edition: "Season 1",
      organizer: {
        connect: { name: "Tetris Testing Grounds"}
      },
      matches: {
        create: matches
      }
    }
  });

  console.log({ organization, testEvent });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
