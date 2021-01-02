const mongoose = require('mongoose')
Schema = mongoose.Schema

const BillSchema = Schema({
    billno: Number
});
var Bill = mongoose.model('Bill',BillSchema);
module.exports = Bill;