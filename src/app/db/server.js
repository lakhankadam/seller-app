var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require("mongoose");

var app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors())

var Item = require('./item');
var CartItem = require('./cartitem');
var SoldItems = require('./solditems');
var BillNo = require('./bill');


app.get('/api/getBillNo', (req,res) => {
    BillNo.findOne({}, function(err,obj){
        if(err)
            console.log(err);
        else if(!obj)
        {
            var billno = new BillNo();
            billno.billno = 1000;
            billno.save((err,result) =>{
                if(err)
                    console.log(err);
                res.send([result]);
            })
        }
        else
            res.send([obj]);
    })
});

app.post('/api/updateBillNo', (req,res) =>{
    var no = req.body.billno;
    BillNo.findOne({},function(err,foundObject){
        if(err)
            console.log(err);
        else if(foundObject)
        {
            foundObject.billno = no;
            foundObject.save((err,updatedObject) =>{
                if(err)
                    console.log(err);
            });
        }
        else
        {
            var billno = new BillNo();
            billno.billno = 1000;
            billno.save((err,result) =>{
                if(err)
                    console.log(err);
                res.send([result]);
            })
        }
    });
})

app.post('/api/saveItem',(req,res) =>
{
    var itemData = req.body;
    query = {name:req.body.name};
    Item.findOne(query,function(err,obj){
        if(err)
            console.log(err);
        else if(!obj)
        {
            var item = new Item(itemData);
            item.save((err,result) =>{
                if(err)
                    console.log(err);
            })
        }
    });
})

app.get('/api/getItems', async (req,res) =>
{
    var items = await Item.find({});
    res.send(items);
})

app.post('/api/updateItems', (req,res) =>
{
    var mode = req.body.mode;
    if(mode == "sell")
    {
        var items = req.body.items;
        var solditems = new SoldItems();
        solditems.items = items;
        solditems.date = req.body.date;
        solditems.amount = req.body.amount;
        solditems.billno = req.body.billno;
        solditems.save((err,res) =>{
            if(err)
                console.log(err);
        })
        for(let i in items)
        {
            var query = {_id: items[i]._id};
            
            Item.findOne(query, function(err, foundObject){
                if(err)
                    console.log(err);
                else
                {
                    if(foundObject)
                    {
                        foundObject.quantity -= items[i].sold;
                        foundObject.save(function(err,updatedObject){
                            if(err)
                                console.log(err);
                        })
                    }
                }
            })
        }
    }
    else if(mode == "update")
    {
        var item = req.body.item;
        var query = {_id:item._id};
        Item.findOne(query, function(err,foundObject){
            if(err)
                console.log(err);
            else if(foundObject)
            {
                if(foundObject.name != '')
                    foundObject.name = item.name;
                if(item.price != '')
                    foundObject.price = item.price;
                if(item.add != '')
                    foundObject.quantity += parseInt(item.add);
                foundObject.save(function(err,updatedObject){
                    if(err)
                        console.log(err);
                })
            }
        })
    }
})

app.post('/api/cartItems', (req,res) => {
    var item = req.body.item;
    var query = {_id:item._id};
    CartItem.findOne(query, function(err,foundObject){
        if(err)
            console.log(err);
        else
        {
            if(!foundObject)
            {
                var cartitem = new CartItem(item);
                cartitem.save((err,result) =>{
                    if(err)
                        console.log(err);
                });
            }
        }
    });
});

app.delete('/api/removeSellItem/:_id', (req,res) =>
{
    var query = req.params;
    Item.findOneAndDelete(query,function(err,object){
        if(err)
            console.log(err);
    });
});

app.get('/api/cartItems', async (req,res) =>
{
    var cartitems = await CartItem.find({});
    res.send(cartitems);
});

app.delete('/api/removeCartItem/:_id', (req,res) =>
{
    var query = req.params;
    CartItem.findOneAndDelete(query,function(err,object){
        if(err)
            console.log(err);
        
    });
});


app.delete('/api/clearCart', (req,res) =>
{
    CartItem.collection.drop();
});

app.get('/api/itemsHistory', async (req,res) =>
{
    var mode = req.query.mode;
    if(mode == "today" || mode == "yesterday")
    {
        var date;
        if(mode == "today")
        {
            date = req.query.today;
            date = date.split("-").reverse().join("-");
        }
        else
        {
            date = req.query.yesterday;
            date = date.split("-").reverse().join("-");
        }
        query = {date:date};
        await SoldItems.find(query, function(err, allObjects){
            if(err)
            console.log(err);
            else
            {
                if(allObjects && allObjects.length)
                    res.send(allObjects);                    
            }
        })
    }
    else if(mode == "week" || mode == "month" || mode == "custom")
    {
        var S = new Date(req.query.fromDate);
        var E = new Date(req.query.toDate);
        var daylist = [];
        var result = [];
        for(var dt=new Date(S); dt<=E; dt.setDate(dt.getDate()+1)){
            daylist.push(new Date(dt));
          }

        var dlist = daylist.map((v)=>v.toISOString().split("T",1)[0].split("-").reverse().join("-"));
        for(let i in dlist)
        {
            query = {date:dlist[i]};
            var object = await SoldItems.find(query);
            if(object && object.length)
                result.push(object);
        }
        res.send(result);
    }
    else
    {
        await SoldItems.find({},function(err, foundObject){
            if(err)
                console.log(err);
            if(foundObject && foundObject.length)
                res.send(foundObject);

        });
    }
});

mongoose.connect("mongodb://localhost:27017/seller", { useNewUrlParser: true ,useUnifiedTopology: true } )
app.listen(8000, function(){
    console.log("Listening at 8000");
});
