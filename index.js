const express=require("express");
const { UserModel, TodoModel }=require("./db");
const jwt=require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const SECRET_KEY="mehul2452";
const zod=require("zod");
const bcrypt=require("bcrypt");


const app=express();

const emailSchema=zod.string().email();
const passwordSchema=zod.string().min(6);
async function start_server(){
    try{
        await mongoose.connect("mongodb+srv://admin:mehulmehul@cluster0.p3ra7.mongodb.net/Todo-app-databse")
        console.log("Connected to MongoDB");
        app.listen(3000,()=>{
            console.log("The server is listening on the port 3000 (:");
        })
    }catch(error){
        console.log("Failed to connect to MongoDB",error);
    }
}
start_server();
app.use(express.json()); 

app.post("/signup",async (req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    const name=req.body.name;
    const hashedPassword=await bcrypt.hash(password,10);
    try {
        emailSchema.parse(email);
        passwordSchema.parse(password);
    } catch (error) {
        return res.status(400).json({ msg: "Invalid input data", error: error.errors });
    }
    
try{
   await UserModel.create({
        email:email,
        password:hashedPassword,
        name:name
    })

    res.json({
        msg:"You are logged in."
    })
}
catch(error){
    res.status(401).json({
        msg:"This email has been used already!"
    })
    console.log("Email Id already used",error);
}

});

app.post("/signin",async(req,res)=>{

    const email=req.body.email;
    const password=req.body.password;

    const user= await UserModel.findOne({email:email});
    if(user&& await bcrypt.compare(password,user.password)){
        const token=jwt.sign({
            id:user._id.toString()
            //as we enter anything in a collection we get automatically generated _id
            //that is object id basically and thus we can use it to identify and object 
            //or any entry uniquely.......
        },SECRET_KEY);
        res.json({
            msg:"You have been successfully signed in",
            token:token
        })
    }
    else{
        res.status(403).json({
            msg:"Wrong Credentials"
        })
    }



});


app.post("/todo",auth,async(req,res)=>{
    const userId=req.userId;
    const title=req.body.title;
    const done=req.body.done;

   await TodoModel.create({
        userId:userId,
        title:title,
        done:done
    })
    res.json({
        msg:"todo successfully added"
    })

});


app.get("/todos",auth,async(req,res)=>{
    const todos=await TodoModel.find({userId:req.userId});
    if(todos.length>0){
        res.json({
            todos
        })
    } else{
        res.status(400).json({
            msg:"The todos were not found.."
        })
    }
});

function auth(req,res,next){
    const token=req.headers.token;

    const decodeData=jwt.verify(token,SECRET_KEY);

    if(decodeData){
        req.userId=decodeData.id;
        next();
    }else{
        res.status(403).json({
            msg:"Incorrect Credentials"
        })
    }

} 

