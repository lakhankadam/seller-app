import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {SellItemComponent} from './sell-item/sell-item.component';
import {CartItemComponent} from './cart-item/cart-item.component';
import {AddItemComponent} from './add-item/add-item.component';
import {UpdateItemComponent} from './update-item/update-item.component';
import {HistoryItemComponent} from './history-item/history-item.component';

const routes: Routes = [
  {path:'', redirectTo:'/sellItem', pathMatch:'full' },
  {path:'sellItem', component: SellItemComponent },
  {path:'cartItem', component: CartItemComponent },
  {path:'addItem', component: AddItemComponent },
  {path:'updateItem', component: UpdateItemComponent },
  {path:'historyItem', component:HistoryItemComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
