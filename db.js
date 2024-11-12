const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const ObjectId=mongoose.ObjectId;

const User=new Schema({
    email:{type:String,unique:true},
    password:String,
    name:String
})

const Todo=new Schema({
    userId:ObjectId,
    //userId ek reference hai foreign key jaisa and yee whi kaam krega ....
    //ki hm user kaa detail fetch krr paaenge .... using this foreign key.... 
    title:String,
    done:Boolean
})

const UserModel=mongoose.model('Users',User); //the first argument is the name of Collection 
//in which i want to out my data in...
//And the 2nd argument is the Schema which i need my data to follow or the rules .....
const TodoModel=mongoose.model("Todos",Todo);
//here "Todos" is the Collection in the database where i want to put my data
//and "Todo" is the Schema that it will follow or the way data will be put in....

module.exports={
    UserModel:UserModel,
    TodoModel:TodoModel
}
//we can export anything whether a string or an integer or anything......