import rp = require('request-promise-native');
import {Bus} from "./Bus";
import log4js = require('log4js');


const logger = log4js.getLogger();


export function getNextBusesForStopPoint(stopPointId: string): Promise<Bus[]> {
    logger.debug('API uri: ' + 'https://api.tfl.gov.uk/StopPoint/' + stopPointId + '/Arrivals')
    const options = {
        uri: 'https://api.tfl.gov.uk/StopPoint/' + stopPointId + '/Arrivals',
        qs: {
            app_id: 'cc0a77bc',
            app_key: '5e599ef309e3541b8922e2343db854ff',
        },
        // headers: {
        //     'User-Agent': 'Request-Promise'
        // },
        json: true // Automatically parses the JSON string in the response
    };

    let nextBusesPromise = rp(options)
        .then(results => results.map(jsonObject => new Bus(jsonObject))
        )
        .catch(function (err) {
            logger.error('API call failed.');
            logger.error(err.message);
        });

    return nextBusesPromise
}