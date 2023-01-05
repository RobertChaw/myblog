import { Catch } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { HttpStatus, MidwayHttpError } from '@midwayjs/core';

@Catch()
export class DefaultErrorFilter {
  async catch(err: Error, ctx: Context) {
    console.warn(err);
    if (err instanceof MidwayHttpError) ctx.status = err.status;
    else ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;

    return {
      success: false,
      message: err.message,
    };
  }
}
