import {
  Inject,
  Controller,
  Get,
  Body,
  UseGuard,
  Post,
} from '@midwayjs/decorator';
import {Context} from '@midwayjs/koa';
import {prisma} from '../prisma';
import {AdminAuthGuard} from '../guard/auth.guard';

@Controller('/api')
export class TagController {
  @Inject()
  ctx: Context;

  @UseGuard([AdminAuthGuard])
  @Get('/addTag')
  async addTag(@Body() body) {
    type body = { title: string };
    const {title}: body = body;

    const tag = await prisma.tag.create({
      data: {
        title,
      },
    });
    return {...tag};
  }

  @UseGuard([AdminAuthGuard])
  @Post('/delTag')
  async delTag(@Body('id') id) {
    const tag = await prisma.tag.delete({
      where: {
        id,
      },
    });
    return {...tag};
  }

  @Get('/getTagsList')
  async getTagsList() {
    const tags = await prisma.tag.findMany({
      orderBy: [{createdAt: 'desc'}],
    });

    return [...tags];
  }
}
