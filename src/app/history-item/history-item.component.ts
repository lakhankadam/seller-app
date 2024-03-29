import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-history-item',
  templateUrl: './history-item.component.html',
  styleUrls: ['./history-item.component.css']
})
export class HistoryItemComponent implements OnInit {
  fromDate;
  toDate;
  maxDate;
  itemsHistory = [];
  itemsByDate = [];
  itemsByItem = [];
  finalItemsByDate = [];
  finalItemsByItem = [];
  finalItemsByBill = [];
  datesItem = [];
  itemsItem = [];
  billsItem = [];
  selectedTime: string = "today";
  selectedOrder: string = "date";
  historyURL = 'http://localhost:8000/api/itemsHistory';
  custom = false;
  visibility = {bill: false, date: true, item:false};
  datareceived = false;

constructor(private http: HttpClient) { }

ngOnInit(): void {
  var date = new Date();
  this.maxDate = date.toISOString().split("T",1)[0];
  this.fromDate = this.maxDate;
  this.toDate = this.maxDate;
  // this.getTodayData();
}

clearVisibility()
{
  this.visibility.date = false;
  this.visibility.item = false;
  this.visibility.bill = false;
}

onSearchChange(searchValue: string): void {  
  searchValue = searchValue.toLowerCase();
  if(this.visibility.date == true)
  {
    this.datesItem = this.finalItemsByDate.filter(val=>
      {
        return val.date.toLowerCase().includes(searchValue);
      })
  }
  else if(this.visibility.item == true)
  {
    this.itemsItem = this.finalItemsByItem.filter(val=>
      {
        return val.name.toLowerCase().includes(searchValue);
      })
  }
  else if(this.visibility.bill == true)
  {
    this.billsItem = this.finalItemsByBill.filter(val => 
      {
        return val.billno.toString().toLowerCase().includes(searchValue);
      })
  }
}
onTimeSelected(value:string)
{
  this.custom = value == "custom";
}
onOrderSelected(value:string)
{
  this.clearVisibility();
  if(value == "date")
    this.visibility.date = true;
  else if(value == "item")
    this.visibility.item = true;
  else if(value == "bill")
    this.visibility.bill = true;
}
clear()
{
  window.location.reload();
}

getData()
{
  if(this.datareceived)
    return;
  if(this.selectedTime == "today")
    this.getTodayData();
  else if(this.selectedTime == "yesterday")
    this.getYesterdayData();
  else if(this.selectedTime == "week")
    this.getWeekData();
  else if(this.selectedTime == "month")
    this.getMonthData();
  else if(this.selectedTime == "custom")
    this.getCustom();
  else
    this.getHistory(new HttpParams());
  this.datareceived = true;
}

orderItemsByDate()
{
  for(let date of this.itemsByDate)
  {
    var D = date.date;
    var items = date.itemOrder;
    var nameSet = new Set();
    for(let item of items)
    {
      var i = this.finalItemsByDate.findIndex(val =>{
        return val.date == D;
      })
      if(!nameSet.has(item.name))
      {
        nameSet.add(item.name);
        var allOccurences = items.filter(val =>{
          return val.name == item.name;
        })
        var sold = 0;
        var amount = 0;
        for(let occurence of allOccurences)
        {
          sold+=occurence.sold;
          amount+=occurence.amount;
        }
        this.finalItemsByDate[i].itemOrder.push({name:item.name, price: item.price, sold: sold, amount: amount});
        this.finalItemsByDate[i].totaldateamount += amount;
      }
    }
  }
  this.datesItem = this.finalItemsByDate;
}

orderItemsByItems()
{
  for(let item of this.itemsByItem)
  {
    var name = item.name;
    var dateOrder = item.dateOrder;
    var dateSet = new Set();
    for(let date of dateOrder)
    {
        var i = this.finalItemsByItem.findIndex(val =>{
          return val.name == name;
        })
        if(!dateSet.has(date.date))
        {
          dateSet.add(date.date);
          var allOccurences = dateOrder.filter(val =>{
            return val.date == date.date;
          })
          var sold = 0;
          var amount = 0;
          for(let occurence of allOccurences)
          {
            sold+=occurence.sold;
            amount+=occurence.amount;
          }
          this.finalItemsByItem[i].dateOrder.push({date:date.date, name:date.name, price: date.price, sold: sold, amount: amount});
          this.finalItemsByItem[i].totalitemamount += amount;
          this.finalItemsByItem[i].totalitemsold += sold;
        }
    }
    }
  this.itemsItem = this.finalItemsByItem;
}

getHistory(params: HttpParams)
{
  this.http.get(this.historyURL,{params}).subscribe(
    results => {
        if(this.selectedTime == "week" || this.selectedTime == "month" || this.selectedTime == "custom")
        {
          for(let i in results)
          {
            for(let j in results[i])
              {
                var value = JSON.stringify(results[i][j]);
                var items = JSON.parse(value).items;
                var amount = JSON.parse(value).amount;
                var date = JSON.parse(value).date;
                var billno = JSON.parse(value).billno;
                this.itemsHistory.push({items,amount,date,billno});
              }
          }
        }
        else
        {
          for(let i in results)
          {
            var value = JSON.stringify(results[i]);
            var items = JSON.parse(value).items;
            var amount = JSON.parse(value).amount;
            var date = JSON.parse(value).date;
            var billno = JSON.parse(value).billno;
            this.itemsHistory.push({items,amount,date,billno});
          }
        }
          this.itemsHistory.reverse();
          let dateSet = new Set();
          for(let i in this.itemsHistory)
          {
            var items = this.itemsHistory[i].items;
            var date = this.itemsHistory[i].date;
            for(let item of items)
            {
              if(!dateSet.has(date))
              {
                this.itemsByDate.push({date:date, itemOrder:[{name:item.name, price:item.price, sold:item.sold, amount: item.price*item.sold}]});
                this.finalItemsByDate.push({date:date, totaldateamount: 0, itemOrder:[]});
                dateSet.add(date);
              }
              else
              {
                var ind = this.itemsByDate.findIndex(val =>{
                  return val.date == date;
                });
                this.itemsByDate[ind].itemOrder.push({name:item.name, price:item.price, sold:item.sold, amount: item.price*item.sold});
              }
            }
          }
          this.orderItemsByDate();
          let itemSet = new Set();
          for(let i in this.itemsHistory)
          {
            var items = this.itemsHistory[i].items;
            var date = this.itemsHistory[i].date;
            for(let item of items)
            {
              if(!itemSet.has(item.name))
              {
                this.itemsByItem.push({name:item.name, dateOrder:[{date: date, price:item.price, sold:item.sold, amount: item.price*item.sold}]});
                this.finalItemsByItem.push({name:item.name, totalitemamount: 0, totalitemsold: 0, dateOrder:[]});
                itemSet.add(item.name);
              }
              else
              {
                var ind = this.itemsByItem.findIndex( val =>{
                  return val.name == item.name;
                });
                this.itemsByItem[ind].dateOrder.push({date: date, price:item.price, sold:item.sold, amount: item.price*item.sold}); 
              }
          }
        }
        this.orderItemsByItems();
        var ind = 0;
        for(let val of this.itemsHistory)
        {
          var items = val.items;
          this.finalItemsByBill.push({billno: val.billno, amount: val.amount, date:val.date,items:[]});
          for(let item of items)
            this.finalItemsByBill[ind].items.push({name:item.name, price:item.price, sold:item.sold, amount: item.price*item.sold});
          ind+=1;
        }
        this.billsItem = this.finalItemsByBill;
    }
  )
}
  getTodayData()
  {
    var D = new Date();
    var today = D.toISOString().split("T",1)[0];
    let params = new HttpParams();
    params = params.append("mode","today");
    params = params.append("today",today);
    this.getHistory(params);
  }

