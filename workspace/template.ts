import {Bus} from "./Bus";
import {StopPoint} from "./StopPoint";
import {findStopPointsNearLocation, getLocationOfPostcode} from "./apiHandler";
import construct = Reflect.construct;

export class Template {

    public run(): void {
        console.log("Hello world!")


        //let stopPoint = new StopPoint('490008660N');

        //stopPoint.displayNext(5);

        getLocationOfPostcode("SW1A1AA")
            .then(latlon => findStopPointsNearLocation(latlon, 200))
            .then(stops => stops.forEach(s => console.log(s)));


    }
}

