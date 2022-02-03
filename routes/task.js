const {Router} = require('express');
const TaskController = require('../controllers/task.controller');
const { checkTask } = require('../middlewares/task.mw');
const {checkUser} = require('../middlewares/user.mw');

const taskRouter = Router();

taskRouter.post('/:userId', checkUser, TaskController.createTask);
taskRouter.get('/:userId', checkUser, TaskController.getUserTasks);
taskRouter.patch('/:userId/:taskId', checkUser, checkTask, TaskController.updateUserTask);
taskRouter.delete('/:userId/:taskId', checkUser, checkTask, TaskController.deleteUserTask);

module.exports = taskRouter;