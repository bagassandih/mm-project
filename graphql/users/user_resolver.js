// ***** import thins
const UserModel = require('./user_model');
const moment = require('moment');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');
const UserUtilities = require('./user.utilities');

// ***** Query
async function getAllUser(parent, args, context){
  const user = await UserModel.find({}).lean();
  return user;
}

async function getOneUser(parent, { input }, context){
  const user = await UserModel.findById(input).lean();
  return user;
}

// ***** Misc
async function genCSV(){
  // import module
  const createCsvWriter = require('csv-writer').createObjectCsvWriter;
  let user = await UserModel.find({}).lean();
  const csvWriter = createCsvWriter({
      path: './files.csv',
      header: [
          {id: 'id', title: 'ID'},
          {id: 'name', title: 'NAME'},
          {id: 'position', title: 'POSITION'},
          {id: 'email', title: 'EMAIL'},
          {id: 'incorrect', title: 'INCORRECT_EMAIL'},
      ],
      fieldDelimiter: ';'
  });
  
  let records = [];
  for (const eachUser of user){
    records.push({
      id: eachUser._id,
      name: eachUser.first_name + ' ' + eachUser.last_name,
      position: eachUser.position ? eachUser.position : '',
      email: eachUser.email,
      incorrect: eachUser.incorrect_email === true ? true : false
    })
  }

  return csvWriter.writeRecords(records)
      .then(() => {
       return records.length + ' users are generated to CSV.';
      })
      .catch((err) => {
        return err
      });
}

async function readCSV(){
  // import module
  const csv = require('csv-parser');
  const fs = require('fs');
  const results = [];
  let finalResult = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream('./files.csv')
      .on('error', (err) => reject(err.message))
      .pipe(csv({ separator: ';' }))
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        return resolve(results);
      });
  });
 
  for (const eachResult of results){
    let getUser = await UserModel.findById(eachResult.ID).lean();
    if (getUser) {
      finalResult.push(getUser);
      console.log(eachResult.NAME, 'was found.');
    } else {
      console.log(eachResult.NAME, 'not found.');
    }
  }
  return finalResult
}

// ***** Mutation
async function createNewUser(parent, { input }, context){
  // check parameters
  if (!input) throw new GraphQLError('Please complete the form.');

  // cek email
  let checkEmail = await UserModel.findOne({ email: input.email }).lean();
  if (checkEmail) throw new GraphQLError('Email is already exist.');

  // hash password
  input.password = await bcrypt.hash(input.password, 5);
  let newUser = input;

  // add date
  newUser.register_date = {
    date: moment().format('MM/DD/YYYY'),
    time: moment().format('h:m')
  };
 
  newUser = await UserModel.create(newUser);
  return newUser;
}

async function login(parent, { input }, context){
  let token;
  // check parameters
  if (!input) throw GraphQLError('Please check your input!');

  // check user
  const user = await UserModel.findOne({ email: input.email }).lean();
  if (!user) throw new GraphQLError('User not found.');

  // check password of user
  const comparePassword = await bcrypt.compare(input.password, user.password);
  if (comparePassword){
    token = jwt.sign({ 
      username: user.email, 
      password: user.password,
      user_id: user._id
    }, process.env.JWT_SECRET, { expiresIn: '1d' });
  }else{
    throw new GraphQLError('Wrong password.')
  }

  return {
    _id: user._id,
    token: token
  }

}

async function sendVerification(parent, args, context){
  let getCode = UserUtilities.generateVerificationCode(5);
  let getUser = await UserModel.findById(context.req.user_id).select('first_name last_name email').lean();
  getUser.fullName = getUser.first_name + ' ' + getUser.last_name;
  
  await UserUtilities.sendEmail(getUser, getCode);
  return getCode;

}

async function verifyUser(parent, { input }, context){
  if (input.code === input.trueCode){
    let verification = await UserModel.findByIdAndUpdate(context.req.user_id,
      {
        $set: {
          is_verified: true
        }
      },{ new:true }
    )
    return 'Verification success.'
  } else {
    return 'Verification failed.'
  }

}

const userResolver = {
  Query: {
    getAllUser,
    getOneUser,
    readCSV
  },
  Mutation: {
    createNewUser,
    login,
    genCSV,
    sendVerification,
    verifyUser
  }
}

module.exports = {
  userResolver
}