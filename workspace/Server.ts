import express = require('express')
import {findStopPointsNearLocation, getLocationOfPostcode} from "./apiHandler";
import {StopPoint} from "./StopPoint";

import log4js = require('log4js');


const logger = log4js.getLogger();

export function startServer() {
    const app = express();
    const rootFolder = 'C:\\Users\\ALZ\\IdeaProjects\\BusBoard';
    const options = {
        root: rootFolder
    };

    app.get('/', (req, res) => res.send('Hello World!'));
    app.get('/closestStops', (req, res) => {

        getLocationOfPostcode(req.query['postcode'])
            .then(location => findStopPointsNearLocation(location, 500))
            .then(stops => stops.slice(0, 2).map(stop => new StopPoint(stop)))
            .then(stopPoints => stopPoints.map(getNameAndBusesPromises))
            .then(stopPointPromises => Promise.all(stopPointPromises))
            .then(outputBusArray => {
                logger.debug(outputBusArray)
                res.type("json");
                res.send(JSON.stringify(outputBusArray));
            })
            .catch(err => res.send(err))
    });
    app.get('/index.html', (req, res) => {
        res.sendFile('index.html', options)
    });
    app.get('/script.js', (req, res) => {
        res.sendFile('script.js', options)
    });

    app.listen(3000, () => console.log('BusBoard listening on port 3000!'))
}


function getNameAndBusesPromises(stopPoint): Promise<StopPoint> {
    return stopPoint.getCommonName().then(stopPointCommonName => {
        stopPoint.commonName = stopPointCommonName;
        logger.debug(stopPointCommonName);
        return stopPoint.getNextBuses();
    }).then(_arg => stopPoint)
}

