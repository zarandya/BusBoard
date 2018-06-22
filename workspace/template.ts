import {Bus} from "./Bus";
import {StopPoint} from "./StopPoint";

export class Template {

    public run(): void {
        console.log("Hello world!")


        let stopPoint = new StopPoint('490008660N');

        stopPoint.displayNext(5);


    }
}

