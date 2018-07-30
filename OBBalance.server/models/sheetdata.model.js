const mongoose = require('mongoose');
const Schema = mongoose.Schema,
      ObjectId = mongoose.ObjectId;

let SheetdataSchema = new Schema({
    id: ObjectId,
    key: {type: String, required: true, max: 100},
    data: {type: Object, required: true}
}, {
    timestamps: true
});


// Export the model
module.exports = mongoose.model('Sheetdata', SheetdataSchema);