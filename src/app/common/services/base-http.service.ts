import { environment } from "../../../environments/environment";

export class BaseHttpService {
    public apiUrl: string = environment.apiEndpoint;
}