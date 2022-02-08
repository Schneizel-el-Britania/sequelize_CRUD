const _ = require('lodash');
const createError = require('http-errors');
const {Group, User} = require('../models');

module.exports.createUserGroup = async(req, res, next)=>{
  try {
    const {body} = req;
    const values = _.pick(body, ['name','imagePath','description']);

    const user = await User.findByPk(body.userId);
    if(!user){
      return next(createError(404, 'User not found'));
    }
    const group = await Group.create({
      ...values
    })

    await group.addUser(user);

    res.status(201).send({data:group})
  } catch (error) {
    next(error)
  }
}

module.exports.getAllGroups = async(req, res, next)=>{
  try{
    const groups = await Group.findAll();
    res.status(200).send({data: groups});
  } catch(error) {
    next(error);
  }
}

module.exports.getGroupsByUser = async(req, res, next)=>{
  try {
    const {params:{userId}} = req;
    const userWithGroups = await User.findByPk(userId, {
      attributes:{exclude:'password'},
      include: [
        {
          model:Group,
          through:{
            attributes:[]
          }
        }
      ],      
    })
    if(!userWithGroups){
      return next(createError(404, 'User not found'));
    }
    res.status(200).send({data: userWithGroups});
  } catch (error) {
    next(error);
  }
}

module.exports.createImageForGroup = async(req, res, next)=>{
  try {
    const {
      file:{filename},
      params:{groupId}
    } = req;

    const [count, [updatedGroup]] = await Group.update(
      {imagePath:filename},
      {
        where:{id:groupId},
        returning:true
      }
    )
    res.send({data:updatedGroup})
  } catch (error) {
    next(error)
  }
}

module.exports.addUserToGroup = async(req, res, next)=>{
  try {
    const {params:{groupId}, body:{userId}} = req;
    const group = await Group.findByPk(groupId);
    if(!group){
      return next(createError(404, 'Group not found'));
    }
    const user = await User.findByPk(userId);
    if(!user){
      return next(createError(404, 'User not found'));
    }
    await group.addUser(user);

    const groupWithUsers = await Group.findByPk(groupId, {
      include: [{
        model:User,
        attributes:{
          exclude:'password'
        },
        through:{
          attributes:[]
        }
      }]
    })

    res.status(201).send({data: groupWithUsers});
  } catch (error) {
    next(error)
  }
}

module.exports.updateGroup = async(req, res, next)=>{
  try {
    const {body, userInstance, groupInstance} = req;
    if(await userInstance.hasGroup(groupInstance)){
      const updatedGroup = await groupInstance.update(body, {
        returning: true
      });
      return res.status(200).send({data: updatedGroup});
    }
    next(new Error("group not associated with user!"));
  } catch (error) {
    next(error);
  }

}

module.exports.updateGroup = async(req, res, next)=>{
  try {
    const {userInstance, groupInstance} = req;
    if(await userInstance.hasGroup(groupInstance)){
      await groupInstance.destroy();
      return res.redirect('/');
    }
    next(new Error("group not associated with user!"));
  } catch (error) {
    next(error);
  }

}