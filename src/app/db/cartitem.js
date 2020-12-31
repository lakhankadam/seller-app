const mongoose = require('mongoose')
Schema = mongoose.Schema

const CartItemSchema = Schema({
    id: Number,
    name: String,
    price: Number,
    quantity: Number,
    sold: Number 
});

var CartItem = mongoose.model('CartItem',CartItemSchema);

module.exports = CartItem;