import { Component, OnInit, AfterViewInit, EventEmitter, Output } from '@angular/core';
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
    public show: boolean;
    public example: boolean;

    public pairAlgoritm: Pairs;
    public intervalAlgoritm: KlineInterval;
    public intervalsName: string;
    public inputAlgoritm: number;
    public pairAlgoritmString: string;
    public value: number; 

    public selectedpair: string[] = [
        "GVTBTC","IOTXBTC","STRATBTC","XRPBTC","WAVESBTC","CMTBTC","BTCUSDT"
    ];


    @Output() change = new EventEmitter();

	pairs: GetPair[] = [
		{ name: "GVTBTC",  pair: Pairs.GVTBTC},
		{ name: "IOTXBTC", pair:   Pairs.IOTXBTC },
		{ name: "STRATBTC", pair:  Pairs.STRATBTC },
		{ name: "XRPBTC", pair:  Pairs.XRPBTC },
        { name: "WAVESBTC", pair:  Pairs.WAVESBTC },
        { name: "CMTBTC", pair:  Pairs.CMTBTC },
        { name: "BTCUSDT", pair:  Pairs.BTCUSDT }
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

    
    constructor(private mainService: MainService, private websocket: WebSocketService,public dialog: MatDialog)
    { 

    }
    
    ngOnInit()
    {
        this.filters.intervalFilter.value = this.intervals[0].interval;
        this.filters.pairFilter.value = this.pairs[0].name;
        this.filtersTwo.pairFilter.value = this.pairs[0].pair;

        this.filtersTwo.intervalFilter.value = this.intervalsAlgoritm[0].interval;
        this.intervalsName = this.intervalsAlgoritm[0].name;

        this.LoadSocket(this.filters.pairFilter.value,this.filters.intervalFilter.value);
        this.visible = false;
        this.show = false;
    
    }
    
    ngAfterViewInit()
    {
        this.setPair(this.filters.pairFilter.value);
        this.setInterval(this.filters.intervalFilter.value);
        this.setIntervalAlgoritm(this.filtersTwo.intervalFilter.value);
        this.setPairAlgoritm(this.filtersTwo.pairFilter.value);
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

        if(this.visible){
            document.getElementById('display_none').style.display = "block";
            this.visible = false;
        }
        else{
            document.getElementById('display_none').style.display = "none";
            this.visible = true;
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

    public setIntervalAlgoritm(interval: KlineInterval): void
    {
        this.filtersTwo.intervalFilter.value = interval;
        this.intervalAlgoritm = interval;
        this.setIntervalName(interval);
        
        console.log(interval);
        console.log(this.value);
        
    }

    public setIntervalName(interval: KlineInterval)
    {
      if(interval == KlineInterval.FiveMinutes){
        this.value = 1;
        this.intervalsName = this.intervalsAlgoritm[0].name;
        return this.intervalsName;
      }
      if(interval == KlineInterval.FiveteenMinutes){
        this.value = 2;
        this.intervalsName = this.intervalsAlgoritm[1].name;
        return this.intervalsName;
      }
      if(interval == KlineInterval.OneHour){
        this.value = 60;
        this.intervalsName = this.intervalsAlgoritm[2].name;
        return this.intervalsName;
      }
      if(interval == KlineInterval.FourHour){
        this.value = 240;
        this.intervalsName = this.intervalsAlgoritm[3].name;
        return this.intervalsName;
      }
      if(interval == KlineInterval.OneDay){
        this.value = 1440;
        this.intervalsName = this.intervalsAlgoritm[4].name;
        return this.intervalsName;
      }
    }

    public setPairAlgoritm(pair: Pairs): void
    {
        this.filtersTwo.pairFilter.value = pair;
        this.pairAlgoritm = pair;
      
        if(pair == 0)
        {
            this.show = true;
            document.getElementById('gg').innerText = this.selectedpair[0];
        }  
        if(pair == 1)
        {
            this.show = true;
            document.getElementById('gg').innerText = this.selectedpair[1];
        }
        if(pair == 2)
        {
            this.show = true;
            document.getElementById('gg').innerText = this.selectedpair[2];
        }
        if(pair == 3)
        {
            this.show = true;
            document.getElementById('gg').innerText = this.selectedpair[3];
        }
        if(pair == 4)
        {
            this.show = true;
            document.getElementById('gg').innerText = this.selectedpair[4];
        }
        if(pair == 5)
        {
            this.show = true;
            document.getElementById('gg').innerText = this.selectedpair[5];
        }
        if(pair == 6)
        {
            this.show = true;
            document.getElementById('gg').innerText = this.selectedpair[6];
        }
        
    }

    onKeyInaccuracy(event: KeyboardEvent) {
        var inaccuracy = (<HTMLInputElement>event.target).value;
        this.inputAlgoritm = parseFloat(inaccuracy);
    }


    public LoadSocket(pair: string, interval: string){
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
      let pair = this.pairAlgoritm;
      if(pair == 0)
      {
        this.show = true;
        this.selectedpair[0] = "Для монеты GVTBTC выбран интервал: " + this.intervalsName + "; Погрешность: " + this.inputAlgoritm;
        document.getElementById('gg').innerText = this.selectedpair[0];
        this.RealTime()
      }
      if(pair == 1)
      {
        this.show = true;
        this.selectedpair[1] = "Для монеты IOTXBTC выбран интервал: " + this.intervalsName + "; Погрешность: " + this.inputAlgoritm;
        document.getElementById('gg').innerText = this.selectedpair[1];   
        this.RealTime();

      }
      if(pair == 2)
      {
        this.show = true;
        this.selectedpair[2] = "Для монеты STRATBTC выбран интервал: " + this.intervalsName + "; Погрешность: " + this.inputAlgoritm;
        document.getElementById('gg').innerText = this.selectedpair[2];
        this.RealTime();   
      }
      if(pair == 3)
      {
        this.show = true;
        this.selectedpair[3] = "Для монеты XRPBTC выбран интервал: " + this.intervalsName + "; Погрешность: " + this.inputAlgoritm;
        document.getElementById('gg').innerText = this.selectedpair[3];   
        this.RealTime();
      }
      if(pair == 4)
      {
        this.show = true;
        this.selectedpair[4] = "Для монеты WAVESBTC выбран интервал: " + this.intervalsName + "; Погрешность: " + this.inputAlgoritm;
        document.getElementById('gg').innerText = this.selectedpair[4];  
        this.RealTime(); 
      }
      if(pair == 5)
      {
        this.show = true;
        this.selectedpair[5] = "Для монеты CMTBTC выбран интервал: " + this.intervalsName + "; Погрешность: " + this.inputAlgoritm;
        document.getElementById('gg').innerText = this.selectedpair[5];  
        this.RealTime(); 
      }
      if(pair == 6)
      {
        this.show = true;
        this.selectedpair[6] = "Для монеты BTCUSDT выбран интервал: " + this.intervalsName + "; Погрешность: " + this.inputAlgoritm;
        document.getElementById('gg').innerText = this.selectedpair[6];   
        this.RealTime();
      }
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
    public RealTime(){
        const req = new DataOfRealTimeRequest();

        req.pair = this.filtersTwo.pairFilter.value;
        req.interval = this.intervalAlgoritm;
        req.time = new Date();
        req.inaccuracy = this.inputAlgoritm;
        req.value = this.value;

        this.mainService
        .getRealTime(req)
        .subscribe(res => {
            if (!res.success) {
                console.log(res.message);
                return;
            }
            //this.priceList = res;
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
  