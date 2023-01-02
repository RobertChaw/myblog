import {Configuration, App} from '@midwayjs/decorator';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import {join} from 'path';
// import { DefaultErrorFilter } from './filter/default.filter';
// import { NotFoundFilter } from './filter/notfound.filter';
import {ReportMiddleware} from './middleware/report.middleware';
// import { WrapperMiddleware } from './middleware/wrapper.middleware';
import * as upload from '@midwayjs/upload';
import * as axios from '@midwayjs/axios';
import * as cos from '@midwayjs/cos';
import * as passport from '@midwayjs/passport';
import {DefaultErrorFilter} from './filter/default.filter';
import {NotFoundFilter} from './filter/notfound.filter';
import {WrapperMiddleware} from './middleware/wrapper.middleware';
import * as proxy from '@midwayjs/http-proxy';

// import { MidwayDecoratorService, REQUEST_OBJ_CTX_KEY } from '@midwayjs/core';
@Configuration({
  imports: [
    koa,
    passport,
    validate,
    axios,
    upload,
    cos,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
    proxy,
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application;

  // @Inject()
  // decoratorService: MidwayDecoratorService;

  async onReady() {
    // add middleware
    this.app.useMiddleware([ReportMiddleware, WrapperMiddleware]);
    this.app.useFilter([DefaultErrorFilter, NotFoundFilter]);
    // add filter
    // this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }
}
