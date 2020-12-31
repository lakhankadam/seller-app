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
  // httpOptions = {
  //   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  // };
  constructor(private newService: CommonService) { }

  ngOnInit(): void {
  }
  onSubmit()
  {
    // alert(this.name);
    this.user = {name:this.name.toUpperCase(), price: this.price, quantity: this.quantity};
    this.newService.saveItem(this.user);
    alert('ITEM ADDED');
    window.location.reload();
  }
}
