const express = require('express');
const Post = require('../models/post');
const multer = require('multer');
const router = express.Router();
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};
const storage = multer.diskStorage({
  destination: (req,file,callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type of ' + file.mimetype);
    if(isValid) {
      error = null;
    }
    callback(error,'backend/images')
  },
  filename: (req,file,callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + '-' + Date.now() + '.' + ext);
  }
})

router.post('',multer({storage: storage}).single('image'),(req,resp,next)=>{

  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename
  })
  console.log(post);
  post.save().then(createdPost => {
    console.log("Result of add is " + createdPost);
    resp.status(201).json({
      message: 'Successfully added',
      post: {
        id: createdPost._id,
        title: createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath
      }
    })
  });

})

router.put('/:id',(req,resp,next)=>{
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id},post)
    .then(result => {
      console.log(result);
      resp.status(200).json({message:'Record updated'});
    });
})

router.get('',(req, resp, next) => {
  Post.find()
    .then(documents=>{
      resp.status(200).json({message: 'Posts returned successfully',
        posts: documents})
    })
})

router.get('/:id',(req,resp,next) => {
  Post.findById(req.params.id)
    .then(post => {
      if(post) {
        resp.status(200).json(post);
      } else {
        resp.status(404).json({message: 'Post not found'})
      }
    })
})

router.delete('/:id',(req,resp,next)=>{
  console.log('ID to be deleted is ' + req.params.id);
  Post.deleteOne({_id: req.params.id}).then(result=>{
    console.log(result);
    resp.status(200).json({message: 'Post deleted'});
  });

})

module.exports = router;
