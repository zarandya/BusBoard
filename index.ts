import {Template} from './workspace/template'
import log4js = require('log4js');

log4js.configure({
    appenders: [
        {type: 'console'},
        {type: 'fileSync', filename: 'logs/debug.log'}
    ]
});

const logger = log4js.getLogger("test");
logger.debug("test");
logger.warn("test");
logger.error("test");
logger.info("test");

export class Index {
    public static main(): number {
        const template = new Template();
        template.run();

        return 0;
    }
}

Index.main();