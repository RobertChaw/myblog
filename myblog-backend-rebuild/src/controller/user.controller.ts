import {
  Inject,
  Controller,
  Get,
  Query,
  Post,
  Body,
  UseGuard,
} from '@midwayjs/decorator';
import {Context} from '@midwayjs/koa';
import {prisma} from '../prisma';
import {AdminAuthGuard, AuthGuard} from '../guard/auth.guard';

@Controller('/api')
export class UserController {
  @Inject()
  ctx: Context;

  @UseGuard(AuthGuard)
  @Post('/resetUser')
  async resetUser(@Body() body) {
    const data = body;

    const user = await prisma.user.update({
      data: {
        ...data,
      },
      where: {
        id: data.id,
      },
    });
    return {...user};
  }

  @UseGuard([AdminAuthGuard])
  @Get('/getUsersList')
  async getUsersList(@Query() query) {
    const current = Number(query.current);
    const size = Number(query.size);
    const params = query.params ? JSON.parse(query.params as string) : {};

    const whereConditions =
      params && params.q
        ? {
          where: {
            OR: [
              {
                username: {
                  contains: params.q,
                },
              },
              {
                name: {
                  contains: params.q,
                },
              },
            ],
          },
        }
        : {};

    const usersList = await prisma.user.findMany({
      skip: (current - 1) * size,
      take: size,
      where: {
        ...whereConditions.where,
      },
      orderBy: [{isAdmin: 'desc'}],
    });
    usersList.forEach(element => {
      element.password = '';
    });
    const aggregations = await prisma.user.aggregate({
      _count: true,
      where: whereConditions.where,
    });
    const total = aggregations._count;

    return {
      usersList,
      total,
    };
  }

  @UseGuard([AdminAuthGuard])
  @Get('/getUser')
  async getUser(@Query('id') id) {
    id = Number(id);
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    user.password = '';
    return {...user};
  }

  // @Get('/getGithubProfile', { middleware: [LocalPassportMiddleware] })
  // async getGithubProfile() {
  //   return {
  //     status: 'ok',
  //     type: 'admin',
  //   };
  // }

  // @Get('/createUserByGithub', { middleware: [LocalPassportMiddleware] })
  // async createUserByGithub(@Body() body) {
  //   const { avatar, username } = body;
  //   const user = await prisma.user.create({
  //     username,
  //     password: '#######',
  //     isAdmin: false,
  //     avatar,
  //     githubProfile: {
  //           githubId: Number(data.id),
  //           name: data.username,
  //           url: data.profileUrl,
  //     },
  //   });
  //   return {
  //     status: 'ok',
  //     type: 'admin',
  //   };
  // }
}
