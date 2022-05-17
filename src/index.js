const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const userData = users.find((user) => user.username === username);

  if(!userData) {
    return response.status(404).json({ error: "Usuário não existe!" })
  }

  request.user = userData;

  return next();

}

app.post('/users', (request, response) => {

  const { name,username } = request.body;

  const userExist = users.find(user => user.username == username);

  if(userExist) {
    return response.status(400).json({ error: "Conta já existe!"})
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  };

  users.push(user);

   return response.status(201).json(user)

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  
  return response.json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {
    title,
    deadline
  } = request.body;

  const { user } = request;

  const todosOperation = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todosOperation);

  return response.status(201).json(todosOperation)

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {
    title,
    deadline
  } = request.body;

  const { id } = request.params;
  const { user } = request;


  const todos = user.todos.find(todo => todo.id === id);

  if(!todos) {
    return response.status(404).json({ error: "Erro ao completar" })
  }
  
  todos.title = title;
  todos.deadline = new Date(deadline);
  
  return response.status(200).json(todos)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const todos = user.todos.find(todo => todo.id === id);

  if(!todos) {
    return response.status(404).json({ error: "Erro ao completar" })
  }

  todos.done = true;

  return response.status(200).json(todos)

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const todos = user.todos.find(todo => todo.id === id);

  if(!todos) {
    return response.status(404).json({ error: "Erro ao completar" })
  }

  user.todos.splice(user.todos, 1);

  return response.status(204).json(todos)

});

module.exports = app;