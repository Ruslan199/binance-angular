import { Injectable } from "@angular/core";
import { Http, URLSearchParams, RequestOptions } from "@angular/http";
import { BaseHttpService } from "src/app/common/services/base-http.service";
import { Observable } from "rxjs";
import "rxjs/add/operator/map";
import { Binance24HPricesListResponse } from "src/app/common/models/response/binance-24hprices-list-response.model";
import 'rxjs/add/operator/takeWhile';
import { PirceListRequest } from "src/app/common/models/request/price-list-request.model";
import { DataOfAlgoritmRequest } from "src/app/common/models/request/data-algoritm-request.model";
import { KlineResponse } from "src/app/common/models/response/kline-response.model";
import { DataOfRealTimeRequest } from "src/app/common/models/request/data-realtime-request.model";

@Injectable()
export class MainService extends BaseHttpService {

    polledBitcoin$: Observable<string>;
    

    constructor(private http: Http) 
    {
        super();
    }
    

        
    public getBinance24HPriceList(request: PirceListRequest): Observable<Binance24HPricesListResponse> {
       
        const url = new URLSearchParams();
        url.append('pair', request.pair);
        url.append('interval', request.interval.toString());
        const options = new RequestOptions();
        options.search = url;

        return this.http.get(`${this.apiUrl}/main`, options)
            .map(response => response.json());
    }

    public getRealTime(request: DataOfRealTimeRequest): Observable<KlineResponse> {
       
        /*
        const url = new URLSearchParams();
        url.append('pair', request.pair);
        url.append('interval', request.interval.toString());
        const options = new RequestOptions();
        options.search = url;
         */

        return this.polledBitcoin$ = this.http.post(`${this.apiUrl}/real/RealTime`, request)
        .map(response => response.json());  
        //return this.http.get(`${this.apiUrl}/real/RealTime`, options)
          //  .map(response => response.json());
    }


    public StartAlgoritm(request: DataOfAlgoritmRequest): Observable<KlineResponse>{

        return this.polledBitcoin$ = this.http.post(`${this.apiUrl}/main/StartAlgoritm`, request)
        .map(response => response.json());  
    }
 }

