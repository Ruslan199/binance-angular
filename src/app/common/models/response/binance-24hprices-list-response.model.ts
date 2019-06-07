import { ResponseModel } from "../response.model";


export class Binance24HPricesListResponse extends ResponseModel {
    public volume: number;
    public volumeBTC: number;
    public percent: number;
    public priceChangePercent: number;
    public quoteVolume: number;
}