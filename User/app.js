// IMPORT PACKAGE
const express=require('express');
let mongoose=require('mongoose');
const dotenv=require('dotenv')
let app=express();
dotenv.config({path:'./config.env'});
const fs=require('fs');
const CustomError = require('./Utils/customError');
const authRouter=require('./Routes/authRouter');
const { Console } = require('console');
const gobalErrorHandaler =require('./Contollers/errorContollers')

process.on('uncaughtException', (err)=>{
    console.log(err.name,err.message);
    console.log('Uncaught exception occured! Shutting down.... ')
    process.exit(1);
    
})
const booksrouter = require('./Routes/booksRoutes')
const logger=function(req, res, next){
    console.log("custom middleware");
    next();
}
app.use(logger);
if(process.env.NODE_ENV==='developmeny'){
app.use(morgan('dev'))
}
app.use((req,res,next)=>{
    req.requestedAt=new Date().toISOString();
    next()
})
app.use(express.static('./public'))
app.use(express.json())

app.use('/api/books',booksrouter);
app.use('/api/users',authRouter);


const port=5000;
const server =app.listen(port,()=>{
    console.log('Server started')
})
//console.log(process.env.CONN_STR)
mongoose.connect(process.env.CONN_STR,{
    useNewUrlParser:true
    }).then((conn)=>{
        //console.log(conn);
        console.log('DB connection Sucessful');
    })

    process.on('unhandledRejection', (err)=>{
        console.log(err.name,err.message);
        console.log('Unhandel rejection occured! Shutting down.... ')
        server.close(()=>{process.exit(1);})
        
    })

    app.all('*', (req,res,next)=>{
        // const err  =new Error(`Invalid value ${req.originalUrl} on the server!`)
        // err.status='fail';
        // err.statusCode=404;
        const err= new CustomError(`Invalid value ${req.originalUrl} on the server!`)
        next(err);
    })
    
    app.use(gobalErrorHandaler)

  
