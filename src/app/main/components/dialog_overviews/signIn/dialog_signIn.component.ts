import { Component, EventEmitter, Output, ViewChild, OnInit, Input } from '@angular/core';
import { MainService } from '../../../services/main.service';
import 'rxjs/add/operator/takeWhile';
import { MatDialogRef } from '@angular/material';
import {  MyDatePicker } from 'mydatepicker';
import { AuthRequest } from 'src/app/common/models/request/auth-request.model';
import { LoginService } from 'src/app/main/services/login.service';


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

    public buy: boolean 
    public error: boolean;

    @Output() change = new EventEmitter();
    @ViewChild('mydp') mydp: MyDatePicker;

    constructor(public dialogRef: MatDialogRef<DialogOverviewSignIn>,
                private mainService: MainService, 
                private loginService: LoginService)
    {
      this.loginService.currentMessage.subscribe(message=>this.jwt = message);
      this.loginService.currentMessagee.subscribe(message=>this.log = message);
    }
    ngOnInit()
    {
        this.buy = false;
        this.error = false;
    }
    newMessage(val:string)
    {
      this.loginService.changeMessage(val);
    }
    newLog(val: string)
    {
        this.loginService.changeLog(val);
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
        //let user = this.message;
        //return user;
    }
    
    public sendRequest() {
        
        const req = new AuthRequest();
        req.login = this.userName;
        req.password = this.password;
      
            this.mainService
            .Authorization(req)
                .subscribe(res => {
                    if (!res.success) {
                    console.log(res.message);
                    this.error = true;
                    return;
                }
                else{

                    this.newMessage(res.message);
                    this.newLog(req.login);
                    this.buy = true;
                    this.error = false;

                    //this.jwt = res.message;
                    //this.newMessage(this.jwt)
                    //console.log(this.jwt);
                }
            });
    }
      
}

  
