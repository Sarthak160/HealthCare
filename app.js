const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost:27017/prodb", {useNewUrlParser:true, useUnifiedTopology:true});

const patientSchema = new mongoose.Schema({
    name: String,
    age: Number,
    sex: String,
    email: String,
    password: String,
    phone: String,
    illness: String,
    prescriptions: [{
        date: Date,
        text: String
    }]
})
const patient = mongoose.model("patient", patientSchema);

const doctorSchema = new mongoose.Schema({
    name: String,
    age: Number,
    photo: String,
    sex: String,
    phone: String,
    email: String,
    password: String,
    speciality: String,
    patients: [{
        id: String
    }],
    acheivements: []

})
const doctor = mongoose.model("doctor", doctorSchema);

app.post("/signinasp", function(req, res){
    patient.find({email: req.body.email}, function(err, data){
        if(err){
            console.log(err);
        }
        else{
            if(data){
                bcrypt.compare(req.body.password, data[data.length-1].password, function(err, result) {
                    // result == true
                    if(err){
                        console.log(err);
                    }else{
                        if(result===true){
                            console.log(data);
                            res.send("welcome");
                        }else{
                            res.send(" no get out");
                        }
                    }
                });
            }else{
                res.send("get out");
            }
        }
    });
})

app.post("/registerasp", function(req, res){
    var pass;
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        pass = hash;
        console.log(pass);
        const temp = new patient({
            name: req.body.name,
            age: req.body.age,
            sex: req.body.sex,
            email: req.body.email,
            password: pass,
            phone: req.body.phone,
            illness: "",
            prescriptions: []
        });
        temp.save();
        res.send(temp);
    
    });
    
})

app.post("/registerasd", function(req, res){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const temp = new doctor({
            name: req.body.name,
            age: req.body.age,
            photo: "",
            sex: req.body.sex,
            phone: req.body.phone,
            email: req.body.email,
            password: hash,
            speciality: req.body.speciality,
            patients: [],
            acheivements:[]
        });
        console.log(hash);
        temp.save();
        res.send(temp);
    
    });
    })

app.post("/signinasd", function(req, res){
    doctor.find({email: req.body.email}, function(err, data){
        if(err){
            console.log(err);
        }
        else{
            if(data){
                bcrypt.compare(req.body.password, data[data.length-1].password, function(err, result) {
                    if(err){
                        console.log(err);
                    }else{
                        if(result===true){
                            console.log(data);
                            res.send("welcome");
                        }
                        else{
                            console.log(data[0].password);
                            res.send(" no get out");
                        }
                    }
                });
                
            }else{
                res.send("get out");
            }
        }
    });
})

app.get("/registerasp", function(req, res){
    res.render("RegisterforPatient");
})

app.get("/registerasd", function(req, res){
    res.render("RegisterforDoctor");
})

app.get("/signinasp", function(req, res){
    res.render("loginPatient");
})

app.get("/signinasd", function(req, res){
    res.render("loginDoctor");
})

app.get("/patient/:id", (req, res)=>{
    patient.find({_id: req.params.id}, function(err, data){
        if(err)
            console.log(err);
        else{
            console.log(data[0].name);
            res.render("patient", {inf: data[0]});      
        }
    })
})

app.get('/', (req, res)=>{
    const x= new patient({
        name: "Ritik", 
        age: 20,
        email: "jain@gmail.com",
        password: "qwerty",
        illness: "cold", 
        prescriptions:[{
            date: new Date(),
            text: "hola just keep going"
        },
        {
            date: new Date(),
            text: "Good luck"
        }]
    });
    // x.save();
    
    res.render("index");
})

app.listen(3000, function(){
    console.log("server started");
})
