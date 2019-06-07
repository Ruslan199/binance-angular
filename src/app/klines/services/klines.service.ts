import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { BaseHttpService } from "src/app/common/services/base-http.service";
import { Observable } from "rxjs";
import "rxjs/add/operator/map";
import { GetDataRequest } from "src/app/common/models/request/get-data-request.model";
import { DocumentResponse } from "src/app/common/models/response/document-response.model";



@Injectable()
export class KlineService extends BaseHttpService {

    polledBitcoin$: Observable<number>;
    

    constructor(private http: Http) 
    {
        super();
    }
    
   
    public getData(request: GetDataRequest): Observable<DocumentResponse> {
        
        return this.polledBitcoin$ = this.http.post(`${this.apiUrl}/main/GetData`, request)
            .map(response => response.json());  
    }
    
 }

