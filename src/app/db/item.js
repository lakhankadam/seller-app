const mongoose = require('mongoose')
Schema = mongoose.Schema

const ItemSchema = Schema({
        id: Number,
        name: String,
        price: Number,
        quantity: Number  
});
var Item = mongoose.model('Item',ItemSchema);
module.exports = Item;