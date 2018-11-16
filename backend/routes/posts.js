const express = require('express');
const checkAuthentication = require('../middleware/check-auth');
const PostController = require('../controllers/posts');
const extractFile = require('../middleware/file-uploading');

const router = express.Router();

router.post('',checkAuthentication,
    extractFile,
    PostController.createPost
    )

router.put('/:id',
    checkAuthentication,
    extractFile,
    PostController.updatePost
    )

router.get('', PostController.getPosts)

router.get('/:id', PostController.getPostById)

router.delete('/:id',
    checkAuthentication, // check authentication before delete. If failed, checkAuthentication returns an error and the rest
                            // of the code will be bypassed.
    PostController.deletePost
    )

module.exports = router;
