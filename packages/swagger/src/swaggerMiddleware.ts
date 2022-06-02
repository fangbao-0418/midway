import type {
  IMiddleware,
  IMidwayApplication,
  IMidwayContext,
  NextFunction,
} from '@midwayjs/core';
import {
  Inject,
  Provide,
  Scope,
  ScopeEnum,
  MidwayFrameworkType,
} from '@midwayjs/decorator';
import { readFileSync } from 'fs';
import { join, extname } from 'path';
import { SwaggerExplorer } from './swaggerExplorer';

@Provide()
@Scope(ScopeEnum.Singleton)
export class SwaggerMiddleware
  implements IMiddleware<IMidwayContext, NextFunction, unknown>
{

  @Inject()
  private swaggerExplorer: SwaggerExplorer;

  swaggerPath = 'swagger-ui';

  resolve(app: IMidwayApplication) {
    if (app.getFrameworkType() === MidwayFrameworkType.WEB_EXPRESS) {
      return async (req: any, res: any, next: NextFunction) => {
        let pathname = req.path;
        if (pathname.indexOf('/swagger-resources') > -1) {
          const url = 'http://' + req.host + '/swagger-ui/index.json';
          res.send(
            JSON.stringify([
              {
                name: 'default',
                url: url,
                swaggerVersion: '3.0',
                location: url,
              },
            ])
          );
          return;
        }
        if (pathname.indexOf(this.swaggerPath) === -1) {
          return next();
        }
        const arr = pathname.split('/');
        const lastName = arr.pop();
        if (lastName === 'index.json') {
          res.send(this.swaggerExplorer.getData());
          return;
        }

        if (['swagger-ui', ''].includes(lastName)) {
          pathname = this.swaggerPath + '/index.html'
        }
        let content = '';
        try {
          content = readFileSync(join(__dirname, '../public', pathname), {
            encoding: 'utf-8',
          });
        } catch (e) {
          content = '';
          res.send('Not Found');
          return;
        }

        const ext = extname(lastName);
        if (ext === '.js') {
          res.type('application/javascript');
        } else if (ext === '.map') {
          res.type('application/json');
        } else if (ext === '.css') {
          res.type('text/css');
        } else if (ext === '.png') {
          res.type('image/png');
        }

        res.send(content);
      };
    } else {
      return async (ctx: IMidwayContext, next: NextFunction) => {
        let pathname = (ctx as any).path;
        if (pathname.indexOf('/swagger-resources') > -1) {
          const url = 'http://' + (ctx as any).host + '/swagger-ui/index.json';
          (ctx as any).body = JSON.stringify([
            {
              name: 'default',
              url: url,
              swaggerVersion: '3.0',
              location: url,
            },
          ]);
          return;
        }

        if (pathname.indexOf(this.swaggerPath) === -1) {
          return next();
        }
        const arr = pathname.split('/');
        const lastName = arr.pop();
        if (lastName === 'index.json') {
          (ctx as any).body = this.swaggerExplorer.getData();
          return;
        }
        if (['swagger-ui', ''].includes(lastName)) {
          pathname = this.swaggerPath + '/index.html'
        }
        let content = '';
        try {
          content = readFileSync(join(__dirname, '../public', pathname), {
            encoding: 'utf-8',
          });
        } catch (e) {
          content = '';
          (ctx as any).body = 'Not Found'
          return;
        }

        const ext = extname(lastName);
        if (ext === '.js') {
          (ctx as any).set('Content-Type', 'application/javascript');
        } else if (ext === '.map') {
          (ctx as any).set('Content-Type', 'application/json');
        } else if (ext === '.css') {
          (ctx as any).set('Content-Type', 'text/css');
        } else if (ext === '.png') {
          (ctx as any).set('Content-Type', 'image/png');
        }

        (ctx as any).body = content;

      };
    }
  }

  static getName() {
    return 'swagger';
  }
}
