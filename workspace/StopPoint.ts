import {Bus} from "./Bus";
import {getNextBusesForStopPoint, getStopPointName} from "./apiHandler";
import log4js = require('log4js');


const logger = log4js.getLogger();


export class StopPoint {
    nextBuses: Bus[];
    stopPointId: string;
    commonName: string;

    constructor(stopPointId: string) {
        this.stopPointId = stopPointId;
        logger.info('Created StopPoint: ' + stopPointId)
    }

    getCommonName(): Promise<string> {
        return getStopPointName(this.stopPointId);

        //
        // logger.debug('GETTING COMMON NAMEEEEEEEEEEEEEEEE');
        // if (this.commonName != null) {
        //     logger.debug('common name not null'+ this.commonName);
        //     return Promise.resolve(this.commonName)
        // } else {
        //     logger.debug('do you see me?');
        //     return getStopPointName(this.stopPointId).next(stopPointName => {
        //         this.commonName = stopPointName;
        //         logger.debug('Common name set: ' + this.commonName);
        //         return stopPointName
        //     })
        // }

    }

    displayNext(numberToDisplay: number = 5): Promise<string> {
        return this.updateBuses()
            .then(() =>
                this.nextBuses.slice(0, numberToDisplay).map(bus => bus.toString()).join("\n")
            )
    }

    getNextBuses(numberToDisplay: number = 5): Promise<Bus[]> {
        return this.updateBuses()
            .then(() =>
                this.nextBuses.slice(0, numberToDisplay)
            )
    }

    updateBuses(): Promise<boolean> {
        return getNextBusesForStopPoint(this.stopPointId).then(
            (buses) => {
                this.nextBuses = buses.sort((a, b) => Number(a.expectedArrival.isAfter(b.expectedArrival)) * 2 - 1);
                logger.debug("Buses updated for stopPoint: " + this.stopPointId);
                return true
            }
        )
    }
}