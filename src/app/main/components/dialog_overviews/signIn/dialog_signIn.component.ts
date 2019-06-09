import { Component, EventEmitter, Output, ViewChild, OnInit } from '@angular/core';
import { MainService } from '../../../services/main.service';
import 'rxjs/add/operator/takeWhile';
import { MatDialogRef } from '@angular/material';
import {  MyDatePicker } from 'mydatepicker';
import { UserSignInRequest } from 'src/app/common/models/request/user-signin-request.model';
import { WebSocketService } from 'src/app/main/services/websocket.service';

@Component({
    selector: 'app-mainn',
    templateUrl: 'dialog_signIn.component.html',
    styleUrls: ['dialog_signIn.component.css']
})
export class DialogOverviewSignIn implements OnInit{

    public userName: string;
    public password: string;
    public confirmPassword: string;

    public buy: boolean 

    @Output() change = new EventEmitter();
    @ViewChild('mydp') mydp: MyDatePicker;

    constructor(public dialogRef: MatDialogRef<DialogOverviewSignIn>, private mainService: MainService, private websocket: WebSocketService)
    {
  
    }
    ngOnInit()
    {
        this.buy = false;
    }
    
    onNoClick(): void {
       this.dialogRef.close();
    }
    NoClick(): void {
        this.buy = false;
    }
    onName(event: KeyboardEvent) {
        this.userName = (<HTMLInputElement>event.target).value;
    }
    onPassword(event: KeyboardEvent) {
        this.password = (<HTMLInputElement>event.target).value;
    }
    
    public sendRequest() {
        
        const req = new UserSignInRequest();
        req.userName = this.userName;
        req.password = this.password;

        
            this.mainService
            .signInUser(req)
                .subscribe(res => {
                    if (!res.success) {
                    console.log(res.message);
                    console.log("Произошла какая-то ошибка");
                    return;
                }
                else{
                    
                }
            });
        }
        public LoadSocket(){
            this.websocket.openDepthStreamData();
           
            this.websocket.depthStreamMessage3
            .subscribe(message => {
                if(message == null){
                    return;
                 }
                 //this.twentyFour = JSON.parse(message.data);
                 console.log(message);
            });
        }
}

  
