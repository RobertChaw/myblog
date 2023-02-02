import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UseGuard,
} from '@midwayjs/decorator';
import {Context} from '@midwayjs/koa';
import {AdminAuthGuard} from '../guard/auth.guard';
import {prisma} from '../prisma';

@Controller('/api')
export class TravelMapController {
  @Inject()
  ctx: Context;

  @UseGuard([AdminAuthGuard])
  @Post('/addPlace')
  async addPlace(@Body() body) {
    const place = await prisma.place.create({
      data: {
        name: body.name,
        status: body.status,
        date: body.date,
      },
    });

    return {...place};
  }

  @UseGuard([AdminAuthGuard])
  @Post('/delPlace')
  async delPlace(@Body('id') id) {
    const place = await prisma.place.delete({where: {id}});

    return {...place};
  }

  @Get('/getPlacesList')
  async getPlacesList() {
    const places = await prisma.place.findMany();
    return [...places];
  }
}
