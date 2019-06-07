import { ResponseModel } from "src/app/common/models/response.model";
import { BinanceKline } from "src/app/common/models/response/data-from-array.model";


export class DocumentResponse extends ResponseModel {
    public dataPrice: BinanceKline[];
}
