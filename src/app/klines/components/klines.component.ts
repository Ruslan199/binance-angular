import { Component, OnInit } from '@angular/core';
import { KlineService } from '../services/klines.service';
import { GetDataRequest } from 'src/app/common/models/request/get-data-request.model';
import { DocumentResponse } from 'src/app/common/models/response/document-response.model';
import { KlineInterval } from 'src/app/common/enum/kline-interval.enum';
import { MyDatePicker, IMyOptions, IMyDateModel } from 'mydatepicker';
import { ViewChild } from '@angular/core';
import { GetPair } from 'src/app/common/models/request/get-pair.model';
import { Pairs } from 'src/app/common/enum/pairs.enum';
import { BinanceKline } from 'src/app/common/models/response/data-from-array.model';
import { GetIntervalsKline } from 'src/app/common/models/request/get-interval-kline.model';




@Component({
	selector: 'app-kline',
	templateUrl: './klines.component.html',
	styleUrls: ['./klines.component.css']
})

export class KlinesComponent implements OnInit {

	public data: DocumentResponse;
	public filters: Filters = new Filters();
	public model: any = { date: { year: 2018, month: 10, day: 9 }};
	public startTime: string;
	public endTime: string;
	public gg: Date;
	public gg1: Date;
	public collection: BinanceKline[] = [];
	public showHide: boolean;


	
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
		width: "200px"

	};

	pairs: GetPair[] = [
		{ name: "GVTBTC",  pair: Pairs.GVTBTC },
		{ name: "IOTXBTC", pair:   Pairs.IOTXBTC },
		{ name: "STRATBTC", pair:  Pairs.STRATBTC },
		{ name: "XRPBTC", pair:  Pairs.XRPBTC },
        { name: "WAVESBTC", pair:  Pairs.WAVESBTC },
		{ name: "CMTBTC", pair:  Pairs.CMTBTC },
		{ name: "BTCUSDT", pair:  Pairs.BTCUSDT }
    ];

    intervals: GetIntervalsKline[] = [
          { name: "5 минут", interval: KlineInterval.FiveMinutes,value: 5 },
          { name: "15 минут", interval: KlineInterval.FiveteenMinutes,value: 15 },
          { name: "1 час", interval: KlineInterval.OneHour,value: 60 },
          { name: "4 часа", interval: KlineInterval.FourHour,value: 240 },
          { name: "24 часa", interval: KlineInterval.OneDay,value: 1440 }
    ];
	


    @ViewChild('mydp') mydp: MyDatePicker;

    onDateChanged(event: IMyDateModel) {
		this.startTime = event.formatted;
		this.gg = event.jsdate;
		console.log(event.date);
		console.log(event.epoc);
		console.log(event.jsdate);
		console.log(this.startTime);
    
	}

	onDateChangedd(event: IMyDateModel) {
		this.endTime = event.formatted;
		this.gg1 = event.jsdate;
		console.log(this.endTime);
	}
	
	

     // Calling this function opens the selector if it is closed and 
    // closes the selector if it is open
    onToggleSelector(event: any) {
        event.stopPropagation();
        this.mydp.openBtnClicked();
    }

    // Calling this function clears the selected date
    onClearDate(event: any) {
        event.stopPropagation();
        this.mydp.clearDate();
    }

	public selectedInterval: KlineInterval;

	constructor( private heroService: KlineService) {

		
	}

	ngOnInit() {
		this.showHide = false;
	}
	ngAfterViewInit() {
		this.filters.intervalFilter.value = this.intervals[0].interval;
		this.filters.pairFilter.value = this.pairs[0].pair;
	
        this.setPair(this.filters.pairFilter.value);
        this.setInterval(this.filters.intervalFilter.value);	
	}

	public setInterval(interval: KlineInterval): void
    {
        this.filters.intervalFilter.value = interval;
    }
     
    public setPair(pair: string): void
    {
        this.filters.pairFilter.value = pair;
	}
	
	public sendRequest(){
		this.loadData();
		this.showHide = true;
	}

	private loadData() {

		const req = new GetDataRequest();
        req.pair = this.filters.pairFilter.value;
		req.interval = this.filters.intervalFilter.value;

		req.startTime = new Date(this.gg)
		req.endTime = new Date(this.gg1);

		this.heroService
			.getData(req)
			.subscribe(res => {
				if (!res.success) {
				console.log(res.message);
				return;
			}
			
			this.data = res;
			this.collection.length = 0;

			for(let i = 0; i < this.data.dataPrice.length; i++){
			   this.collection.push(this.data.dataPrice[i]);
			}
			console.log(this.collection);

		});

		
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

