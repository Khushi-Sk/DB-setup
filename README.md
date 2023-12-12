# **Database Schema Design in Twitter**

## User
### Table name: Users
  attributes: 
  * id : bigint serial primary key 
* username : string 50 chars max, unique, not null
+ displayName : string 50, not null
- email : string 100 chars max , unique, not null
    + passwordHash : string 100 chars max, not null
    emailVerifiedAt : timestamp
    website : string 100 chars max
    location : string 50 chars max
    bio : string 200 chars max, not null
    profilePicture : string 1200 chars max
    coverPicture : string 1200 chars max
    isPublic : boolean
    createdAt : timestamp, not null
    updatedAt : timestamp, not null

## Post
### Table name: Posts
  attributes:
    id : bigint serial primary key
    content : string (280 chars max)
    posted_at : timestamp
    user_id : bigint foreign key, not null
    type : ENUM(['posts', 'repost', 'comment']), not null
    deletedAt : timestamp
    createdAt : timestamp, not null
    updatedAt : timestamp, not null

## Like
### Table name: Likes
  attributes:
    id : bigint serial primary key
    user_id : bigint foreign key, not null
    post_id : bigint foreign key, not null
    timestamp : timestamp, not null
    createdAt : timestamp, not null
    updatedAt : timestamp, not null

## Follow
### Table name: Follows
  attributes:
    id :  bigint serial primary key (autoIncrement)
    followerId :  bigint foreign key, not null (unique, followerId !== followingId)
    followingId :  bigint foreign key, not null
    followedAt : timestamp, not null
    createdAt : timestamp, not null
    updatedAt : timestamp, not null
    
