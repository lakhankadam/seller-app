import { identifierModuleUrl } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import {CommonService} from '../common.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {
  name: string;
  price: number;
  quantity: number;
  user = {};
  constructor(private newService: CommonService) { }

  ngOnInit(): void {
  }
  onSubmit()
  {
    if(this.name == undefined || this.name.trim().length == 0)
    {
      alert("NAME cannot be empty");
      return;
    }
    if(this.quantity == undefined || this.quantity <= 0)
    {
      alert("Quantity should be greater than zero");
      return;
    }
    if(this.price == undefined || this.price <= 0)
    {
      alert("Price should be greater than zero");
      return;
    }
    this.user = {name:this.name.toUpperCase(), price: this.price, quantity: this.quantity};
    this.newService.saveItem(this.user);
    alert(this.name+' added!');
    window.location.reload();
  }
}
