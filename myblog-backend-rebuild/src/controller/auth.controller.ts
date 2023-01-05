import { Controller, Get, Inject, Post, Session } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { LocalPassportMiddleware } from '../middleware/local.middleware';
import { GithubPassportMiddleware } from '../middleware/github.middleware';
import { HttpStatus, MidwayHttpError } from '@midwayjs/core';

// import { HttpStatus, MidwayHttpError } from '@midwayjs/core';

@Controller('/api')
export class AuthController {
  @Inject()
  ctx: Context;

  @Post('/outLogin')
  async outLogin(@Session() session) {
    session.user = null;
    // ctx.cookies.set('loggedIn')
    return { msg: '登出成功' };
  }

  @Post('/login', { middleware: [LocalPassportMiddleware] })
  async Login() {
    return {
      status: 'ok',
      type: 'admin',
    };
  }

  // @Get('/loginByGithub', {
  @Get('/login/github', {
    middleware: [GithubPassportMiddleware],
  })
  async LoginByGithub(@Session() session) {
    this.ctx.status = 204;
    return 'ok';
  }

  // @Get('/LoginByGithub/cb', { middleware: [GithubPassportMiddleware] })
  @Get('/login/github/cb', { middleware: [GithubPassportMiddleware] })
  async GithubCallback(@Session() session) {
    this.ctx.redirect(`/redirect`);
  }

  @Get('/currentUser')
  async currentUser(@Session() session) {
    // if (!session?.user?.user)
    //   throw new MidwayHttpError('用户未登录', HttpStatus.FORBIDDEN);
    return session?.user?.user;
  }

  @Get('/currentAdminUser')
  async currentAdminUser(@Session() session) {
    // console.log(session);
    if (!session?.user?.user)
      throw new MidwayHttpError('用户未登录', HttpStatus.FORBIDDEN);
    if (!session?.user?.user?.isAdmin)
      throw new MidwayHttpError('用户没有管理权限！', HttpStatus.FORBIDDEN);
    return session?.user?.user;
  }
}
