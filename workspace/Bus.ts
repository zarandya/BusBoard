import {Moment} from "moment";
import moment = require("moment");
import log4js = require('log4js');

const logger = log4js.getLogger();


export class Bus {
    expectedArrival: Moment;
    vehicleId: string;
    lineId: string;
    destinationName: string;

    constructor (jsonObject: object) {
        this.expectedArrival = moment(jsonObject['expectedArrival']);
        this.vehicleId = jsonObject['vehicleId'];
        this.lineId = jsonObject['lineId'];
        this.destinationName = jsonObject['destinationName'];

        logger.info('Created Bus: ' + JSON.stringify(this))
    }


    toString (): string {
        return 'Bus: \tExp.Arrival: ' + this.expectedArrival.format('HH:mm:ss, DD/MM') +
            '\tvehicleId: ' + this.vehicleId +
            '\tlineId: ' + this.lineId +
            '\tdestinationName: ' + this.destinationName
    }

}