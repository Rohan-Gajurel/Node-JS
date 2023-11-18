const User =require('./../Models/userModel')
const asyncErrorHandeler=require('../Utils/asyncErrorHandler')
const jwt =require('jsonwebtoken');
const CustomError=require('../Utils/customError')
const util = require('util')

const signToken= id=>{
   return jwt.sign({id}, process.env.SECRET_STR, {
      expiresIn: process.env.LOGIN_EXPIRES
     })
   
}

exports.signup=asyncErrorHandeler(async(req, res,next)=>{
   const newUser= await User.create(req.body);
   const token=signToken(newUser._id)
   res.status(201).json({
    status:'success',
    token,
    data:{
     user:newUser
    }
   });
});

exports.login=asyncErrorHandeler(async(req, res,next)=>{
 const email=req.body.email;
 const password=req.body.password;
 //cont{email, password}=req.body;
 if(!email||!password){
 const error=new CustomError('Please provide email and password', 400);
 return next(error);
 }
 const user = await User.findOne({email: email}).select('+password');

 const isMatch= await user.comparePasswordInDb(password, user.password)

if(!user || !isMatch){
   const error = new CustomError('Incorrect email or password', 400);
   return next(error);
}

const token = signToken(user._id)
 res.status(201).json({
   status:'success',
   token
  })
});

exports.protect =asyncErrorHandeler(async(req, res,next)=>{
  const testToken=req.headers.authorization;
  let token;
  if(testToken && testToken.startsWith('Bearer')){
  token = testToken.split(' ')[1];
  }
  if(!token){
   next(new CustomError('You are not logged', 401))
  }
//Validate the token
const decodedToken =await  util.promisify(jwt.verify)(token, process.env.SECRET_STR);
console.log(decodedToken);
//If the user exits
const user =await User.findById(decodedToken.id)
if(!user){
   const error=new CustomError('The use with this token does not exist', 401);
   next(error);
}
const isPasswordChanged=user.isPasswordChange(decodedToken.iat);
//Password changed
if(isPasswordChanged){
   const error= new CustomError('The password has changed recently.Please login');
   return next(error);
}

 req.user=user;
   next();
  });
