import {CustomStrategy, PassportStrategy} from '@midwayjs/passport';
import {Strategy} from 'passport-local';
import {prisma} from '../prisma';
import {HttpStatus, MidwayHttpError} from '@midwayjs/core';

@CustomStrategy()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  // 策略的验证
  serializeUser(user, done) {
    // 可以只保存用户名
    done(null, user);
  }

  deserializeUser(user, done) {
    // 这里不是异步方法，你可以从其他地方根据用户名，反查用户数据。
    done(null, user);
  }

  async validate(username, password) {
    const user = await prisma.user.findFirst({
      where: {
        username,
        password,
      },
      // include: {
      //   // githubProfile: true,
      // },
    });
    // console.log(user);
    console.log('登录成功');
    if (!user)
      throw new MidwayHttpError('用户名或密码错误', HttpStatus.BAD_REQUEST);
    if (user.isBanned)
      throw new MidwayHttpError('用户名被禁止登录', HttpStatus.BAD_REQUEST);
    return {
      ...user,
    };
  }

  // 当前策略的参数
  getStrategyOptions(): any {
    return {};
  }
}
