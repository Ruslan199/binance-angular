import { KlineInterval } from "../../enum/kline-interval.enum";

export class PirceListRequest {
    public pair: string;
    public interval: KlineInterval;
}