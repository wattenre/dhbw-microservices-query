const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const cors = require('cors'); 
app.use(cors());

const axios = require('axios');

const posts = {};

const handleEvent = (type, data) => {
    if (type === 'PostCreated') {
      const { id, title } = data;
  
      posts[id] = { id, title, comments: [] };
    }
  
    if (type === 'CommentCreated') {
      const { id, content, postId, status } = data;
  
      const post = posts[postId];
      post.comments.push({ id, content, status });
    }
  
    if (type === 'CommentUpdated') {
      const { id, content, postId, status } = data;
  
      const post = posts[postId];
      const comment = post.comments.find(comment => {
        return comment.id === id;
      });
  
      comment.status = status;
      comment.content = content;
    }
};

app.get('/posts',(req,res)=> {
    console.log(posts);
    res.send(posts);
}); 

app.post('/events',(req,res)=> {
  const { type, data } = req.body;

  handleEvent(type, data);

  res.send({});
});

app.listen(4002, () => {
    console.log('Listening on 4002');
});