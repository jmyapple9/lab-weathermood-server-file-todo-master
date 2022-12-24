const express = require('express');
const bodyParser = require('body-parser');


const router = express.Router();

router.use(bodyParser.json());

const todoModel = require('../model/todos.js');
// List
router.get('/todos', function (req, res, next) {
  todoModel
    .list(req.query.searchText, req.query.unaccomplishedOnly)
    .then((todos) => {
      res.json(todos);
    })
    .catch(next);
});

// Create
router.post('/todos', function (req, res, next) {
  const { mood, text } = req.body;
  if (!mood || !text) {
    const err = new Error('Mood and text are required');
    err.status = 400;
    throw err;
  }
  todoModel
    .create(mood, text)
    .then((post) => {
      res.json(post);
    })
    .catch(next);
});

// accomplish
router.post('/todos/:id', function (req, res, next) {
    console.log('server: routers/todos.js')
    const { id } = req.params;
    if (!id ) {
      const err = new Error('Post ID are required');
      err.status = 400;
      throw err;
    }
    todoModel
      .accomplish(id)
      .then((post) => {
        res.json(post);
      })
      .catch(next);
  }
);

module.exports = router;
