const express = require('express');
const pool = require('./queries');
const path = require('path');
require('dotenv').config();

const app = express();
app.get('/get',(req,res)=>{
  pool.query('SELECT date,name,count,distance FROM Distance',[],(err, result)=>{
    if (result?.rows){
      res.status(200).json(result.rows);
    }
    else{
      res.status(400).json({message:'Нет данных'});
    }
  });
});

app.get('/create',(req,res)=>{
  pool.query('CREATE TABLE Distance(date DATE, name varchar(255),count int, distance int)',[],(err, result)=>{
    res.json({result});
  });
});

app.get('/create/data',(req,res)=>{
  const date = '02-04-2022';
  for (let i=1; i<30; i++)
  {
    const count = Math.floor(Math.random() * 100);
    const dist = Math.floor(Math.random()*200);
    const name = `Super ${i}`;
    console.log(name,count,dist);
    pool.query('INSERT INTO Distance (date, name, count, distance) VALUES ($1,$2,$3,$4)',[date,name,count,dist],(err, result)=>{
    console.log(err);
    })
  }
  res.json('ok');
});

if (process.env.PRODUCTION == 'true'){
  console.log(1);
  app.use('/',express.static(path.join(__dirname,'/client','build')));
  app.get('*',(req,res)=>{
    console.log(1);
    res.sendFile(
      path.resolve(__dirname,'client','build','index.html'));}
    );
}

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
  console.log(`Server has been started on ${PORT} port`);
});