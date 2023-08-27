const http=require('http');
const fs=require('fs');

const server=http.createServer((req,res)=>{
  console.log(req.url,req.method);

  res.setHeader('Content-Type','text/html');
  fs.readFile('./html/index1.html', (err,data)=>{
    if(err){
    console.log(err);
    res.end();
  }else{
    res.write(data);
    res.end();    
  }
})  
});
server.listen(3000,'localhost',()=>{
    console.log('listening for response on port 3000');
})




const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017',
{
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: username,
      password: hashedPassword
    });
    await newUser.save();
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.redirect('/signup');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        res.send('Login successful');
      } else {
        res.send('Incorrect password');
      }
    } else {
      res.send('User not found');
    }
  } catch (error) {
    console.error(error);
    res.send('An error occurred');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

