import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  // Manipulate params here
  const result = await next(params);
  if (params.model === 'Article' && params.action === 'findUnique') {
    const id = params.args.where.id;
    await prisma.article.update({
      where: {
        id,
      },
      data: {
        viewCount: { increment: 1 },
      },
    });
  }
  // See results here
  return result;
});
