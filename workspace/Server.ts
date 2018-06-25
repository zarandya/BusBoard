import express = require('express')
import {findStopPointsNearLocation, getLocationOfPostcode, getStopPointName, getStopPointsByName} from "./apiHandler";
import {StopPoint} from "./StopPoint";

import log4js = require('log4js');


const logger = log4js.getLogger();

function closestStops(req, res) {
    if (req.query.hasOwnProperty('postcode')) {
        getLocationOfPostcode(req.query['postcode'])
            .then(location => findStopPointsNearLocation(location, 500))
            .then(stops => stops.slice(0, 2).map(stop => new StopPoint(stop)))
            .then(stopPoints => stopPoints.map(getNameAndBusesPromises))
            .then(stopPointPromises => Promise.all(stopPointPromises))
            .then(outputBusArray => {
                logger.debug(outputBusArray);
                res.type("json");
                res.send((outputBusArray));
            })
            .catch(err => res.send(err))
    }
}

function getStopNameSuggestions(req, res) {
    logger.debug(`Autocomplete: request received: ${req.queryString}`);
    if (req.query.hasOwnProperty('queryString')) {
        getStopPointsByName(req.query['queryString'])
            .then(stopIds => stopIds.map(getStopPointName))
            .then(busStopNames => Promise.all(busStopNames))
            .then(busStopNames => {
                res.type('json');
                res.send(busStopNames.sort().filter(function(item, pos, ary) {
                    return !pos || item != ary[pos - 1];
                }));
                logger.debug(`Autocomplete: response sent ${busStopNames}`)
            })
            .catch(err => res.send(err))
    }
}

function getBusesByStopName(req, res) {
    if (req.query.hasOwnProperty('name')) {
        getStopPointsByName(req.query['name'])
            .then(stops => stops.map(stop => new StopPoint(stop)))
            .then(stopPoints => stopPoints.map(getNameAndBusesPromises))
            .then(stopPointPromises => Promise.all(stopPointPromises))
            .then(outputBusArray => {
                logger.debug(outputBusArray);
                res.type("json");
                res.send((outputBusArray));
            })
            .catch(err => res.send(err))
    }
}

export function startServer() {
    const app = express();
    const rootFolder = 'C:\\Users\\ALZ\\IdeaProjects\\BusBoard';
    const options = {
        root: rootFolder
    };

    app.get('/', (req, res) => res.send('Hello World!'));
    app.get('/closestStops', closestStops);
    app.get('/autocomplete', getStopNameSuggestions);
    app.get('/getBusStop', getBusesByStopName);
    app.get('/index.html', (req, res) => {
        res.sendFile('index.html', options)
    });
    app.get('/script.js', (req, res) => {
        res.sendFile('script.js', options)
    });
    app.get('/style.css', (req, res) => {
        res.sendFile('style.css', options)
    });

    app.listen(3000, () => console.log('BusBoard listening on port 3000!'))
}


function getNameAndBusesPromises(stopPoint): Promise<StopPoint> {
    return stopPoint.getCommonName().then(stopPointCommonName => {
        stopPoint.commonName = stopPointCommonName;
        logger.debug(stopPointCommonName);
        return stopPoint.getNextBuses(5);
    }).then(nextBuses => {
        stopPoint.nextBuses = nextBuses;
        return stopPoint
    })
}

