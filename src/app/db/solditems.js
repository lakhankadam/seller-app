const mongoose = require('mongoose')
Schema = mongoose.Schema

const SoldItemsSchema = Schema({
    date:String,
    amount:Number,
    billno: Number,
    items:
    [{
        name: String,
        price: Number,
        sold: Number 
    }]
});

var SoldItems = mongoose.model('SoldItems',SoldItemsSchema);

module.exports = SoldItems;