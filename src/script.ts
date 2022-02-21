import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

async function main() {
    const newUser = await prisma.user.create({
        data: {
            username: "professor-l",
            salt: "test",
            hashed_pw: "jib"
        }
    });
    const allUsers = await prisma.user.findMany();
    console.log(allUsers);
}

main()
    .catch(e => {
        throw e
    })
    
    .finally(async () => {
        await prisma.$disconnect();
    });