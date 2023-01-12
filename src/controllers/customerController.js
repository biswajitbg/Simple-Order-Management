const customerModel = require("../models/customerModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { isValidBody, isValid, NameRegex, emailRegex, passwordRegex } = require('../validations/validator');

//::::::::::::::::::::::::::::::::::create Customer::::::::::::::::::::::::::::::::::::::::::::::::::::

const createCustomer = async(req,res)=>{

    try{

        let data = req.body;
        const {fname,lname,email,password} =data;

         //----------------------------- Validating body -----------------------------//
         if (!isValidBody(data)) {
            return res.status(400).send({ status: false, message: "please provide data in request body" });
        }

        //----------------------------- Validating fname -----------------------------//
        if (!isValid(fname)) {
            return res.status(400).send({ status: false, message: "fname is required" });
        }
        if (!NameRegex(fname)) {
            return res.status(400).send({ status: false, message: "fname should contain alphabets only" });
        }

        //----------------------------- Validating lname -----------------------------//
        if (!isValid(lname)) {
            return res.status(400).send({ status: false, message: "lname is required" });
        }
        if (!NameRegex(lname)) {
            return res.status(400).send({ status: false, message: "lname should contain alphabets only" });
        }

        //----------------------------- Validating email -----------------------------//
        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "email is required" });
        }
        if (!emailRegex(email)) {
            return res.status(400).send({ status: false, message: "email is invalid" });
        }

        //----------------------------- Validating password -----------------------------//
        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "password is required" });
        }
        if (!passwordRegex(password)) {
            return res.status(400).send({ status: false, message: "password should be strong please use One digit, one upper case , one lower case ,one special character, it between 8 to 15" });
        }
        //-----------Bcrypting Password -----------//
        data.password =  bcrypt.hashSync(data.password); // FOR ENCRYPTED PASSWORD


        //----------------------------- Checking Duplicate Email -----------------------------//
        let customerEmail = await customerModel.findOne({ email });
        if (customerEmail) {
            return res.status(409).send({ status: false, message: "This e-mail address already exist, Please enter another one" });
        }

        //----------------------------- Creating customer Data -----------------------------//
        const createData = await customerModel.create(data);
        return res.status(201).send({ status: true, message: "customer Created Successfully", data: createData });

    }catch(error){
        return res.status(500).send({ status: false, message: error.message });
    }
};


//################################customer Login################################################


const customerLogin= async(req,res)=>{
    

    try{

        const data = req.body;

        //----------------------------- Validating body -----------------------------//
        if (!isValidBody(data)) {
            return res.status(400).send({ status: false, message: "Please Enter Login Credentials..." });
        }

        const { email, password } = data;

        //----------------------------- Validating Email -----------------------------//
        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "Please enter Email Id" });
        }
        if (!emailRegex(email)) {
            return res.status(400).send({ status: false, message: "Email is not valid" });
        }

        //----------------------------- Validating Password -----------------------------//
        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "Please enter Password" });
        }
        if (!passwordRegex(password)) {
            return res.status(400).send({ status: false, message: "password should be strong please use One digit, one upper case , one lower case ,one special character, it between 8 to 15" });
        }

        //----------------------------- Checking Credential -----------------------------//
        const customer = await customerModel.findOne({ email });

        if (customer) {
            const validPassword =  bcrypt.compareSync(password, customer.password);
                           
            if (!validPassword) {
                return res.status(401).send({ status: false, message: "Invalid Password Credential" });
            }
        }
        else {
            return res.status(401).send({ status: false, message: "Invalid email Credential" });
        }


             ///////////////////token generation/////////////////////////////////////////////////////
          const token = jwt.sign({
            customerId: customer._id.toString(),

          },"doneByBabu");
          res.setHeader("Authorization",token);
          res.status(200).send({ status:true,message:"you are successfully logged in", data:{token}} )


    }catch(error){
        return res.status(500).send({ status: false, message: error.message });
    }
}


////////////////////////////////////get customer//////////////////////////////

const getCustomer = async(req,res)=>{

    try{
   let  customerId = req.params.customerId;
   
   let customerData = await customerModel.findById(customerId).select({fname: 1, lname: 1, email: 1, noOfOrder: 1, customerType: 1, totalDiscount: 1, orderDiscount: 1})
   return res.status(200).send({status:true,message:"find customer details",data:customerData}) 
    }catch(error){
        return res.status(500).send({ status: false, message: error.message });

    }
}



module.exports = {createCustomer,customerLogin,getCustomer};


