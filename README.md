# Challenge 01 - Node.js (Rocketseat - Ignite)

## What is this?
This is a basic todo list API

## What was the challenge?
Given a code template with express routes, I had to write the code that handled all the API requests such as:
- `GET`
- `POST`
- `PUT`
- `PATCH`
- `DELETE`

Some of the functionalities of the API are:
- Create, read, update, delete todos
- Create an user accont
- Change done property of the todos from `false` to `true`

## What I added here:
After passing all the tests I saw that I was repeating too much code to validate todos, so I wrote a middleware that helped me reduce the amount of lines of code of the API and make it more simple and clean
```js
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
```

## What I learned with this challenge?
- How to write my own middlewares to make code clean and concise
- Better understanding of the `CRUD` functionalities of an API
- How to read and deal of tests when it comes to backend development
