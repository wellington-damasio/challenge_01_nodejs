const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(req, res, next) {
  const { username } = req.headers
  const userExists = users.some(user => user.username === username)

  if(!userExists) {
    return res.status(404).json({error: 'User not found'})
  }

  const user = users.find(user => user.username === username)

  req.user = user

  next()
}

function checkExistsTodo(req, res, next) {
  const { user } = req
  const { id } = req.params 

  const todo = user.todos.find(todo => todo.id === id)

  if(!todo) {
    return res.status(404).json({error: 'Task  does not exists'})
  }

  req.todo = todo

  next()
}

app.post('/users', (req, res) => {
  const {name, username } = req.body

  const userExists = users.some(user => user.username === username)

  if(userExists) {
    return res.status(400).json({error: 'User already exists'})
  }

  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(newUser)

  res.status(201).json(newUser)
});

app.get('/todos', checksExistsUserAccount, (req, res) => {
  const { user } = req

  res.json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (req, res) => {
  const { user } = req
  const { title, deadline } = req.body
  const newTask = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(newTask)

  res.status(201).json(newTask)
});

app.put('/todos/:id', checksExistsUserAccount, checkExistsTodo, (req, res) => {
  const { todo } = req
  const { title, deadline } = req.body

  todo.title = title
  todo.deadline = deadline

  res.json(todo)
});

app.patch('/todos/:id/done', checksExistsUserAccount, checkExistsTodo, (req, res) => {
  const { todo } = req
  todo.done = true

  res.json(todo)
});

app.delete('/todos/:id', checksExistsUserAccount, checkExistsTodo, (req, res) => {
  const { user } = req
  const { id } = req.params 

  const todoIndex = user.todos.findIndex(todo => todo.id === id)
  user.todos.splice(todoIndex, 1)

  res.status(204).json({})
});

module.exports = app;