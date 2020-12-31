import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {CommonService} from '../common.service';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent implements OnInit {
  items = [];
  sum_total = 0;
  sum_items = [];
  cartIsEmpty = false;
  todayDate = new Date().toISOString().split("T",1)[0].split("-").reverse().join("-");
  constructor(private http: HttpClient, private newService: CommonService) { }

  ngOnInit(): void {
    this.getCartItems();
  }
  placeOrder()
  {
    var date = new Date().toISOString().split("T",1)[0];
    date = date.split("-").reverse().join("-");
    this.newService.placeOrder({mode:"sell", items:this.items, date:date, amount:this.sum_total});
    alert("ORDER PLACED SUCCESSFULLY!!!");
  }
  onSoldChange(event:any)
  {
    var idAttr = event.target.attributes.id;
    var ID = idAttr.nodeValue;
    var id = ID.split(" ")[2];
    var item = this.items.find(val => {
      return val.id == id;
    })
    var ind = this.sum_items.findIndex(val =>{
      return val.id == id;
    })
    this.sum_items[ind].amount = item.price*item.sold;
    var newSum = 0;
    for(let sum_item of this.sum_items)
      newSum += parseInt(sum_item.amount);

    this.sum_total = newSum;
  }
  removeItem(event: any)
  {
    var idAttr = event.target.attributes.id;
    var id = idAttr.nodeValue;
    console.log(id);
    this.http.delete('http://localhost:8000/api/removeCartItem/'+id).subscribe(
      results => {
        console.log(results);
      }
    );
    window.location.reload();
  }

  printOrder()
  {
    var divToPrint = document.getElementById("printData");
    // console.log(divToPrint.innerHTML);
    console.log(this.items);
    var htmlToPrint = '' +
          '<style type="text/css">' +
          '#shop{'+
          'padding-left:130px'+
          '}'+
          'table th, table td {' +
          'border:1px solid #000;' +
          'padding:0.5em;' +
          '}' +
          '</style>';
      
    htmlToPrint += divToPrint.outerHTML;
    var newWin = window.open('', '_blank', 'width=1000,height=1000');
    newWin.document.write(htmlToPrint);
    newWin.document.close();
    newWin.print();
    newWin.onafterprint = function(){
      newWin.close();
    }
    newWin.oncancel = function(){
      newWin.close();
    }
  }

  getCartItems()
  {
    this.http.get('http://localhost:8000/api/cartItems').subscribe(
      results => {
          for(let i in results)
          {
            this.cartIsEmpty = true;
            this.items.push(results[i]);
          }
          // console.log(results);
          for(let i in this.items)
          {
            var amount = this.items[i].price*this.items[i].sold
            this.sum_total += amount;
            this.sum_items.push({id:this.items[i].id, amount:amount});
            this.items[i].no = this.items.length - parseInt(i);
          }
          this.items.reverse();
      }
    )
  }
  clearCart()
  {
    this.http.delete('http://localhost:8000/api/clearCart').subscribe(
      results => {
        console.log(results);
      }
    );
    window.location.reload();
  }
}
