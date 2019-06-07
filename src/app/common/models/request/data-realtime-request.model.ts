import { KlineInterval } from "../../enum/kline-interval.enum";
import { Pairs } from "../../enum/pairs.enum";

export class DataOfRealTimeRequest {
    public time: Date;
    public interval: KlineInterval;
    public pair: Pairs;
    public inaccuracy: number;
    public value: number;
}