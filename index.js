const express = require('express');
const pool = require('./queries');
const path = require('path');
const names = require('./name.json');

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

app.get('/create/table',(req,res)=>{
  pool.query('CREATE TABLE Distance(date DATE, name varchar(255),count int, distance int)',[],(err, result)=>{
    res.json({ok});
  });
});

app.get('/create/data',(req,res)=>{
  const today = new Date(Date.now());
  const maxName = names.name.length;
  for (let i=1; i<32; i++)
  {
    const count = Math.floor(Math.random() * 100);
    const dist = Math.floor(Math.random()*200);
    const numName = Math.floor(Math.random()*(maxName-1));
    const name = names.name[numName];
    pool.query('INSERT INTO Distance (date, name, count, distance) VALUES ($1,$2,$3,$4)',[today,name,count,dist],(err, result)=>{
    })
  }
  res.json('ok');
});

if (process.env.PRODUCTION == 'true'){
  app.use('/',express.static(path.join(__dirname,'/client','build')));
  app.get('*',(req,res)=>{
    res.sendFile(
      path.resolve(__dirname,'client','build','index.html'));}
    );
}

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
  console.log(`Server has been started on ${PORT} port`);
});