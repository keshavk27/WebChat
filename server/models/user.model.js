import mongoose  from "mongoose";   


const userSchema=new mongoose.Schema({
    fullname:{
        type: String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        unique:true

    },
    gender:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    }

},{timestamps:true}
);

const User=mongoose.model("User",userSchema)
export default User;