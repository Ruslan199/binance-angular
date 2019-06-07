import { KlineInterval } from "../../enum/kline-interval.enum";
import { NumberValueAccessor } from "@angular/forms/src/directives";

export class GetIntervalsKline {
    public name: string;
    public interval: KlineInterval;
    public value: number;
}