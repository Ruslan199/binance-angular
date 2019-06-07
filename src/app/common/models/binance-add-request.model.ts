import { KlineInterval } from "../enum/kline-interval.enum";

export class BinanceAddRequest {
    public pair: string;
    public interval: KlineInterval;
}