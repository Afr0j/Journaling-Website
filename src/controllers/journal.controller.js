import Blog from "../models/blog.model.js";
import wrapper from "../utils/wrapper.js";

const getJournal = async function () {
  let posts;
  await Blog.find({}).then((result) => {
    posts = result;
  });
  return posts;
};



const createJournal = wrapper(async (req, res)=> {
 
  const newBlog = new Blog({
    title: req.body.title,
    post: req.body.post
  });
    await newBlog.save().then((newPost) => {
      res.redirect("/");
})})


export {getJournal,createJournal}
