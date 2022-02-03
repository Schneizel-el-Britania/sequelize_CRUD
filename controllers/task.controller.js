const {Task} = require('../models');


module.exports.createTask = async(req, res, next)=>{
  try {
    const {body, userInstance} = req;
    console.log(userInstance)
    //const task = await Task.create({...body, userId: id});
    const task = await userInstance.createTask(body);
    res.status(201).send({data: task});
  } catch (error) {
    next(error)
  }
}

module.exports.getUserTasks = async(req, res, next)=>{
  try {
    const {userInstance} = req;
    const tasks = await userInstance.getTasks();
    res.status(200).send({data: tasks});
  } catch (error) {
    next(error)
  }
}

module.exports.updateUserTask = async(req, res, next)=>{
  try {
    const {body, userInstance, taskInstance} = req;
    if(await userInstance.hasTask(taskInstance)){
      const updatedTask = await taskInstance.update(body, {
        returning: true
      });
      return res.status(200).send({data: updatedTask});
    }
    next(new Error("task not associated with user!"));
  } catch (error) {
    next(error);
  }
}
module.exports.deleteUserTask = async(req, res, next)=>{
  try {
    const {userInstance, taskInstance} = req;
    if(await userInstance.hasTask(taskInstance)){
      await taskInstance.destroy();
      return res.redirect('/');
    }
    next(new Error("task not associated with user!"));
  } catch (error) {
    next(error);
  }
}