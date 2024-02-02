import { Router } from "express";
import {getJournal} from "../controllers/journal.controller.js";

const router = Router();

let allPosts = [];
 
router.route("/").get(async (req, res) => {  
    await getJournal().then((result) => {
        allPosts = [...result];
        res.render("home", {
          allPost: allPosts,
        });
    });
})



export default router