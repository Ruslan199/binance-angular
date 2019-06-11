import { Component, EventEmitter, Output, ViewChild, OnInit } from '@angular/core';
import { MainService } from '../../../services/main.service';
import { KlineInterval } from 'src/app/common/enum/kline-interval.enum';
import 'rxjs/add/operator/takeWhile';
import { Pairs } from 'src/app/common/enum/pairs.enum';
import { MatDialogRef } from '@angular/material';
import {  MyDatePicker } from 'mydatepicker';
import { UserRegistrationRequest } from 'src/app/common/models/request/user-registration-request.model';

@Component({
    selector: 'app-mainn',
    templateUrl: 'dialog_registration.component.html',
    styleUrls: ['dialog_registration.component.css']
})
export class DialogOverviewRegistration implements OnInit{

    public userName: string;
    public mail: string;
    public password: string;
    public confirmPassword: string;

    public buy: boolean 

    @Output() change = new EventEmitter();
    @ViewChild('mydp') mydp: MyDatePicker;

    constructor(public dialogRef: MatDialogRef<DialogOverviewRegistration>, private mainService: MainService)
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
    onMail(event: KeyboardEvent) {
        this.mail = (<HTMLInputElement>event.target).value;
    }
    onPassword(event: KeyboardEvent) {
        this.password = (<HTMLInputElement>event.target).value;
    }
    onConfirm(event: KeyboardEvent) {
        this.confirmPassword = (<HTMLInputElement>event.target).value;
    }
    
    public Registration(value: string)
    {
        let user = value;
        return user;
    }


    public sendRequest() {
        
        const req = new UserRegistrationRequest();

        req.mail = this.mail;
        req.userName = this.userName;
        req.password = this.password;

        if(this.confirmPassword === this.password)
        {
            this.mainService
            .createUser(req)
                .subscribe(res => {
                    if (!res.success) {
                    return;
                }
                else{
                    this.Registration("Вы успешно зарегестрировались")
                }
            });
        }
        else{
            console.log("Ошибка пароли не совпадают");
        }
    }
  }

  
