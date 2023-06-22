const { default: gql } = require('graphql-tag');

const messageTypedef = gql`
    type Message {
        _id: ID
        from: String
        to: String
        date: String
        time: String
        message: String
    }

    input MessageInput {
        from: String
        to: String
        message: String
    }

    type Query {
        getAllMessage: [Message]
    }

    type Mutation {
        createMessage(input: MessageInput): Message
    }
`;

module.exports = {
  messageTypedef,
};
