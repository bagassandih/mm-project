const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const moment = require('moment');
const { GraphQLError } = require('graphql');
dotenv.config();

// ***** middleware
async function auth(resolve, parent, args, context, info) {
    // check header
    if (!context.req.headers.authorization) {
        throw new GraphQLError('Un-authenticated.');
    };

    let token = context.req.headers.authorization || '';
    jwt.verify(token, process.env.JWT_SECRET, (err,decode) => {
        if(err){
           throw new GraphQLError(err.message)
        }
        context.req.token = decode.token; 
        context.req.user_id = decode.user_id; 
        console.log(decode.username, moment(new Date()).locale('id').format('LLL') )
    });

    return resolve(parent, args, context, info);
}

const middlewareAuth = {
  Query: {
    getAllUser: auth,
    getOneUser: auth
  },
  Mutation: {
    sendVerification: auth,
    verifyUser: auth
  },
};

module.exports = { middlewareAuth };
