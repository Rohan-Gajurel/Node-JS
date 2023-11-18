
let mongoose=require('mongoose');
const dotenv=require('dotenv')
dotenv.config({path:'./config.env'});
const fs=require('fs');
const Book=require('./../Models/bookModel');
const { deleteBook } = require('../Contollers/booksContoller');

mongoose.connect(process.env.CONN_STR,{
    useNewUrlParser:true
    }).then((conn)=>{
        //console.log(conn);
        console.log('DB connection Sucessful');
    }).catch((error)=>{
   console.log(error)
    });

const books =JSON.parse(fs.readFileSync('./data/books.json', 'utf-8'))

//Delete the previous data
const deletebook = async()=>{
    try{
      await Book.deleteMany();
      console.log('Data deleted');
}catch(err){
    
    console.log(err.message);
    }
    process.exit();
}

const importBook=async()=>{
    try{
      await Book.create(books);
      console.log('Data imported');
}catch(err){
    
    console.log(err.message);
    }
    process.exit();
}
// deleteBook();
// importBook();
if(process.argv[2]==='--delete'){
    deletebook();
};
if(process.argv[2]==='--import'){
    importBook();
};