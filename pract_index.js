const express=require("express");
const { UserModel,TodoModel }=require("./pract_db");
const app=express();
const jwt=require("jsonwebtoken")
const mongoose=require("mongoose");
const zod=require("zod");
const brycpt=require("bcrypt");
const SECRET_KEY="iloveaaradhya"


app.use(express.json());

async function start_server(){
try{
   await mongoose.connect("mongodb+srv://admin:mehulmehul@cluster0.p3ra7.mongodb.net/Todo-app-databse")
   console.log("Mongodb database connected");
   app.listen(3000,()=>{
    console.log("The server is listening on port 3000 ( :");
   })
}catch(error){
    console.log("failed to connect to mongodb database",error);
}
}
start_server();


const obj=zod.object({
    email:zod.string().email(),
    password:zod.string().min(6).max(12),
    name:zod.string().min(3)
})
app.post("/signup",async(req,res)=>{
    try{
    const checked=obj.parse(req.body);
        const email=req.body.email;
        const password=req.body.password; 
        //or simply do ...const { email,password,name }=checked..this is better and concise
        const name=req.body.name;

        const existing_User=await UserModel.findOne({ email });
        if(existing_User){
            return res.status(401).json({
                msg:"this email has already been used"
            })
        }

        const hashedPassword=await bcrypt.hash(password,10);
        await UserModel.create({ //isko await krna iss very zaroori kyunki
            //ye time leta hai naa server se connec hone mei agrr pta chla koi issue bhi
            //aaya toh ye status code 200 return krr dega agrr await ni kiye hmm tohh......
            email:email,
            password:hashedPassword,
            name:name
        })
        res.status(200).json({
            msg:"user successfully registered"
        })
    }
    catch(error){
      if(error instanceof zod.ZodError){
        return res.status(400).json({
            msg:"The input credentials are of wrong format"
        })
        
      } else{
        return res.status(500).json({
            msg:"Signup request failed"
        })
      }
    }
});

app.post("/signin",async(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
try{
    const user=await UserModel.findOne({email});
    if(user&&await bcrypt.compare(password,user.password)){
        const token=jwt.sign({
            userId:user._id
        },SECRET_KEY);

        return res.status(200).json({
            msg:"You have been signed in successfully",
            token:token
        })
    }

    else{
        return res.status(401).json({
            msg:"There is something wrong while signing in"
        })
    }
}
catch(error){
    return res.json({
        msg:"An error has occured while signing in"
    })
}
})

app.post("/todo",auth,(req,res)=>{


})

function auth(req,res,next){
    try{
        const token=req.headers.token;
        if(!token){
            return res.status(400).json({
                msg:"Token is required"
            })
        }
        const decodeData=jwt.verify(token,SECRET_KEY);
        if(decodeData){
            req.userid=decodeData.userId;
            next()
        }
    }
    catch(error){
        console.error(error);
        return res.status(401).json({
            msg:"tokens is invalid"
        })
    }
}