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
  constructor(private http: HttpClient, private newService: CommonService) { }

  ngOnInit(): void {
    this.getAllItems();
  }

  removeItem(event: any)
  {
    var idAttr = event.target.attributes.id;
    var id = idAttr.nodeValue;
    console.log(id);
    this.http.delete('http://localhost:8000/api/removeSellItem/'+id).subscribe(
      results => {
        console.log(results);
      }
    );
    window.location.reload();
  }

  updateItems(event: any)
  {
    var idAttr = event.target.attributes.id;
    var id = idAttr.nodeValue;
    var item = this.finalItems.find(val =>
      {return val.id == id});
    console.log(item);
    this.newService.placeOrder({mode:"update",item:item});
    window.location.reload();
  }

  onSearchChange(searchValue: string): void {  
    searchValue = searchValue.toLowerCase();
    this.finalItems = this.allItems.filter(val=>
      {
        // console.log(val.name);
        return val.name.toLowerCase().includes(searchValue);
      })
  }
  getAllItems()
  {
    this.allItems = [];
    this.http.get('http://localhost:8000/api/getItems').subscribe(
      results => {
        for(let i in results)
        {
          var value = JSON.stringify(results[i]);
          var doc_id = JSON.parse(value)._id;
          var id = JSON.parse(value).id;
          var name = JSON.parse(value).name;
          var price = JSON.parse(value).price;
          var quantity = JSON.parse(value).quantity;
          var add = "";
          this.allItems.push({doc_id,id,name,price,quantity,add});
        }
        this.finalItems = this.allItems;
      }
    );
}
}
