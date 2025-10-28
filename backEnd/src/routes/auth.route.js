import express from "express";

const route = express.Router()


route.post("/signUp" , ()=>{
    console.log("sign up")
})



export default route;