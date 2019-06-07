import { KlineInterval } from "src/app/common/enum/kline-interval.enum";
import { Pairs } from "../../enum/pairs.enum";

export class GetDataRequest {
    public pair: Pairs;
    public interval: KlineInterval;
    public startTime: Date;
    public endTime: Date;
}