import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class LoginService
{
    private messageSource = new BehaviorSubject<string>("");
    currentMessage  = this.messageSource.asObservable();

    constructor(){}

    changeMessage(message: string)
    {
        this.messageSource.next(message);
    }
}