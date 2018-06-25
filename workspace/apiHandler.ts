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

    return rp(options)
        .then(results => results.map(jsonObject => new Bus(jsonObject))
        );
}

export interface LatitudeLongitude {
    latitude: number;
    longitude: number;
}

export function getLocationOfPostcode(postcode: string): Promise<LatitudeLongitude> {
    const options = {
        uri: 'http://api.postcodes.io/postcodes/' + postcode,
        json: true
    };

    logger.debug("Getting location of postcode: " + postcode);
    let x = rp(options)
        .then(results => ({
            latitude: Number(results["result"]["latitude"]),
            longitude: Number(results["result"]["longitude"])
        }));
    return x
}

export function findStopPointsNearLocation(location: LatitudeLongitude, radius: number = 500): Promise<string[]> {
    //https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&radius=200&useStopPointHierarchy=true&modes=bus&location.lat=52.212981&location.lon=0.103145
    const options = {
        uri: 'https://api.tfl.gov.uk/StopPoint',
        qs: {
            stopTypes: "NaptanPublicBusCoachTram",
            radius: radius.toString(),
            useStopPointHierarchy: "true",
            modes: "bus",
            lat: location.latitude,
            lon: location.longitude,
            app_id: 'cc0a77bc',
            app_key: '5e599ef309e3541b8922e2343db854ff',
        },
        // headers: {
        //     'User-Agent': 'Request-Promise'
        // },
        json: true // Automatically parses the JSON string in the response
    };
    logger.debug("Getting bus stops near: " + JSON.stringify(location) + ' with radius: ' + radius.toString());

    return rp(options)
        .then(response => response["stopPoints"].map(stop => stop["naptanId"]))
}

export function getStopPointsByName(name: string): Promise<string[]> {
    const options = {
        uri: 'https://api.tfl.gov.uk/StopPoint/Search',
        qs: {
            query: name,
            stopTypes: "NaptanPublicBusCoachTram",
            app_id: 'cc0a77bc',
            app_key: '5e599ef309e3541b8922e2343db854ff',
        },
        // headers: {
        //     'User-Agent': 'Request-Promise'
        // },
        json: true // Automatically parses the JSON string in the response
    };

    return rp(options)
        .then(response => response["matches"].map(match => match["id"]))
}


export function getStopPointName(stopPointId: string):Promise<string> {
    // https://api.tfl.gov.uk/StopPoint/490008660S

    const options = {
        uri: 'https://api.tfl.gov.uk/StopPoint/' + stopPointId,
        qs: {
            app_id: 'cc0a77bc',
            app_key: '5e599ef309e3541b8922e2343db854ff',
        },
        json: true // Automatically parses the JSON string in the response
    };
    logger.debug("Getting bus stop name of stopPointId: " + stopPointId);

    return rp(options)
        .then(response => response["commonName"])
}