import { Body, Controller, Get, Inject, Post } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { prisma } from '../prisma';

@Controller('/api')
export class ArticleController {
  @Inject()
  ctx: Context;

  @Get('/getAbout')
  async getAbout() {
    const article = await prisma.article.findFirst({
      where: {
        type: 'about',
      },
    });
    return { ...article };
  }

  @Post('/updateAbout')
  async updateAbout(@Body('content') content) {
    const { id } = await prisma.article.findFirst({
      select: {
        id: true,
      },
      where: {
        type: 'about',
      },
    });

    const article = await prisma.article.update({
      data: {
        content,
      },
      where: {
        id,
      },
    });
    return { ...article };
  }
}
