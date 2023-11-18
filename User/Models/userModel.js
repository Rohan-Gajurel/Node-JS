let mongoose=require('mongoose');
const validaor=require('validator');
const bcrypt=require('bcryptjs')
const userSchema= new mongoose.Schema({
    name:{ 
        type:String,
       required:[true, "Name is required field!"]
    },
    email:{ 
        type:String,
       required:[true, "Email is required field!"],
       unique:true,
       lowercase:true,
       validate:[validaor.isEmail,'Please enter a valid email']
    },
    photo:String,
    password:{
        type:String,
        required:[true, "Password is required field!"],
        minlength:8,
        select:false
    },
    confirmpassword:{
        type:String,
        required:[true, "Please confirm your password"],
        validate:{
            validator:function(val){
                return val==this.password;
            }, 
            message:'Password and Confirm Password does not match'
        }
    },
    passwordChangedAt:Date
})

userSchema.pre('save',async function(next){
    if(!this.isModified('password'))return next();
    //encrypt the password
    this.password= await bcrypt.hash(this.password, 12);
    this.confirmpassword=undefined;
    next();
})

userSchema.methods.comparePasswordInDb =async function(pswd, pswdDb){
   return await bcrypt.compare(pswd, pswdDb);
}

userSchema.methods.isPasswordChangeg=async function(JWTtimestamp){
if(this.passwordChangedAt){
    const pswdChangedTimestamp=parserInt(this.passwordChangedAt.getTime()/1000, 10);
conaole.log(pswdChanged, JWTtimestamp);
}
return JWTtimestamp < pswdChangedTimestamp;
}

const User=mongoose.model('User',userSchema);
module.exports=User;