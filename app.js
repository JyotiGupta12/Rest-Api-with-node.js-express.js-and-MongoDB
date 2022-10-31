const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(express.static("public"));

// connecting to mongo db
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});
const articleSchema = new mongoose.Schema({
    title: String,
    content:String
})

const Article = mongoose.model("Article", articleSchema);
// chainning all methods using app.route method.
app.route("/articles")
.get(function(req,res){
    Article.find(function(err, foundArticle){
        // console.log(foundArticle);
        if(!err){
            res.send(foundArticle);
        }
        else{
            res.send(err);
        }
    });
})
.post(function(req,res){
    // console.log(req.body.title)
    // console.log(req.body.content)
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err){
        if(!err){
            console.log("successfully added")
        }else{
            res.send(err);
        }
    });
})
.delete(function(req,res){
    Article.deleteMany(function(err){
       if(!err){
        res.send("Successfully deleted all articles. ");
       }else{
        res.send(err);
       }
    });
});
// ------------------------------app.route("/article:one article route")--------------------------------------//

app.route("/articles/:articleTitle")

.get(function(req, res){
    Article.findOne({title: req.params.articleTitle},function(err, foundarticle){
        if(foundarticle){
            res.send(foundarticle)
        }else{
            res.send(err);
        }
    })
})
.put(function(req,res){
    Article.updateOne(
      {title:req.params.articleTitle},
      {title:req.body.title,content:req.body.content},
      function(err){
    if(!err){
        console.log("successfully updated");
    }
    else{console.log(err)}
      })
})
.patch(function(req,res){
    Article.updateOne(
       {title:req.params.articleTitle},
       {$set:req.body},
       function(err){
       if(!err){
        console.log("successfully updated");
    }
    else{console.log(err)}
      }
    )
})
.delete(function(req,res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
        if(!err){
            res.send("successfully deleted the item")
        }else{
            res.send(err)
        }
    })
})


app.listen(3000, function(){
    console.log("server has started on server 3000")
})
