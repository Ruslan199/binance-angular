import { KlineInterval } from "../../enum/kline-interval.enum";
import { Pairs } from "../../enum/pairs.enum";

export class DataOfAlgoritmRequest {
    public time: Date;
    public interval: KlineInterval;
    public pair: Pairs;
    public klinesCount: number;
    public inaccuracy: number;
    public value: number;
}