import { Component, OnInit } from '@angular/core';
import {CommonService} from '../common.service';
import { HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-sell-item',
  templateUrl: './sell-item.component.html',
  styleUrls: ['./sell-item.component.css']
})
export class SellItemComponent implements OnInit {
  allItems = [];
  cartItems = {};
  addItemstoCart = [];
  finalItems = [];
  getItemsUrl = 'http://localhost:8000/api/getItems';
  constructor(private http: HttpClient, private newService: CommonService) { }

  ngOnInit(): void {
    this.getAllItems();
  }

  addtoCart(event:any)
  {
    var idAttr = event.target.attributes.id;
    var _id = idAttr.nodeValue;
    var item = this.allItems.find(val => {
      return val._id == _id;
    });
    item.sold = 1;
    alert(item.name+" added in cart");
    
    this.newService.cartItems({item:item});
  }
  onSearchChange(searchValue: string): void {  
    searchValue = searchValue.toLowerCase();
    this.finalItems = this.allItems.filter(val=>
      {
        return val.name.toLowerCase().includes(searchValue);
      })
  }
  
  getAllItems()
  {
    this.allItems = [];
    this.http.get(this.getItemsUrl).subscribe(
      results => {
        var ind = 1;
        for(let i in results)
        {
          var value = JSON.stringify(results[i]);
          var _id = JSON.parse(value)._id;
          var name = JSON.parse(value).name;
          var price = JSON.parse(value).price;
          var quantity = JSON.parse(value).quantity;
          var sold = "";
          if(quantity != 0)
          {
            var id = ind;
            this.allItems.push({_id,id,name,price,quantity,sold});
            ind+=1;
          }
        }
        this.finalItems = this.allItems;
      }
    );
  }
}
