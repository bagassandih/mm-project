const dotenv = require('dotenv');
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const mongoose = require('mongoose');
const { merge } = require('lodash');
// const { applyMiddleware } = require ('graphql-middleware');

const { makeExecutableSchema } = require('@graphql-tools/schema');

const { messageTypedef } = require('./BE/message/message_typdef')
const { messageResolver } = require('./BE/message/message_resolver')
// const { middlewareAuth } = require('./graphql/middleware/auth');

// ***** Set up Global configuration access
dotenv.config();

const typeDefs = [
    messageTypedef
]

const resolvers = merge(
    messageResolver
)

const schema = makeExecutableSchema({ typeDefs, resolvers });
// const schemaWithMiddleware = applyMiddleware(schema, middlewareAuth);
const server = new ApolloServer({
  schema,
});

startServer()

// ***** function start server
async function startServer(){
  const serverUrl = process.env.DB_URL;
  const database = process.env.DB_NAME;
  const port = process.env.PORT;
  const dbAtlas = 'mongodb+srv://notes:notes@mini-project.slwlqew.mongodb.net/anon-messages?retryWrites=true&w=majority'

  // ***** connect to db
  try {
    // await mongoose.connect(`${serverUrl}/${database}`);
    await mongoose.connect(`${dbAtlas}`);
    console.log(`🚀 Connected to ${database}: atlas`);
  } catch (err) {
    console.log('Failed to connect to MongoDB', err);
  }
    
  const { url } = await startStandaloneServer(server, {
    listen: { port: port },
    context: ( {req} ) => ({req}),
  });

  console.log(`🚀 Server ready at: ${url}`);
}

