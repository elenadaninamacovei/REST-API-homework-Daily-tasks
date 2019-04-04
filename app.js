import express from 'express';
import db from './db/db';
import bodyParser from 'body-parser';

// Set up the express app
const app = express();

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//GET all tasks
app.get('/api/v1/todos', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'Task retrieved successfully',
    todos: db
  })
});
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});

//CREATE task
app.post('/api/v1/todos', (req, res) => {
  if(!req.body.title) {
    return res.status(400).send({
      success: 'false',
      message: 'title is required'
    });
  } else if(!req.body.date) {
    return res.status(400).send({
      success: 'false',
      message: 'date is required'
    });
  }
 const todo = {
   id: db.length + 1,
   title: req.body.title,
   description: req.body.description,
   date: req.body.date,
   starts_at: req.body.starts_at,
   ends_at: req.body.ends_at,
   room: req.body.room
 }
 db.push(todo);
 return res.status(201).send({
   success: 'true',
   message: 'Task added successfully',
   todo
 })
});

//GET a single task
app.get('/api/v1/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.map((todo) => {
    if (todo.id === id) {
      return res.status(200).send({
        success: 'true',
        message: 'Task retrieved successfully',
        todo,
      });
    } 
});
 return res.status(404).send({
   success: 'false',
   message: 'Task does not exist',
  });
});

//DELETE task
app.delete('/api/v1/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.map((todo, index) => {
    if (todo.id === id) {
       db.splice(index, 1);
       return res.status(200).send({
         success: 'true',
         message: 'Task deleted successfuly',
       });
    }
  });


    return res.status(404).send({
      success: 'false',
      message: 'Task not found',
    });

 
});

//UPDATE task
app.put('/api/v1/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  let todoFound;
  let itemIndex;
  db.map((todo, index) => {
    if (todo.id === id) {
      todoFound = todo;
      itemIndex = index;
    }
  });

  if (!todoFound) {
    return res.status(404).send({
      success: 'false',
      message: 'Task not found',
    });
  }

  if (!req.body.title) {
    return res.status(400).send({
      success: 'false',
      message: 'title is required',
    });
  } else if (!req.body.date) {
    return res.status(400).send({
      success: 'false',
      message: 'date is required',
    });
  }

  const updatedTodo = {
    id: todoFound.id,
    title: req.body.title || todoFound.title,
    description: req.body.description || todoFound.description,
    date: req.body.date || todoFound.date, 
    starts_at: req.body.starts_at || todoFound.starts_at,
    ends_at: req.body.ends_at || todoFound.ends_at,
    room: req.body.room || todoFound.room
  };

  db.splice(itemIndex, 1, updatedTodo);

  return res.status(200).send({
    success: 'true',
    message: 'Task updated successfully',
    updatedTodo,
  });
});