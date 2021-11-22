const express = require('express')
const { Sequelize, DataTypes } = require('sequelize')
const Task = require('./models/task')

const app = express()
const sequelize = new Sequelize({ dialect: 'sqlite', storage: './task-list.db' })
const tasks = Task(sequelize, DataTypes)

// We need to parse JSON coming from requests
app.use(express.json())

// List tasks
app.get('/tasks', async(req, res) => {
  const task = await tasks.findAll({});
    res.json({ task });
})
app.get('/tasks/:id', async(req,res)=>{
  const task = await tasks.findByPk(req.params.id);
  if (task) {
    res.send({ task });
  } else {
    res.status(404).send("a tarefa não encontrada");
  }
})

// Create task
app.post('/tasks/new',async (req, res) => {
  if (req.body.description && req.body.done) {
    const task = await tasks.create({
      description: req.body.description,
      done: req.body.done,
    });
    res.status(201).send(task);
  } else {
    res.status(400).send("Requisição não encontrada");
  }
})

// Show task
app.get('/tasks/:id', (req, res) => {
  const taskId = req.params.id

  res.send({ action: 'Showing task', taskId: taskId })
})

// Update task
app.put('/tasks/:id',async(req, res) => {
  const task = await tasks.findByPk(req.params.id);
  if ((task && req.body.description) || req.body.done) {
    await task.update(req.body);
    res.send(task);
  } else {
    res.status(404).send("Não foi atualizada a tarefa");
  }
})

// Delete task
app.delete('/tasks/:id', async(req, res) => {
  const task = await tasks.findByPk(req.params.id);
  if (task) {
    await task.destroy();
    res.send("a tarefa foi deletada!!!!");
  } else {
    res.status(404).send("tarefa não encontrada");
  }
})

app.listen(3000, () => {
  console.log('Iniciando o ExpressJS na porta 3000')
})
