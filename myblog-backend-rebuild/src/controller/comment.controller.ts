import {
  Inject,
  Controller,
  Get,
  Query,
  Post,
  Body,
  UseGuard,
  Session,
} from '@midwayjs/decorator';
import {Context} from '@midwayjs/koa';
import {prisma} from '../prisma';
import {AuthGuard} from '../guard/auth.guard';

@Controller('/api')
export class CommentController {
  @Inject()
  ctx: Context;

  @Get('/getLatestComments')
  async getLatestComments() {
    const comments = await prisma.comment.findMany({
      select: {
        id: true,
        user: {
          select: {
            username: true,
            name: true,
          },
        },
        article: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });
    return [...comments];
  }

  @UseGuard(AuthGuard)
  @Post('/addComment')
  async addComment(@Body() body, @Session() session) {
    type body = {
      message: string;
      articleId: number;
      parentId?: number;
      rootId?: number;
    };
    const {message, articleId, parentId, rootId}: body = body;
    const comment = await prisma.comment.create({
      data: {
        userId: session.user.user.id,
        message,
        articleId,
        parentId,
        rootId,
      },
    });

    return {...comment};
  }

  @UseGuard(AuthGuard)
  @Post('/delComment')
  async delComment(@Body('id') id) {
    const comment = await prisma.comment.delete({
      where: {
        id,
      },
    });
    return {...comment};
  }

  @Get('/getCommentsList')
  async getCommentsList(@Query('articleId') articleId) {
    articleId = Number(articleId);

    const comments = await prisma.comment.findMany({
      where: {
        articleId,
        parentId: null, //Todo:待测试
      },
      include: {
        user: true,
        nodes: {
          include: {
            user: true,
            parent: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    return [...comments];
  }
}
