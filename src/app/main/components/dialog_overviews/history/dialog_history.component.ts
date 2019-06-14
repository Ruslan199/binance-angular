import { Component, EventEmitter, Output,Inject, ViewChild, OnInit } from '@angular/core';
import { MainService } from '../../../services/main.service';
import { KlineInterval } from 'src/app/common/enum/kline-interval.enum';
import 'rxjs/add/operator/takeWhile';
import { GetPair } from 'src/app/common/models/request/get-pair.model';
import { Pairs } from 'src/app/common/enum/pairs.enum';
import { MatDialogRef } from '@angular/material';
import { IMyOptions, IMyDateModel, MyDatePicker } from 'mydatepicker';
import { GetIntervalsKline } from 'src/app/common/models/request/get-interval-kline.model';
import { DataOfAlgoritmRequest } from 'src/app/common/models/request/data-algoritm-request.model';

@Component({
    selector: 'app-mainn',
    templateUrl: 'dialog_history.component.html',
    styleUrls: ['dialog_history.component.css']
})
export class DialogOverviewComponent implements OnInit{

	//public timestring: string;
    public time: Date;
    public klinesCount: number;
    public inaccuracy: number;
    public interval: KlineInterval;
    public pair: Pairs;
    public inar: number;
    public value: number;
    public klines: string;
    public data: [];
    public buy: boolean 

    private myOptions: IMyOptions = {
        dayLabels: {su: "Вс", mo: "Пн", tu: "Вт", we: "Ср", th: "Чт", fr: "Пт", sa: "Сб"},
        monthLabels: { 1: "Янв", 2: "Фев", 3: "Март", 4: "Апр", 5: "Май", 6: "Июнь", 7: "Июль", 8: "Авг", 9: "Сент", 10: "Окт", 11: "Ноя", 12: "Дек" },
        dateFormat: "dd.mm.yyyy",
        todayBtnTxt: "Сегодня",
        firstDayOfWeek: "mo",
        sunHighlight: true,
        inline: false,
        alignSelectorRight: false,
		height: "20px",
        width: "150px",
    };

    @Output() change = new EventEmitter();
    @ViewChild('mydp') mydp: MyDatePicker;

    constructor(public dialogRef: MatDialogRef<DialogOverviewComponent>, private mainService: MainService)
    {
  
    }
   
    onDateChanged(event: IMyDateModel) {
		//this.timestring = event.formatted;
		this.time = event.jsdate;
    }
    ngOnInit()
    {
        this.interval= KlineInterval.FiveMinutes;
        this.pair = Pairs.GVTBTC;
        this.buy = false;
        this.value = 5;
    }

    
    intervals: GetIntervalsKline[] = [
        { name: "5 минут", interval: KlineInterval.FiveMinutes, value: 5 },
        { name: "15 минут", interval: KlineInterval.FiveteenMinutes, value: 15 },
        { name: "1 час", interval: KlineInterval.OneHour, value: 60 },
        { name: "4 часа", interval: KlineInterval.FourHour, value: 240 },
        { name: "24 часa", interval: KlineInterval.OneDay,value: 1440 }
    ];

    pairs: GetPair[] = [
		{ name: "GVTBTC",  pair: Pairs.GVTBTC },
		{ name: "IOTXBTC", pair:   Pairs.IOTXBTC },
		{ name: "STRATBTC", pair:  Pairs.STRATBTC },
		{ name: "XRPBTC", pair:  Pairs.XRPBTC },
        { name: "WAVESBTC", pair:  Pairs.WAVESBTC },
		{ name: "CMTBTC", pair:  Pairs.CMTBTC },
		{ name: "BTCUSDT", pair:  Pairs.BTCUSDT }
    ];

    public setInterval(interval: KlineInterval): void
    {
        this.interval = interval;
    }
    public setPair(pair: Pairs): void
    {
        this.pair = pair;
        console.log(pair);
	}
    onKey(event: KeyboardEvent) {
        var klines = (<HTMLInputElement>event.target).value;
        this.klinesCount = parseInt(klines);
    }

    onKeyInaccuracy(event: KeyboardEvent) {
        var inaccuracy = (<HTMLInputElement>event.target).value;
        this.inaccuracy = parseFloat(inaccuracy);
        this.inar = this.inaccuracy;
    }
    
    onNoClick(): void {
       this.dialogRef.close();
    }
    NoClick(): void {
        this.buy = false;
    }

    getHistory(){
        document.getElementById('request').style.display = "none";
    }


    public sendRequest() {
        
        const req = new DataOfAlgoritmRequest();

        req.time = new Date(this.time);
        console.log(req.time);
        req.interval = this.interval;
        req.klinesCount = this.klinesCount;
        req.inaccuracy = this.inar;
        req.pair = this.pair;

        this.mainService
        .StartAlgoritm(req)
			.subscribe(res => {
				if (!res.success) {
				console.log(1);
				return;
            }

            this.klines = res.klines;  
            this.getHistory();     
            console.log(2);
            this.buy = true;
		});
    }
    
  }

