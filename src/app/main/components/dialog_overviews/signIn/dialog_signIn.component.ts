import { Component, EventEmitter, Output, ViewChild, OnInit, Input } from '@angular/core';
import { MainService } from '../../../services/main.service';
import 'rxjs/add/operator/takeWhile';
import { MatDialogRef } from '@angular/material';
import { MyDatePicker } from 'mydatepicker';
import { AuthRequest } from 'src/app/common/models/request/auth-request.model';
import { LoginService } from 'src/app/main/services/login.service';
import { WebSocketService } from 'src/app/main/services/websocket.service';
import { findSafariExecutable } from 'selenium-webdriver/safari';


@Component({
    selector: 'app-mainn',
    templateUrl: 'dialog_signIn.component.html',
    styleUrls: ['dialog_signIn.component.css']
})
export class DialogOverviewSignIn implements OnInit{

    public userName: string;
    public password: string;
    public confirmPassword: string;
    public userLogin: string;
    public Login: string;
    public jwt: string;
    public log: string;
    public visiter: string;
    public errorUser: string;
    public socketID: string;

    public enteredQuestions: boolean;
    public buy: boolean 
    public error: boolean;

    @Output() change = new EventEmitter();
    @ViewChild('mydp',{static: false}) mydp: MyDatePicker;

    constructor(public dialogRef: MatDialogRef<DialogOverviewSignIn>,
                private mainService: MainService, 
                private loginService: LoginService,
                private websocket: WebSocketService,)
    {
      this.loginService.currentMessage.subscribe(message=>this.jwt = message);
      this.loginService.currentMessagee.subscribe(message=>this.log = message);
      //this.loginService.currentEnter.subscribe(entered=>this.enteredQuestions = entered);
    }
    ngOnInit()
    {
        this.buy = false;
        this.enteredQuestions = false;
        this.error = false;
    }
    ngAfterViewInit(){

    }
    newMessage(val:string)
    {
      this.loginService.changeMessage(val);
    }
    newLog(val: string)
    {
        this.loginService.changeLog(val);
    }
    Entered(bool: boolean)
    {
        this.loginService.Entered(bool);
    }
    
    onNoClick(): void {
       this.dialogRef.close();
    }
    NoClick(): void {
        this.buy = false;
        this.error = false;
    }
    onName(event: KeyboardEvent) {
        this.userName = (<HTMLInputElement>event.target).value;
    }
    onPassword(event: KeyboardEvent) {
        this.password = (<HTMLInputElement>event.target).value;
    }
    public LoadUser()
    {
        let user = this.visiter;
        return user;
    }
    public UnknowUser()
    {
        let user = this.errorUser;
        return user;
    }
/*
    public LoadSocketMessage()
    {
        this.websocket.openDepthStreamData();
        this.websocket.depthStreamMessage3
        .subscribe(message => {
            if(message != null){
                this.socketID = message.data;
             }
        });
    }
*/
    public sendRequest() {
        
        const req = new AuthRequest();
        req.login = this.userName;
        req.password = this.password;
        req.socketId = window.localStorage.getItem("socketId");
      
            this.mainService
            .Authorization(req)
                .subscribe(res => {
                    if (!res.success) {
                    console.log(res.message);
                    this.error = true;
                    this.errorUser = res.message;
                    return;
                }
                else{
                    this.newMessage(res.message);
                    window.localStorage.setItem("key",res.message);
                    window.localStorage.setItem("UserName",req.login);
                    this.newLog(req.login);
                    this.Entered(true);
                    this.buy = true;
                    this.error = false;
                    this.visiter = res.login;
                }
            });
    }
      
}

  
