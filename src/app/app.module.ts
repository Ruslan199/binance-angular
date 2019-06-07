import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { MainService } from './main/services/main.service';
import { MainComponent, DialogOverview } from './main/components/main/main.component';
import { BaseHttpService } from './common/services/base-http.service';
import { HttpClientModule } from '@angular/common/http';
import { KlinesComponent } from './klines/components/klines.component';
import { FormsModule } from '@angular/forms';
import { KlineService } from './klines/services/klines.service';
import { WebSocketService } from './main/services/websocket.service';
import { MyDatePickerModule } from 'mydatepicker';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule, MatButtonModule, MatInputModule, MatRippleModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    KlinesComponent,
    DialogOverview
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MyDatePickerModule,
    NgxPaginationModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    BrowserAnimationsModule
  ],
  entryComponents: [
    DialogOverview
    ],
  providers: [
    BaseHttpService,
    MainService,
    KlineService,
    WebSocketService,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
