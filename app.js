const express = require("express")
const {User, Post, Like, Follow, Retweet} = require("./models/index.js")
const bcrypt = require("bcryptjs")
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken")

const db = require("./models/index.js");

const app = express();
const port = 3000;
const cors = require("cors");
const SECRET_KEY = "hgdksjhdsijhkdsfhjiosjd"

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.get("/healthcheck", async (req, res) => {
    try{
        await db.sequelize.authenticate();
        // await db.sequelize.close()
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

        res.status(200).send({ message: "User created!",  token });
    }   catch (error) {
        res.status(500).send({error: "Failed to create user." })
    }
});

const authenticateUser = async (req, res, next) => {
    // console.log(res.body)
    const user_id_auth = req.body.user_id
    if (!user_id_auth) {
        return res.status(401).send("Unauthorized");
    }
    try {
        const jwtData = jwt.decode(user_id_auth, SECRET_KEY)
        console.log(jwtData)
        req.current_user = await User.findOne({where: { id: jwtData.user_id } })
        next()
    } catch (error) {
        res.status(401).send(`Invalid token., Error: ${error}`)
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
        const token = jwt.sign({email: user.email, "user_id": user.id}, SECRET_KEY, {expiresIn: "3h"})
        res.cookie("user_id", token, {
            httpOnly: false,
            secure: true,
            maxAge: 3600000
        })

        res.status(200).send({message : "User has logged in.", token});

    } catch(error) {
        res.status(500).send({message: `Error: ${error}`})
    }
});

app.post("/api/feed", authenticateUser, async(req, res) => {
    try{
        const user_id_auth = await req.body.user_id
        const jwtData = jwt.decode(user_id_auth, SECRET_KEY)

        const posts = await Post.findAll()
        res.status(201).json({ posts: posts, email: jwtData.email});
    } catch (error) {
        res.status(500).json({error: "Failed to fetch posts"});
    }
    console.log("yaya feed endpoint!")
})

app.post("/api/userId", authenticateUser, async (req,res) => {
    try{
        const user_id_auth = req.body.user_id
        const jwtData = jwt.decode(user_id_auth, SECRET_KEY)
        const userId = await User.findOne({where: {id: jwtData.user_id}})
        console.log(userId)
        res.status(200).send({userId})
    } catch (err) {
        res.status(401).send({error: `Request failed, ${err}`});
    }
})

app.post("/api/post", authenticateUser, async(req, res) => {
    try{
        const user_id_auth = req.body.user_id
        const jwtData = jwt.decode(user_id_auth, SECRET_KEY)
        // console.log(jwtData)
        const newPost = await Post.create({
            content: req.body.content,
            userId: jwtData.user_id,
            type: req.body.type,
            postedAt: req.body.postedAt,
        })
        res.status(200).send({message: "Tweet posted successfully.", post_details: newPost})
    } catch (error) {
        res.status(501).send({error: `Failed to post a tweet., ${error}`})
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


app.post("/api/like", async(req, res) => {
    try {
        const user_id_auth = await req.body.user_id
        const jwtData = jwt.decode(user_id_auth, SECRET_KEY)
        // console.log(jwtData.id)
        const postId = await req.body.post_id
        const existingLike = await Like.findOne({ 
            where: {
                userId: jwtData.user_id,
                postId: postId,
        }})
        if (existingLike) {
            try{
                const like = await Like.destroy({
                    where: {userId: jwtData.user_id,
                        postId: postId, }
                })    
        } catch (er) {
            res.status(501).send({message: `There's an error. Error is ${er}`})
        }}
        if (!existingLike) {
            try {
                const like = await Like.create({
                userId: jwtData.user_id,
                postId: postId,
                timestamp: new Date()
            })
            res.status(200).send({message: "Liked successfully.", likeData: like})
            } catch (err) {
                res.status(401).send({Error: `There's an error. ${err}`})
            }   
        } else{
        res.status(200).send({message: "Sorry, Like already exists with this user and post."})
    }} catch (err) {
        res.status(401).send({Error: "Unable to like. Error: ", err})
    }
})

app.get("/api/likeCount/:id", async(req, res) => {
// authenticateUser,

    // const user_id_auth = req.body.user_id
    // const jwtData = jwt.decode(user_id_auth, SECRET_KEY)
    const postId = req.params.id;
    try{
        const likeCount = await Like.count({
                where: {postId: postId}
            })
        res.status(200).send({message: likeCount})  //userId: jwtData.user_id})
    } catch (err) {
        res.status(501).send(Error`: ${err}`)
    }
})

app.post("/api/retweet", async(req, res) => {
    try {
        const user_id_auth = await req.body.user_id
        if (!user_id_auth) {
            res.status(200).send({message: `User doesn't exist.`})
        } else {
            const jwtData = jwt.decode(user_id_auth, SECRET_KEY)
        // console.log(jwtData.id)
            const postId = await req.body.post_id
            const existingRetweet = await Retweet.findOne({ 
                where: {
                    userId: jwtData.user_id,
                    postId: postId,
            }})
        if (existingRetweet) {
            try{
                const retweet = await Retweet.destroy({
                    where: {userId: jwtData.user_id,
                        postId: postId, }
                    })    
        } catch (er) {
            res.status(501).send({message: `There's an error. Error is ${er}`})
        }}
        if (!existingRetweet) {
            try {
                const retweet = await Retweet.create({
                userId: jwtData.user_id,
                postId: postId,
                timestamp: new Date()
            })
            res.status(200).send({message: "Retweeted successfully.", retweetData: retweet})
            } catch (err) {
                res.status(401).send({Error: `There's an error. ${err}`})
            }   
        } else{
        res.status(200).send({message: "Sorry, Retweet already exists with this user and post."})
        }}
        }
         catch (err) {
        res.status(401).send({Error: "Unable to like. Error: ", err})
    }
})

app.get("/api/retweetCount/:id", async(req, res) => {
// authenticateUser,

    // const user_id_auth = req.body.user_id
    // const jwtData = jwt.decode(user_id_auth, SECRET_KEY)
    const postId = req.params.id;
    try{
        const retweetCount = await Retweet.count({
                where: {postId: postId}
            })
        res.status(200).send({message: retweetCount})  //userId: jwtData.user_id})
    } catch (err) {
        res.status(501).send(Error`: ${err}`)
    }
})

app.listen(port, () => {
    console.log("App running on port 3000.")
});



