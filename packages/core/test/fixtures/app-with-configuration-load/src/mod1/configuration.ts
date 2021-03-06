import { Configuration } from '@midwayjs/decorator';
import { join } from "path";

@Configuration({
  importConfigs: [
    join(__dirname, 'config.default')
  ],
  namespace: 'mod1'
})
export class Mod1Configuration {}
