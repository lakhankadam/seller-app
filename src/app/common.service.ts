import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  items = [];
  constructor(private http: HttpClient) { }
  saveItem(item)
  {
    return this.http.post('http://localhost:8000/api/saveItem',item).subscribe(res => {
    console.log(res);
    });
  }
  getItems(){
    return this.http.get('http://localhost:8000/api/getItems').subscribe(
      res => {
        console.log(res);
      }
    );
  }
  cartItems(cartitem)
  {
    return this.http.post('http://localhost:8000/api/cartItems',cartitem).subscribe(res => {
      console.log(res);
    });
  }

  placeOrder(orderitem)
  {
    return this.http.post('http://localhost:8000/api/updateItems', orderitem).subscribe(res => {
      console.log(res);
    });
  }
  updateBillNo(billno)
  {
    return this.http.post('http://localhost:8000/api/updateBillNo', billno).subscribe(res => {
      console.log(res);
    })
  }
}
