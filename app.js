const express = require("express")
const {User, Post} = require("./models")
const bcrypt = require("bcryptjs")
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken")

const db = require("./models/index.js");
require('dotenv').config()


const { createClient } = require('@supabase/supabase-js')
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const app = express();
const port = process.env.PORT || 4040;
const cors = require("cors");
const SECRET_KEY = "hgdksjhdsijhkdsfhjiosjd"

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'none'; font-src 'self' https://fonts.gstatic.com;");
    next()
});

const { data, error } = await supabase.functions.invoke('hello-world', {
  body: { name: 'Functions' },
})

app.get("/healthcheck", async (req, res) => {
    try{
        await db.sequelize.authenticate();
        await db.sequelize.close()
        res.status(200).send("I'm healthy")
    } catch (error) {
        await db.sequelize.close()
        res.status(500).send("Unable to connect to database!")
    }
})


app.post("/api/signup", async (req, res) => {
    
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await User.create({
            username: req.body.username,
            displayName: req.body.display_name,
            email: req.body.email,
            passwordHash: hashedPassword,
            bio: req.body.bio,
            profilePicture: req.body.profile_picture
        })
        const token = jwt.sign(
            {
            email: User.email,
            id: User.id
        }, 
            SECRET_KEY,
            {expiresIn: "3h"}
        )

        res.status(200).send({ message: "User created!" });
    }   catch (error) {
        res.status(500).send({error: "Failed to create user." })
    }
});

const authenticateUser = async (req, res, next) => {
    // console.log(res.body)
    const user_id_auth = req.cookies.user_id
    if (!user_id_auth) {
        return res.status(401).send("Unauthorized");
    }
    try {
        req.current_user = await User.findOne({where: { id: user_id_auth } })
        next()
    } catch (error) {
        res.status(401).send("Invalid token.")
    }
};

app.post("/api/login", async (req, res) => {

    const { email, password } = req.body;
    if (!(email && password)) {
        res.status(401).send({message: "Email or Password is missing."})
    }
    try {
        const user = await User.findOne({
            where: { email }
        })
        if (!user) {
            return res.status(400).send('User not found.');
        }

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
            return res.status(401).send("Invalid credentials.");
        }
        const token = jwt.sign({email: user.email, id: user.id}, SECRET_KEY, {expiresIn: "3h"})
        res.cookie("user_id", user.id, {
            httpOnly: true,
          // secure: true,
            maxAge: 3600000
        })

        res.status(200).send({message : "User has logged in.", token});

    } catch(error) {
        res.status(500).send({message: `Error: ${error}`})
    }
});

app.get("/api/feed", authenticateUser, async(req, res) => {
    try{
        const posts = Post.findAll()
        res.status(201).json({ posts: posts, email: req.current_user.email});
    } catch (error) {
        res.status(500).json({error: "Failed to fetch posts"});
    }
    console.log("yaya feed endpoint!")
})


app.post("/api/post", authenticateUser, async(req, res) => {
    try{
        const newPost = await Post.create({
            content: req.body.content,
            userId: req.current_user.id,
            type: req.body.type,
            postedAt: new Date(),
        })
        res.status(200).send({message: "Tweet posted successfully.", post_details: newPost})
    } catch (error) {
        res.status(501).send({error: "Failed to post a tweet."})
    }
})

app.post("/api/delete-post", authenticateUser, async(req, res) => {
    try{
        const deletePost = await Post.destroy({
            where:{
                userId: req.current_user.id
            } 
        })
        res.status(200).send({message: "Tweet deleted successfully.", post_details: deletePost})
    } catch (error) {
        res.status(501).send({error: "Failed to delete a tweet."})
    }
})


app.listen(port, () => {
    console.log("App running on port 3000.")
});



