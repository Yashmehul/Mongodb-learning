const mongoose=require('mongoose');
const { string, boolean } = require('zod');
const Schema=mongoose.Schema;
const ObjectId=mongoose.ObjectId;


const UserSchema=new Schema({
    email:{type:String,unique:true},
    password:String,
    name:String
})

const TodoSchema=new Schema({
    UserId:ObjectId,
    title:String,
    done:Boolean
})

const UserModel=mongoose.model("Users",UserSchema);

const TodoModel=mongoose.model("Todos",TodoSchema);

module.exports({
    UserModel:UserModel,
    TodoModel:TodoModel
})
