import { Guard, IGuard } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Guard()
export class AuthGuard implements IGuard<Context> {
  async canActivate(
    context: Context,
    suppilerClz,
    methodName: string
  ): Promise<boolean> {
    const user = context.session?.user?.user;

    if (user && !user.isBanned) return true;
    return false;
  }
}

@Guard()
export class AdminAuthGuard implements IGuard<Context> {
  async canActivate(
    context: Context,
    suppilerClz,
    methodName: string
  ): Promise<boolean> {
    const user = context.session?.user?.user;

    if (user && user?.isAdmin) return true;
    return false;
  }
}
