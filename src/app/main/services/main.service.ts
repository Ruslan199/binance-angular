import { Injectable } from "@angular/core";
import { Http, URLSearchParams,Headers, RequestOptions } from "@angular/http";
import { BaseHttpService } from "src/app/common/services/base-http.service";
import { Observable } from "rxjs";
import "rxjs/add/operator/map";
import { Binance24HPricesListResponse } from "src/app/common/models/response/binance-24hprices-list-response.model";
import 'rxjs/add/operator/takeWhile';
import { PirceListRequest } from "src/app/common/models/request/price-list-request.model";
import { DataOfAlgoritmRequest } from "src/app/common/models/request/data-algoritm-request.model";
import { KlineResponse } from "src/app/common/models/response/kline-response.model";
import { DataOfRealTimeRequest } from "src/app/common/models/request/data-realtime-request.model";
import { UserRegistrationRequest } from "src/app/common/models/request/user-registration-request.model";
import { AuthRequest } from "src/app/common/models/request/auth-request.model";
import { AuthResponse } from "src/app/common/models/response/auth-response.model";
import { DeleteTimerUser } from "src/app/common/models/request/delete-request.model";


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

    public getRealTime(request: DataOfRealTimeRequest, jwt: string): Observable<KlineResponse> {
       
        let header = new Headers({'Content-Type': 'application/json'});  
        header.append('Authorization','Bearer '+ jwt);
        let options = new RequestOptions({ headers: header });
     
        return this.http.post(`${this.apiUrl}/real/RealTime`, request, options)
        .map(response => response.json());  
    }

    public DeleteTimerUser(request: DeleteTimerUser, jwt: string): Observable<KlineResponse>
    {
        let header = new Headers({'Content-Type': 'application/json'});  
        header.append('Authorization','Bearer '+ jwt);
        let options = new RequestOptions({ headers: header });
     
        return this.http.post(`${this.apiUrl}/real/DeleteUserTimer`, request, options)
        .map(response => response.json());  
    }

    public exit(request: DataOfRealTimeRequest, jwt: string): Observable<KlineResponse> {
       
        let header = new Headers({'Content-Type': 'application/json'});  
        header.append('Authorization','Bearer '+ jwt);
        let options = new RequestOptions({ headers: header });
     
        return this.http.post(`${this.apiUrl}/user/Exit`, request, options)
        .map(response => response.json());  
    }
    
    public createUser(request: UserRegistrationRequest): Observable<KlineResponse> {
        return this.polledBitcoin$ = this.http.post(`${this.apiUrl}/user/registration`, request)
        .map(response => response.json());  
    }

    public Authorization(request: AuthRequest): Observable<AuthResponse> {
        return this.polledBitcoin$ = this.http.post(`${this.apiUrl}/user/authorization`, request)
        .map(response => response.json()); 
    }

    public StartAlgoritm(request: DataOfAlgoritmRequest): Observable<KlineResponse>{

        return this.polledBitcoin$ = this.http.post(`${this.apiUrl}/main/StartAlgoritm`, request)
        .map(response => response.json());  
    }
 }

