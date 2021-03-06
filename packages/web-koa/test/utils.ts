import { IMidwayKoaConfigurationOptions, Framework, IMidwayKoaApplication } from '../src';
import * as koaModule from '../src';
import { join } from 'path';
import { createApp, close } from '@midwayjs/mock';

export async function creatApp(name: string, options: IMidwayKoaConfigurationOptions = {}): Promise<IMidwayKoaApplication> {
  return createApp<Framework>(join(__dirname, 'fixtures', name), options, koaModule);
}

export async function closeApp(app) {
  return close(app);
}

export { createHttpRequest } from '@midwayjs/mock';
