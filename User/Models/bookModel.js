let mongoose=require('mongoose');
const bookSchema= new mongoose.Schema({
    ISBN:{
        type:Number,
    },
    author:{ 
        type:String,
       required:[true, "Author is required field!"],
       trime:true
    },
    title:{
        type:String,
        unique:true,
        trime:true
    },
    review:{type:Number,
    },
    totalreview:{
        type:Number
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        select:false
    },
    pages:{
        type:Number,
        required:[true, "Page is required field!"],
    }
});
const Book=mongoose.model('Book', bookSchema);

module.exports=Book