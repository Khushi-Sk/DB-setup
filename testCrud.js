
const { DataTypes } = require("sequelize")
const {User, Post, Like, Follow} = require("./models");
const post = require("./models/post");


async function createdRecord () {
    

    // const user = await User.create({
    //     username: "khushi_111",
    //     displayName: "khushi",
    //     email: "khushi@example.com",
    //     passwordHash: "#1234",
    //     bio: "Hey there!",
    //     profilePicture: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //     coverPicture: "https://images.unsplash.com/photo-1506102383123-c8ef1e872756?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

    // })

    // const user2 = await User.create({
    //     username: "Aisha_111",
    //     displayName: "Aisha",
    //     email: "aisha@example.com",
    //     passwordHash: "#1234",
    //     bio: "Hey there!",
    //     profilePicture: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //     coverPicture: "https://images.unsplash.com/photo-1506102383123-c8ef1e872756?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

    // })

    // const post = await Post.create({
    //     content: "Those 'can I call you' people are so wonderful. No you can't call me but thank you for asking.",
    //     userId: 2,
    //     type: "post",
    //     postedAt: new Date(),

    // })

    const like = await Like.create({
        userId: 1, 
        postId: 1,
        timestamp: new Date()
    })

    //Deleted Like
    // const like = await Like.destroy({
    //     where: {
    //         id: 2
    //     }
    // })


    // const follow = await Follow.create({
    //     followerId: 1, 
    //     followingId: user2.id,
    //     followedAt: new Date()
    // })


}

createdRecord()