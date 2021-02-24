const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

const Article = require("./models/wiki");

mongoose.connect("mongodb://localhost/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("we're connected!");
});

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: true }));
app.set(express.static(path.join(__dirname, "public")));

//Targeting  all article

app
  .route("/articles")
  .get((req, res, next) => {
    Article.find((err, foundArticles) => {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res, next) => {
    const { title, content } = req.body;

    const newArticle = new Article({
      title,
      content,
    });
    newArticle.save((err) => {
      if (!err) {
        res.send("Sucessfully added a new article");
      } else {
        console.log(err);
      }
    });
  })
  .delete((req, res, next) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send("Successfully deleted all articles");
      } else {
        res.send(err);
      }
    });
  });

//Targeting a specific article

app
  .route("/articles/:articleTitle")
  .get((req, res, next) => {
    const term = req.params.articleTitle;
    Article.findOne({ title: term }, (err, foundArticle) => {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles matching that title was found");
      }
    });
  })
  .put((req, res, next) => {
    const term = req.params.articleTitle;
    const { title, content } = req.body;
    Article.update(
      { title: term },
      { title: title, content: content },
      { overwrite: true },
      (err) => {
        if (!err) {
          res.send("Successfylly updated article");
        }
      }
    );
  })
  .patch((req, res, next) => {
    const term = req.params.articleTitle;
    const { title, content } = req.body;
    Article.update({ title: term }, { $set: req.body }, (err) => {
      if (!err) {
        res.send("Successfully update article");
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res, next) => {
    const term = req.params.articleTitle;
    Article.deleteOne(
        {title: term},
        (err) => {
            if (!err) {
                res.send("Successfully deleted the corresponding article")
            } else {
                res.send(err);
            }
        }
    )
  });

app.listen(port, () => {
  console.log(`Server Started at http://localhost:${port}`);
});
