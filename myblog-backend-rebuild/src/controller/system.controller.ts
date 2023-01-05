import { Body, Controller, Get, Inject, Post } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { COSService } from '@midwayjs/cos';

@Controller('/api')
export class ArticleController {
  @Inject()
  ctx: Context;

  @Inject()
  cosService: COSService;

  @Get('/getAnncmnt')
  async getAnncmnt() {
    const buffer = await this.cosService.getObject({
      Bucket: 'data1-1253865806',
      Region: 'ap-guangzhou',
      Key: 'anncmnt',
    });
    const announcement = Buffer.from(buffer.Body).toString();
    return announcement;
  }

  // @UseGuard([AdminAuthGuard])
  @Post('/updateAnncmnt')
  async updateAnncmnt(@Body('anncmnt') anncmnt) {
    const announcement = await this.cosService.putObject({
      Bucket: 'data1-1253865806',
      Region: 'ap-guangzhou',
      Key: 'anncmnt',
      Body: anncmnt as string,
    });
    return announcement;
  }
}
