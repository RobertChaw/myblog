import { AuthenticateOptions, PassportMiddleware } from '@midwayjs/passport';
import { Middleware } from '@midwayjs/decorator';
import { GithubStrategy } from '../strategy/github.strategy';
import { IMiddleware } from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';

@Middleware()
export class GithubPassportMiddleware extends PassportMiddleware(
  GithubStrategy
) {
  getAuthenticateOptions(): AuthenticateOptions | Promise<AuthenticateOptions> {
    return {
      failureRedirect: '/login',
    };
  }
}

@Middleware()
export class saveRedirectMiddleware
  implements IMiddleware<Context, NextFunction>
{
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const { redirect = '' } = ctx.query;
      // console.log(redirect);
      ctx.session.redirect = `${redirect}`;
      await next();
    };
  }
}
