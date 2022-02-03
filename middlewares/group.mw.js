const {Group} = require('../models');

module.exports.checkGroup = async (req, res, next)=>{
  try {
    const {params:{groupId}} = req;
    const groupInstance = await Group.findByPk(groupId);
    if(!groupInstance){
      throw new Error('group not found');
    }
    req.groupInstance = groupInstance;
    next();
  } catch (error) {
    next(error)
  }
}