const moment = require('moment');
const messageModel = require('./message_model');

// query
async function getAllMessage(parent, args, context){
    return await messageModel.find({})
    .sort({_id: -1})
    .limit(3)
    .lean();
}   

// mutation
async function createMessage(parent, {input}, context){
    if(!input.from || input.from === ''){
        input.from = 'anonymous'
    }
    if(!input.to || input.form === ''){
        input.to = 'anonymous'
    }
    input.date = moment().format('DD/MM/YYYY');
    input.time = moment().format('HH:MM');
    
    return await messageModel.create(input);
}

// export
const messageResolver = {
    Query: {
        getAllMessage,
    },
    Mutation: {
        createMessage,
    }
  }
  
  module.exports = {
    messageResolver
  }
