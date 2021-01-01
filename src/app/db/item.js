const mongoose = require('mongoose')
Schema = mongoose.Schema

const ItemSchema = Schema({
        name: String,
        price: Number,
        quantity: Number  
});
var Item = mongoose.model('Item',ItemSchema);
module.exports = Item;