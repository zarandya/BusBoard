import {Bus} from "./Bus";
import {getNextBusesForStopPoint} from "./apiHandler";
import log4js = require('log4js');


const logger = log4js.getLogger();


export class StopPoint {
    nextBuses: Bus[];
    stopPointId: string;

    constructor(stopPointId: string) {
        this.stopPointId = stopPointId;
        this.updateBuses();
        logger.info('Created StopPoint: ' + stopPointId)
    }

    displayNext(numberToDisplay: number = 5) {
        this.updateBuses().then(() => {
            this.nextBuses.slice(0, numberToDisplay).forEach(bus => console.log(bus.toString()))
        })
    }

    updateBuses(): Promise<boolean> {
        return getNextBusesForStopPoint(this.stopPointId).then(
            (buses) => {
                this.nextBuses = buses.sort((a, b) => Number(a.expectedArrival.isAfter(b.expectedArrival)) * 2 - 1);
                return true
            }
        )
    }
}