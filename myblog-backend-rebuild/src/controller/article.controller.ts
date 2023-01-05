import {
  Inject,
  Controller,
  Get,
  Query,
  Post,
  Body,
  Files,
  Fields,
  UseGuard,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { prisma } from '../prisma';
import { COSService } from '@midwayjs/cos';
import { nanoid } from 'nanoid';
import { AdminAuthGuard, AuthGuard } from '../guard/auth.guard';

@Controller('/api')
export class ArticleController {
  @Inject()
  ctx: Context;

  @Get('/getArticle')
  async getArticle(@Query('id') id) {
    id = Number(id);

    if (!Number.isInteger(id))
      return {
        status: 1,
        msg: '参数错误',
      };

    const article = await prisma.article.findUnique({
      where: {
        id,
      },
      include: {
        comments: {
          where: {
            parentId: null,
          },
          include: {
            nodes: {
              include: {
                parent: true,
              },
            },
          },
        },
        tags: true,
      },
    });

    return { ...article };
  }

  @Get('/getArticleList')
  async getArticleList(@Query() query) {
    const current = Number(query.current);
    const size = Number(query.size);
    const params = query.params ? JSON.parse(query.params as string) : {};

    let queryConditions = { where: undefined };
    if (params && params.q) {
      queryConditions = {
        where: {
          OR: [
            {
              title: {
                contains: params.q,
              },
            },
            {
              content: {
                contains: params.q,
              },
            },
          ],
        },
      };
    }

    const articlesList = await prisma.article.findMany({
      skip: (current - 1) * size,
      take: size,
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        title: true,
        description: true,
        viewCount: true,
        comments: {
          select: {
            id: true,
          },
        },
        tags: true,
      },
      where: {
        AND: [
          {
            type: 'normal',
          },
          {
            ...queryConditions.where,
          },
        ],
      },
      orderBy: [{ createdAt: 'desc' }],
    });

    const aggregations = await prisma.article.aggregate({
      _count: true,
      where: {
        AND: [
          {
            type: 'normal',
          },
          {
            ...queryConditions.where,
          },
        ],
      },
    });

    const total = aggregations._count;

    return {
      list: articlesList,
      total,
    };
  }

  @Get('/getTopArticles')
  async getTopArticles() {
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        viewCount: true,
      },
      orderBy: { viewCount: 'desc' },
      take: 5,
    });
    return [...articles];
  }

  @Get('/getArticlesByTags')
  async getArticlesByTags(
    @Query('tags[]') tags: string[] | string | undefined
  ) {
    if (!tags) {
      tags = [];
    }

    if (!Array.isArray(tags)) {
      tags = [...tags];
    }

    if (tags.length === 0) {
      const articles = await prisma.article.findMany({
        select: {
          id: true,
          title: true,
          tags: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        where: {
          type: 'normal',
        },
      });
      return [...articles];
    }

    const ids = tags.map(id => Number(id));

    const articles = await prisma.article.findMany({
      where: {
        tags: {
          some: {
            id: {
              in: ids,
            },
          },
        },
        type: 'normal',
      },
      select: {
        id: true,
        title: true,
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return [...articles];
  }

  @UseGuard([AdminAuthGuard])
  @Post('/deleteArticle')
  async deleteArticle(@Body('id') id) {
    const article = await prisma.article.delete({ where: { id } });
    return { ...article };
  }

  @UseGuard(AuthGuard)
  @Post('/updateArticle')
  async updateArticle(@Body() body) {
    type body = {
      id: number;
      title: string;
      content: string;
      description: string;
      tags: string[];
    };
    const { id, title, content, description, tags }: body = body;

    const article = await prisma.article.update({
      where: { id },
      data: {
        title,
        content,
        description,
        tags: {
          set: [],
          connectOrCreate: [
            ...tags.map(value => {
              return {
                create: {
                  title: value,
                },
                where: {
                  title: value,
                },
              };
            }),
          ],
        },
      },
    });
    return { ...article };
  }

  @UseGuard([AdminAuthGuard])
  @Post('/createArticle')
  async createArticle(@Body() body) {
    type body = {
      id: number;
      title: string;
      content: string;
      description: string;
      tags: string[];
    };
    const { title, content, description, tags }: body = body;

    const article = await prisma.article.create({
      data: {
        title,
        content,
        description,
        tags: {
          connectOrCreate: [
            ...tags.map(value => {
              return {
                create: {
                  title: value,
                },
                where: {
                  title: value,
                },
              };
            }),
          ],
        },
      },
    });
    return { ...article };
  }

  @Inject()
  cosService: COSService;

  @UseGuard([AdminAuthGuard])
  @Post('/upload')
  async uploadImage(@Files() files, @Fields() fields) {
    // console.log(files, fields);
    const res = await this.cosService.sliceUploadFile({
      Bucket: 'data1-1253865806',
      Region: 'ap-guangzhou',
      Key: `${nanoid()}${files[0]._ext}`,
      FilePath: files[0].data,
    });

    // console.log(res);

    return `//${res.Location}`;
  }
}
