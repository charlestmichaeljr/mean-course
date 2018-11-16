const Post = require('../models/post');

exports.createPost =  (req, resp, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename,
        creator: req.userData.userId
    })
    console.log('User Data: ' + req.userData);
    //return resp.status(200).json({});
    post.save().then(createdPost => {
        console.log("Result of add is " + createdPost);
        resp.status(201).json({
            message: 'Successfully added',
            post: {
                id: createdPost._id,
                title: createdPost.title,
                content: createdPost.content,
                imagePath: createdPost.imagePath,
                creator: createdPost.creator
            }
        })
    })
        .catch(ex => {
            resp.status(500).json({
                message: 'Creating a post failed'
            })
        });

};

exports.updatePost = (req, resp, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename;
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    // only deletes if you have the same id and creator as what is on the database
    Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post)
        .then(result => {
            console.log(result);
            if(result.n > 0) {
                resp.status(200).json({message: 'Record updated'});
            } else {
                resp.status(401).json({message: 'Not authorized!'})
            }

        })
        .catch(ex => {
            resp.status(500).json({
                message: 'Error updating your post'
            });
        });
};

exports.getPosts = (req, resp, next) => {
    console.log(req.query);
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;

    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize)
    }
    postQuery.then(documents => {
        fetchedPosts = documents;
        return Post.count();
    })
        .then(postCount => {
            resp.status(200).json({
                message: 'Posts returned successfully',
                posts: fetchedPosts,
                maxPosts: postCount
            })
        })
        .catch(ex => {
            resp.status(500).json({
                message: 'Error getting posts'
            })
        })
};

exports.getPostById = (req, resp, next) => {
    Post.findById(req.params.id)
        .then(post => {
            if (post) {
                resp.status(200).json(post);
            } else {
                resp.status(404).json({message: 'Post not found'})
            }
        })
        .catch(ex => {
            resp.status(500).json({
                message: 'Error getting single post'
            })
        })
};

exports.deletePost = (req, resp, next) => {
    console.log('ID to be deleted is ' + req.params.id);
    // only deletes if you have the same id and creator as what is on the database
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId }).then(result => {
        console.log(result);
        if(result.n > 0) {
            resp.status(200).json({message: 'Post Deleted'});
        } else {
            resp.status(401).json({message: 'Not authorized!'})
        }
    })
        .catch(ex => {
            resp.status(500).json({
                message: 'Error deleting a post'
            })
        });
};
