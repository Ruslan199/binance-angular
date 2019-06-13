import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class LoginService
{
    private messageSource = new BehaviorSubject<string>("default message");
    currentMessage  = this.messageSource.asObservable();

    private messageLogin = new BehaviorSubject<string>("default message login");
    currentMessagee  = this.messageLogin.asObservable();

    constructor(){}

    changeMessage(message: string)
    {
        this.messageSource.next(message);
    }
    changeLog(message: string)
    {
        this.messageLogin.next(message);
    }
}