import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// TODO: Add more seeds in here, maybe add randomization too
// TODO: Abstractions possible with model attributes

async function main() {
  const organization = await prisma.organization.upsert({
    where: { name: 'Tetris Testing Grounds' },
    update: {},
    create: {
      name: 'Tetris Testing Grounds',
      description: 'Perfect for all of your testing needs.',
      members: {
        create: [
          {
            username: 'admin',
            pronouns: ["THEY"]
          },
        ],
      }
    },
  });

  const playerJack = await prisma.player.upsert({
    where: { name: 'Jack' },
    update: {},
    create: {
      name: 'Jack',
      playstyles: ['DAS'],
      country: 'US',
      user: {
        connectOrCreate: {
          where: {
            username: 'jack',
          },
          create: {
            username: 'jack',
            pronouns: ["HE"],
          }
        }
      }
    },
  });

  const playerJill = await prisma.player.upsert({
    where: { name: 'Jill' },
    update: {},
    create: {
      name: 'Jill',
      playstyles: ['DAS'],
      country: 'US',
      user: {
        connectOrCreate: {
          where: {
            username: 'jill',
          },
          create: {
            username: 'jill',
            pronouns: ["SHE"],
          }
        }
      }
    },
  });

  const testEvent = await prisma.event.upsert({
    where: {
      name_edition: {
        name: 'Test Event',
        edition: 'Season 1',
      },
    },
    update: {},
    create: {
      name: 'Test Event',
      edition: 'Season 1',
      participants: {
        connect: [
          { name: 'Jack' },
          { name: 'Jill' },
        ]
      },
      organizer: {
        connect: {
          name: 'Tetris Testing Grounds'
        }
      },
      matches: {
        create: [
          {
            rom: 'NTSC',
            timestamp: new Date(),
            type: 'FRIENDLY',
            games: {
              create: [
                {
                  timestamp: new Date(),
                  results: {
                    create: [
                      {
                        player: {
                          connect: {
                            name: 'Jack',
                          }
                        },
                        styles: ['DAS'],
                        rank: 1,
                        score: 500_000,
                      },
                      {
                        player: {
                          connect: {
                            name: 'Jill',
                          }
                        },
                        styles: ['DAS'],
                        rank: 2,
                        score: 400_000,
                      },
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    },
  });

  console.log({ organization, playerJack, playerJill, testEvent });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
