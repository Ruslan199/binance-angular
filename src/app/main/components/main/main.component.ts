import { Component, OnInit, AfterViewInit, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { MainService } from '../../services/main.service';
import { KlineInterval } from 'src/app/common/enum/kline-interval.enum';
import { Binance24HPricesListResponse } from 'src/app/common/models/response/binance-24hprices-list-response.model';
import 'rxjs/add/operator/takeWhile';
import { GetPair } from 'src/app/common/models/request/get-pair.model';
import { WebSocketService } from '../../services/websocket.service';
import { PirceListRequest } from 'src/app/common/models/request/price-list-request.model';
import { GetIntervals } from 'src/app/common/models/request/get-intervals.models';
import { Pairs } from 'src/app/common/enum/pairs.enum';
import { WebsocketResponse } from 'src/app/common/models/response/websocket-response.model';
import { TwentyFourResponse } from 'src/app/common/models/response/websocket-24hprice-response.model';
import {MatDialog } from '@angular/material';
import { GetIntervalsKline } from 'src/app/common/models/request/get-interval-kline.model';
import { DataOfRealTimeRequest } from 'src/app/common/models/request/data-realtime-request.model';
import { DialogOverviewComponent } from '../dialog_overviews/history/dialog_history.component';
import { DialogOverviewRegistration } from '../dialog_overviews/registration/dialog_registration.component';
import { DialogOverviewSignIn } from '../dialog_overviews/signIn/dialog_signIn.component';
import { LoginService } from '../../services/login.service';
import { DataForAlgoritm } from 'src/app/common/models/request/start-algoritm.model';
import { DeleteTimerUser } from 'src/app/common/models/request/delete-request.model';
import { ExitUserRequest } from 'src/app/common/models/request/exit-user-request.model';
import { CheckCurrentUserRequest } from 'src/app/common/models/request/check-currentUser-request.model';

@Component({
  	selector: 'app-main',
  	templateUrl: 'main.component.html',
  	styleUrls: ['main.component.css']
})
export class MainComponent implements OnInit, AfterViewInit {

    public priceList: Binance24HPricesListResponse;
    public selectedPair: string;
    public filters: Filters = new Filters();
    public filtersTwo: Filters = new Filters();
    public klineData: WebsocketResponse;
    public twentyFour: TwentyFourResponse;
    public visible: boolean;
    public visibleTable: boolean;
    public show: boolean = false;
    public example: boolean;
    public jwt: string;
    public socketID: string;
    public log: string;
    public close: boolean = false;
    public responseSocket: string;
    public entered: boolean = false;
    public deleteUserId: number;
    public local: boolean = false;

    public audio = new Audio();
    public i = 0;
    public j = 0;

    public pairAlgoritm: Pairs;
    public intervalAlgoritm: KlineInterval;
    public intervalsName: string;
    public inputAlgoritm: number;
    public pairAlgoritmString: string;
    public value: number; 
    public login: string;
    public showSignal: boolean;
    public workOne: boolean = false;
    public enteredQuestions: boolean;
    public userId: number;
    public enterFirstTime: string;


    public selectedpair: string[] = [
        "GVTBTC","IOTXBTC","STRATBTC","XRPBTC","WAVESBTC","CMTBTC","BTCUSDT"
    ];


    @Output() change = new EventEmitter();

   // public dataForClient: DataForAlgoritm[] = [];
    public localeForClient: DataForAlgoritm[] = [];
    

	pairs: GetPair[] = [
		{ name: "GVTBTC",  pair: Pairs.GVTBTC},
		{ name: "IOTXBTC", pair:   Pairs.IOTXBTC },
		{ name: "STRATBTC", pair:  Pairs.STRATBTC },
		{ name: "XRPBTC", pair:  Pairs.XRPBTC },
        { name: "WAVESBTC", pair:  Pairs.WAVESBTC },
        { name: "CMTBTC", pair:  Pairs.CMTBTC },
        { name: "BTCUSDT", pair:  Pairs.BTCUSDT },
		{ name: "EOSBTC", pair:  Pairs.EOSBTC },
		{ name: "TRXBTC", pair:  Pairs.TRXBTC },
		{ name: "ADABTC", pair:  Pairs.ADABTC }
    ];
    

    intervals: GetIntervals[] = [
          { name: "1 минута", interval: "1m" },
          { name: "5 минут", interval: "5m" },
          { name: "15 минут", interval: "15m" },
          { name: "30 минут", interval: "30m" },
          { name: "1 час", interval: "1h" },
          { name: "4 часа", interval: "4h" },
          { name: "8 часов", interval: "8h" },
          { name: "12 часов", interval: "12h" },
          { name: "24 часa", interval: "1d" },
          { name: "48 часов", interval: "3d" }
    ];
    intervalsAlgoritm: GetIntervalsKline[] = [
        { name: "5 минут", interval: KlineInterval.FiveMinutes,value: 5 },
        { name: "15 минут", interval: KlineInterval.FiveteenMinutes,value: 15 },
        { name: "1 час", interval: KlineInterval.OneHour,value: 60 },
        { name: "4 часа", interval: KlineInterval.FourHour,value: 240 },
        { name: "24 часa", interval: KlineInterval.OneDay,value: 1440 }
    ];

    
    constructor(private mainService: MainService, 
                private websocket: WebSocketService,
                public dialog: MatDialog,
                private loginService: LoginService,
                private cdr: ChangeDetectorRef)
    { 
        this.loginService.currentMessage.subscribe(message=>this.jwt = message);
        this.loginService.currentMessagee.subscribe(message=>this.log = message);
        this.loginService.currentEnter.subscribe(message=>this.enteredQuestions = message);
    }
    
    ngOnInit()
    {
        this.CheckUser();
        this.filters.intervalFilter.value = this.intervals[0].interval;
        this.filters.pairFilter.value = this.pairs[0].name;
        this.filtersTwo.pairFilter.value = this.pairs[0].pair;

        this.localeForClient = JSON.parse(window.localStorage.getItem("realTime"));
        this.filtersTwo.intervalFilter.value = this.intervalsAlgoritm[0].interval;
        this.intervalsName = this.intervalsAlgoritm[0].name;
        
        if(window.localStorage.getItem("key") == null){
            this.visible = false;
            this.visibleTable = false;
            this.show = false;
            document.getElementById('display__table').style.display = "none";
        }
        else{

            this.visible = true;
            this.enteredQuestions = true;
            document.getElementById('display__table').style.display = "block";
        }
    }
    
    ngAfterViewInit()
    {
        this.setPair(this.filters.pairFilter.value);
        this.setInterval(this.filters.intervalFilter.value);
        this.LoadSocketPair(this.filters.pairFilter.value,this.filters.intervalFilter.value);
        this.LoadSocketMessage();
        this.setIntervalAlgoritm(this.filtersTwo.intervalFilter.value);
        this.setPairAlgoritm(this.filtersTwo.pairFilter.value);
        this.dataTime();
        this.cdr.detectChanges();
    }
    ngOnDestroy()
    {
      this.websocket.dispose();
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(DialogOverviewComponent, {
          width: '450px',
          height: '480px',
        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
    }
    openDialogRegistration(): void {
        const dialogRef = this.dialog.open(DialogOverviewRegistration, {
            width: '450px',
            height: '440px',
          });
    }
    openDialogSignIn(): void {
        const dialogRef = this.dialog.open(DialogOverviewSignIn, {
            width: '450px',
            height: '440px',
          });
    }
    opDialog(): void {

        if(this.visible != true){
            document.getElementById('display_none').style.display = "block";
            this.visible = true;
        }
        else{
            document.getElementById('display_none').style.display = "none";
            this.visible = false;
        }
    }
    opDialogTable(): void {
        if(this.visibleTable != true){
            document.getElementById('display__table').style.display = "block";
            this.visibleTable = false;
        }
        else{
            document.getElementById('display__table').style.display = "none";
            this.visibleTable = true;
        }
    }
    closeWindow()
    {
        this.audio.pause();
      if(this.showSignal){
        document.getElementById('signal').style.display = "block";
        this.showSignal = false;
        }
      else{
        document.getElementById('signal').style.display = "none";
      }
    }
    public setInterval(interval: KlineInterval): void
    {
        this.filters.intervalFilter.value = interval;
    }
     
    public setPair(pair: string): void
    {
        this.filters.pairFilter.value = pair;
    }

    LoadUser(){
        let user = window.localStorage.getItem("UserName");
        
        document.getElementById('exit').style.display = "block";
        return user;
    }
    playAudio(){
        this.audio.src = "../../../assets/audio/590cs.wav";
        this.audio.load();
        this.audio.play();
    }

    public setIntervalAlgoritm(interval: KlineInterval): void
    {
        this.filtersTwo.intervalFilter.value = interval;
        this.intervalAlgoritm = interval;
        this.intervalsName = this.intervalsAlgoritm.find(item=>item.interval == interval).name.toString();
        this.value = this.intervalsAlgoritm.find(item=>item.interval == interval).value;
    }


    public setPairAlgoritm(pair: Pairs): void
    {
        this.filtersTwo.pairFilter.value = pair;
        this.pairAlgoritm = pair;   
        this.pairAlgoritmString = this.pairs.find(item=>item.pair == pair).name;
    }

    onKeyInaccuracy(event: KeyboardEvent) {
        var inaccuracy = (<HTMLInputElement>event.target).value;
        this.inputAlgoritm = parseFloat(inaccuracy);
    }

    public LoadSocketMessage()
    {
        this.websocket.openDepthStreamData();
        this.websocket.depthStreamMessage3
        .subscribe(message => {
            if(message == null){
             }
             else{
                this.socketID = message.data;
                if(window.localStorage.getItem("key") == null)
                {
                    window.localStorage.setItem("socketId",message.data);
                }
            
                if(this.close != true){
                    this.close = true;
                }
                if(this.workOne != false){
                this.showSignal = true;
                this.responseSocket = message.data;
                this.playAudio();
                console.log(this.responseSocket);
                }
                this.workOne = true;
             }
        });
    }
    
    public LoadSocketPair(pair: string, interval: string){
        this.websocket.openDepthStream(this.filters.pairFilter.value, this.filters.intervalFilter.value);
       
        this.websocket.depthStreamMessage
            .subscribe(message => {
                if(message == null){
                   return;
                }
                this.klineData = JSON.parse(message.data);
        });

        this.websocket.depthStreamMessage2
        .subscribe(message => {
            if(message == null){
                return;
             }
             this.twentyFour = JSON.parse(message.data);
        });
    }
    public sendRequest(): void
    {
      //this.opDialogTable(); 
      document.getElementById('display_none').style.display = "block";
      console.log(this.localeForClient);
      this.localeForClient.push({
          id: this.i++,
          pair: this.pairAlgoritmString,
          interval: this.intervalsName,
          innarcy: this.inputAlgoritm.toString()
      });
      //console.log(this.dataForClient);

      window.localStorage.setItem("realTime", JSON.stringify(this.localeForClient));

//      console.log(JSON.parse(window.localStorage.getItem("realTime")));

      this.RealTime();
    }

    public DeleteTimer(i: number): void{

        console.log(i);
        if(window.localStorage.getItem("key") == null){
            const index: number = this.localeForClient.find(x=>x.id == i).id;
            this.deleteUserId = index;

            if (index !== -1) {
                var l = this.localeForClient.find(x=>x.id== index);
                this.localeForClient.splice(this.localeForClient.findIndex(x=>x.id == i),1);
                this.DeleteUserTimer(); 
            }
        }
        else{
            const index: number = this.localeForClient.find(x=>x.id == i).id;
            this.deleteUserId = index;

            if (index !== -1) {
                var l = this.localeForClient.find(x=>x.id== index);
                this.localeForClient.splice(this.localeForClient.findIndex(x=>x.id == i),1);
                this.DeleteUserTimer(); 
            }
        }
    }

    public DeleteUserTimer(): void {
        const req = new DeleteTimerUser();
        req.userId = this.deleteUserId;
        req.userName = window.localStorage.getItem("UserName");
        var jwt = window.localStorage.getItem("key");

        this.mainService
        .DeleteTimerUser(req,jwt)
        .subscribe(res => {
            if (!res.success) {
                console.log(res.message);
                return;
            }

        });

    }

    public load24HPrice() {
        
        const req = new PirceListRequest();
        req.pair = this.filters.pairFilter.value;
        req.interval = this.filters.intervalFilter.value;

        this.mainService
            .getBinance24HPriceList(req)
            .subscribe(res => {
                if (!res.success) {
                    console.log(res.message);
                    return;
                }
                this.priceList = res;
            });
    }
    public Exit(){

        const req = new ExitUserRequest();
        req.login = window.localStorage.getItem("UserName");
        req.socketId = window.localStorage.getItem("socketId");

        var jwt = window.localStorage.getItem("key");

        this.mainService
        .exit(req,jwt)
        .subscribe(res => {
            console.log(res);
            if (res.status == 401) {
                console.log(res);
                this.enteredQuestions = false;
                window.localStorage.removeItem("key");
            }
            else{
                this.enteredQuestions = false;
                window.localStorage.removeItem("key");
            }
        });
    }
    public CheckUser()
    {
        const req = new CheckCurrentUserRequest();
        req.socketId = window.localStorage.getItem("socketId");

        this.mainService
        .checkUser(req)
        .subscribe(res => {
            if (!res.success) {
                this.enteredQuestions = false;
                window.localStorage.removeItem("key");
                window.localStorage.removeItem("realTime")
                window.localStorage.removeItem("UserName");
                this.localeForClient = null;
                this.visibleTable = false;
            }
        });
    }
    public RealTime(){
        const req = new DataOfRealTimeRequest();

        req.pair = this.filtersTwo.pairFilter.value;
        req.interval = this.intervalAlgoritm;
        req.time = new Date();
        req.inaccuracy = this.inputAlgoritm;
        
        req.value = this.value;
        req.login = window.localStorage.getItem("UserName");
        req.socketId = window.localStorage.getItem("socketId");
        req.userId = this.i - 1;

       // console.log(req.socketId);

        var jwt = window.localStorage.getItem("key");
    
        this.mainService
        .getRealTime(req,jwt)
        .subscribe(res => {
            if (!res.success) {
                console.log(res.message);
                return;
            }
            console.log(res);
        });
    }

    public colorTable(): string {

        let result = JSON.parse(this.klineData.k.v);

        if(result > 0){
            return "color_table_green"
        }
        else{
            return "color_table_red";
        }
    }
    public MathAbs(): string
    {
        let result = JSON.parse(this.klineData.k.v);
        let pair = this.filters.pairFilter.value.slice(0,-3);

        return result + " "+ pair;
    }

    public Pair(): string
    {
        let valueOne = this.filters.pairFilter.value.substring(0,this.filters.pairFilter.value - 3);
        let valueTWo = this.filters.pairFilter.value.substring(this.filters.pairFilter.value - 3);

        return valueOne + "/" + valueTWo;
    }

    
    public dataDay(){
        let now = new Date();

        var day = now.getDate();
        var month = now.getUTCMonth() + 1;
        var year = now.getFullYear();
        return  day + "/" + month + "/" + year//now.getDay() + ":" + now.getMonth() + ":" + now.getFullYear();

    }
    public calculate(){
        let percent: number = (100 * (JSON.parse(this.klineData.k.o) - JSON.parse(this.klineData.k.c)) / JSON.parse(this.klineData.k.o));
        return percent.toFixed(3);
    }
    public dayPercent(){
        let percent = JSON.parse(this.twentyFour.P);
        return percent;
    }

    public dataTime(){
        let time = new Date();   
        return time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    }
    public dayVolume(){
        let volume = this.twentyFour.q;
        return volume;
    }
}

export class Filter
{
    public value: any;
}

export class Filters
{
    public pairFilter: Filter = new Filter();
    public intervalFilter: Filter = new Filter();
}
  