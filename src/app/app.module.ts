import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SellItemComponent } from './sell-item/sell-item.component';
import { AddItemComponent } from './add-item/add-item.component';
import { UpdateItemComponent } from './update-item/update-item.component';
import { CartItemComponent } from './cart-item/cart-item.component';
import { HistoryItemComponent } from './history-item/history-item.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

@NgModule({
  declarations: [
    AppComponent,
    SellItemComponent,
    AddItemComponent,
    UpdateItemComponent,
    CartItemComponent,
    HistoryItemComponent,
  ],
  imports: [
    MDBBootstrapModule.forRoot(),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
