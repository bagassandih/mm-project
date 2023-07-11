const { default: gql } = require('graphql-tag');

const userTypeDef = gql`
  type User {
    _id: ID
    first_name: String
    last_name: String
    status: enumStatus
    gender: enumGender
    is_verified: Boolean
    email: String
    password: String
    register_date: registerDate
  }

  type registerDate {
    date: String
    time: String
  }

  type Login {
    _id: ID
    token: String
  }

  enum enumGender {
    male
    female
  }

  enum enumStatus {
    active
    non_active
    not_confirm
  }

  input createNewUserInput {
    first_name: String
    last_name: String
    gender: enumGender
    email: String
    password: String
  }

  input loginInput {
    email: String!
    password: String!
  }

  input verifyInput {
    code: String!
    trueCode: String!
  }

  type Query {
    getAllUser: [User]
    getOneUser(input: ID): User
    readCSV: [User]
  }

  type Mutation {
    createNewUser(input: createNewUserInput): User
    login(input: loginInput): Login
    genCSV: String
    sendVerification: String
    verifyUser(input: verifyInput): String
  }
`;

module.exports = {
  userTypeDef,
};
