const express=require('express')
const Book=require('./../Models/bookModel')
const fs=require('fs')

const Apifeatures = require('../Utils/ApiFeatures')

const asyncErrorHandeler=require('../Utils/asyncErrorHandler')
const CustomError = require('../Utils/customError')
   

exports.getHigestRated=(req,res,next)=>{
    req.query.limit='2';
    req.query.sort='-review';
    next();}

exports.getAllBooks= asyncErrorHandeler(async(req,res,next)=>{

  const features=new Apifeatures(Book.find(),req.query.author).filter().sort().pagination();
   let books= await features.query;

    res.status(200).json({
        status:'succes',
        length:books.length,
        data:{
            books
        }
    })}
)

exports.getBook= asyncErrorHandeler(async(req,res, next)=>{
    // const book= await book.find({_id:req.params.id})
 const book= await Book.findById(req.params.id);


 if(!book){
    const error = new CustomError('Book with id is not found', 404);
    return next(error);
 }
   
     res.status(200).json({
         status:'sucsess',
         data:{
             book
         }
     });

     }
)

exports.createBook=asyncErrorHandeler(async(req,res, next)=>{
    // const testBook=new isBooleanObject({});
    // testBook.save();
 const book=await Book.create(req.body);
    res.status(201).json({
        status:'sucsess',
        data:{
            book
        }
    })

})

exports.updateBook=asyncErrorHandeler(async(req,res, next)=>{
    if(!updateBook){
        const error = new CustomError('Movie with id is not found', 404);
        return next(error);
     }
       const updateBook= await Book.findByIdAndUpdate(req.params.id, req.body,{new:true})
       res.status(200).json({
        status:'sucsess',
        data:{
            book:updateBook
        }
    });
}
)
exports.deleteBook=asyncErrorHandeler(async(req,res, next)=>{

     const deleteBook =  await Book.findByIdAndDelete(req.params.id, req.body,{new:true})
     if(! deleteBook){
        const error = new CustomError('Movie with id is not found', 404);
        return next(error);
     }
       res.status(200).json({
        status:'sucsess',
        data:{
            book:null
        }
    });

    })

exports.getBooksStats =asyncErrorHandeler(async(req,res)=>{

        const stats=await Book.aggregate([
            {$match:{reviews:{$gte:1}}},
            { $group: {
                _id:null,
                avgpages:{$avg:'$pages'},
                minpage:{$min:'$pages'},
                minpage:{$max:'$pages'},
                totalpage:{$sum: 'pages'}
            }},
            {$match:{maxpage:{$gte:100}}}
        ]);
        res.status(200).json({
            status:'sucsess',
            count:stats.length,
            data:{
                stats
            }
        });
    
})

exports.getBooksByAuthor =async(req,res)=>{
    try{
        const book= await Book.findById(req.params.author);
        // const author=req.params.auuthor
        // const books=await Book.aggregate([
        // {$unwind:'author'}
        // ]);
        res.status(200).json({
            status:'sucsess',
           // count:books.length,
            data:{
                book
            }
        });
    }
    catch(err){
        res.status(400).json({
            status:'fail',
            data:{
            message:err.message
            }
        })
    }
    
}
