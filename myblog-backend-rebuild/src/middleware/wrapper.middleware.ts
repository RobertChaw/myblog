import { IMiddleware } from '@midwayjs/core';
import { Middleware } from '@midwayjs/decorator';
import { NextFunction, Context } from '@midwayjs/koa';

@Middleware()
export class WrapperMiddleware implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const result = await next();

      return {
        data: result,
        success: true,
        message: 'ok',
      };
    };
  }

  static getName(): string {
    return 'Wrapper';
  }
}