  getYesterdayData()
  {
    var D = new Date();
    D.setDate(D.getDate()-1);
    var yesterday = D.toISOString().split("T",1)[0];
    let params = new HttpParams();
    params = params.append("mode","yesterday");
    params = params.append("yesterday",yesterday);
    this.getHistory(params);
  }

  getWeekData()
  {
    var D = new Date();
    this.toDate = D.toISOString().split("T",1)[0];
    D.setDate(D.getDate()-6);
    this.fromDate = D.toISOString().split("T",1)[0];
    let params = new HttpParams();
    params = params.append("mode","week");
    params = params.append("fromDate", this.fromDate);
    params = params.append("toDate", this.toDate);
    this.getHistory(params);
  }

  getMonthData()
  {
    var D = new Date();
    this.toDate = D.toISOString().split("T",1)[0];
    D.setDate(D.getDate()-29);
    this.fromDate = D.toISOString().split("T",1)[0];
    let params = new HttpParams();
    params = params.append("mode","month");
    params = params.append("fromDate", this.fromDate);
    params = params.append("toDate", this.toDate);
    this.getHistory(params);
  }

  getCustom()
  {
    let params = new HttpParams();
    params = params.append("mode","custom");
    params = params.append("fromDate", this.fromDate);
    params = params.append("toDate", this.toDate);
    this.getHistory(params);
  }
}
