const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash')
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://HMS-db:dbkal4617@ms-db.qkx6p6u.mongodb.net/blogDB?retryWrites=true&w=majority', {useNewUrlParser: true});

const homeStartingContent =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, cupiditate fugit recusandae nisi praesentium doloremque, voluptatem culpa, rerum sunt pariatur perferendis ea! Excepturi consequatur suscipit quibusdam dolorem nobis nesciunt eaque.";
const aboutContent =
  " fugit autem libero minus corrupti velit sit doloremque distinctio nulla magni quaerat facere adipisci sapiente quis! Molestiae eius nam esse sapiente voluptate, quaerat error dolorem vitae, ad magni, distinctio ex tempore doloribus. Doloremque, nostrum. ";
const contactContent =
  "Tempora illo accusamus ducimus eum dicta asperiores voluptatibus perspiciatis non, veritatis quam aspernatur porro odio fugit expedita ratione voluptas reiciendis ut provident sunt? Rerum repellendus vero sed, at esse id maxime, deserunt ab molestias,";
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
  

// mongo db schema 
const blogSchema = new mongoose.Schema({
    title: String,
    postContent: String
})
const Blog = mongoose.model('posts', blogSchema)



app.get("/", (req, res) => {
  const blogPosts = []
  Blog.find({}).exec().then(blog => {
    blog.forEach(i => {
      blogPosts.push(i)
    })
    res.render("home", { homeContent: homeStartingContent, post: blogPosts });
  })
});

app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const title = req.body.title;
  const postContent = req.body.postContent;
  const post = new Blog ({
    title: title,
    postContent: postContent,
  });
  post.save()
  res.redirect("/");
});



app.get("/post/:postName", (req, res) => {
  const postName = _.lowerCase(req.params.postName) 
  
  Blog.find({}).exec().then( allPosts =>{
     allPosts.forEach( (ma) => { 
        const postTitle = _.lowerCase(ma._id) 
        if ( postTitle === postName ){
            res.render('post', {title: ma.title, postContent: ma.postContent})
        }
    }) 
  })
});


app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port 3000`);
});
