import { Router } from "express"

const router = Router()

router.get("/", (req, res) => {
    res.render("home", {
        title: 'Home Page',
        scriptPath: ['/js/main.js', '/js/home.js'],
        cssPath: ['/css/main.css', '/css/home.css']
      })
})

export default router