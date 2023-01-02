import {CustomStrategy, PassportStrategy} from '@midwayjs/passport';
import {Strategy, StrategyOptions} from 'passport-github2';
import {prisma} from '../prisma';
import {HttpStatus, MidwayHttpError} from '@midwayjs/core';
// import { nanoid } from 'nanoid';
// import { prisma } from '../prisma';
// import { Context } from '@midwayjs/koa';
// import { Provide } from '@midwayjs/decorator';

const GITHUB_CLIENT_ID = '1336179b5140d4305ddf',
  GITHUB_CLIENT_SECRET = '7bca13cad51a701d4c3c35eb74592a343dd98c20';

@CustomStrategy()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  serializeUser(user, done) {
    // 可以只保存用户名
    done(null, user);
  }

  deserializeUser(user, done) {
    // 这里不是异步方法，你可以从其他地方根据用户名，反查用户数据。
    done(null, user);
  }

  async validate(...payload) {
    const data = payload[2];
    const id = Number(data.id);
    const user = await prisma.user.upsert({
      where: {
        githubId: id,
      },
      create: {
        name: data.username,
        avatar: data.photos[0].value,
        githubId: id,
        url: data.profileUrl,
      },
      update: {
        name: data.username,
        avatar: data.photos[0].value,
        githubId: id,
        url: data.profileUrl,
      },
    });

    if (user.isBanned)
      throw new MidwayHttpError('用户名被禁止登录', HttpStatus.BAD_REQUEST);
    return {...user};
  }

  getStrategyOptions(): StrategyOptions {
    return {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: 'https://robertchaw.me/api/LoginByGithub/cb',
    };
  }
}

//{
//   "id": "29568488",
//   "displayName": null,
//   "username": "RobertChaw",
//   "profileUrl": "https://github.com/RobertChaw",
//   "photos": [
//     {
//       "value": "https://avatars.githubusercontent.com/u/29568488?v=4"
//     }
//   ],
//   "provider": "github",
//   "_raw": "{\"login\":\"RobertChaw\",\"id\":29568488,\"node_id\":\"MDQ6VXNlcjI5NTY4NDg4\",\"avatar_url\":\"https://avatars.githubusercontent.com/u/29568488?v=4\",\"gravatar_id\":\"\",\"url\":\"https://api.github.com/users/RobertChaw\",\"html_url\":\"https://github.com/RobertChaw\",\"followers_url\":\"https://api.github.com/users/RobertChaw/followers\",\"following_url\":\"https://api.github.com/users/RobertChaw/following{/other_user}\",\"gists_url\":\"https://api.github.com/users/RobertChaw/gists{/gist_id}\",\"starred_url\":\"https://api.github.com/users/RobertChaw/starred{/owner}{/repo}\",\"subscriptions_url\":\"https://api.github.com/users/RobertChaw/subscriptions\",\"organizations_url\":\"https://api.github.com/users/RobertChaw/orgs\",\"repos_url\":\"https://api.github.com/users/RobertChaw/repos\",\"events_url\":\"https://api.github.com/users/RobertChaw/events{/privacy}\",\"received_events_url\":\"https://api.github.com/users/RobertChaw/received_events\",\"type\":\"User\",\"site_admin\":false,\"name\":null,\"company\":null,\"blog\":\"\",\"location\":null,\"email\":null,\"hireable\":null,\"bio\":\"Frontend Developer\",\"twitter_username\":null,\"public_repos\":17,\"public_gists\":1,\"followers\":4,\"following\":18,\"created_at\":\"2017-06-20T09:18:18Z\",\"updated_at\":\"2022-12-12T08:56:23Z\"}",
//   "_json": {
//     "login": "RobertChaw",
//     "id": 29568488,
//     "node_id": "MDQ6VXNlcjI5NTY4NDg4",
//     "avatar_url": "https://avatars.githubusercontent.com/u/29568488?v=4",
//     "gravatar_id": "",
//     "url": "https://api.github.com/users/RobertChaw",
//     "html_url": "https://github.com/RobertChaw",
//     "followers_url": "https://api.github.com/users/RobertChaw/followers",
//     "following_url": "https://api.github.com/users/RobertChaw/following{/other_user}",
//     "gists_url": "https://api.github.com/users/RobertChaw/gists{/gist_id}",
//     "starred_url": "https://api.github.com/users/RobertChaw/starred{/owner}{/repo}",
//     "subscriptions_url": "https://api.github.com/users/RobertChaw/subscriptions",
//     "organizations_url": "https://api.github.com/users/RobertChaw/orgs",
//     "repos_url": "https://api.github.com/users/RobertChaw/repos",
//     "events_url": "https://api.github.com/users/RobertChaw/events{/privacy}",
//     "received_events_url": "https://api.github.com/users/RobertChaw/received_events",
//     "type": "User",
//     "site_admin": false,
//     "name": null,
//     "company": null,
//     "blog": "",
//     "location": null,
//     "email": null,
//     "hireable": null,
//     "bio": "Frontend Developer",
//     "twitter_username": null,
//     "public_repos": 17,
//     "public_gists": 1,
//     "followers": 4,
//     "following": 18,
//     "created_at": "2017-06-20T09:18:18Z",
//     "updated_at": "2022-12-12T08:56:23Z"
//   }
// }
