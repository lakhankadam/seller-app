import { Component, OnInit } from '@angular/core';
import {CommonService} from '../common.service';
import { HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-update-item',
  templateUrl: './update-item.component.html',
  styleUrls: ['./update-item.component.css']
})
export class UpdateItemComponent implements OnInit {
  allItems = [];
  finalItems = [];
  getItemsUrl = 'http://localhost:8000/api/getItems';
  removeItemUrl = 'http://localhost:8000/api/removeSellItem/';
  constructor(private http: HttpClient, private newService: CommonService) { }

  ngOnInit(): void {
    this.getAllItems();
  }

  removeItem(event: any)
  {
    var idAttr = event.target.attributes.id;
    var _id = idAttr.nodeValue;
    var item = this.finalItems.find(val =>{
      return val._id == _id;
    })
    if(confirm("Are you sure you want to remove "+item.name+" ?"))
    {
      this.http.delete(this.removeItemUrl+_id).subscribe(
        results => {
          console.log(results);
        }
      );
    }
    else
    {
      alert(item.name+" not removed!");
    }
    window.location.reload();
  }

  updateItems(event: any)
  {
    var idAttr = event.target.attributes.id;
    var _id = idAttr.nodeValue;
    var item = this.finalItems.find(val =>
      {return val._id == _id});
    if(item.name == undefined || item.name.trim().length == 0)
    {
      alert("Name cannot be set empty");
      return;
    }
    if(item.price <=0 || parseInt(item.add) <=0)
    {
      if(item.price <= 0)
        alert("Price should be greater than zero");
      if(parseInt(item.add) <=0)
        alert("Quantity to add should be greater than zero");
      return;
    }
    this.newService.placeOrder({mode:"update",item:item});
    alert(item.name+ " updated!");
    window.location.reload();
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
        for(let i in results)
        {
          var value = JSON.stringify(results[i]);
          var _id = JSON.parse(value)._id;
          var id = parseInt(i) + 1;
          var name = JSON.parse(value).name;
          var price = JSON.parse(value).price;
          var quantity = JSON.parse(value).quantity;
          var add = "";
          this.allItems.push({_id,id,name,price,quantity,add});
        }
        this.finalItems = this.allItems;
      }
    );
}
}
