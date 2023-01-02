import {PrismaClient} from '@prisma/client';
import {faker} from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        username: 'admin',
        name: '管理员',
        password: '123456',
        isAdmin: true,
        avatar: faker.image.avatar(),
        githubId: 0,
        url: '//127.0.0.1',
      },
      {
        name: 'user1',
        password: '123456',
        isAdmin: false,
        avatar: faker.image.avatar(),
        githubId: 1,
        url: '//127.0.0.1',
      },
      {
        name: 'user2',
        password: '123456',
        isAdmin: false,
        avatar: faker.image.avatar(),
        isBanned: true,
        githubId: 2,
        url: '//127.0.0.1',
      },
    ],
  });

  for (let i = 0; i < 20; i++) {
    await prisma.article.create({
      data: {
        title: faker.lorem.words(),
        content: faker.lorem.paragraphs(),
        description: faker.lorem.paragraphs(),
        comments: {
          create: {
            user: {
              connect: {
                id: 1,
              },
            },
            message: faker.lorem.words(),
          },
        },
        tags: {
          connectOrCreate: [
            {
              create: {title: '前端'},
              where: {title: '前端'},
            },
            {
              create: {title: '测试'},
              where: {title: '测试'},
            },
          ],
        },
      },
    });
  }
}

main();
