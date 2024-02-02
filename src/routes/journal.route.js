import { Router } from "express";
import Blog from "../models/blog.model.js";
import {createJournal} from "../controllers/journal.controller.js";

const router = Router();

router.route("/compose")
.get((req, res) => {
  res.render("compose",{title:null, post:null});
})
.post(createJournal)

//post routes
router.route("/:param").get(async (req, res) => {
  await Blog.findOne({ title: req.params.param }).then((found) => {
    console.log("found "+found);
    res.render("post", { title: found.title, post: found.post });
  });
});

//delete routes
router.route("/:param/delete").get(async (req, res) => {
  await Blog.findOne({ title: req.params.param })
    .deleteOne()
    .then(() => { 
      res.redirect("/");
    });
});

//edit routes

router.route("/:param/edit")
.get( async (req, res) => {
  const found = await Blog.findOne({ title: req.params.param })

  res.render("compose", {title:found.title, post:found.post})})
.post(async (req, res) => {

    const updated = await Blog.findOneAndUpdate({ title: req.params.param },{title:req.body.title, post:req.body.post});
    res.redirect("/");
});
export default router;
