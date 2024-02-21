const {buildSchema} = require('graphql')
const schema =  buildSchema(`
type User {
    id: ID
    username: String
    password: String 
}

input UserInput {
    id: ID
    username: String!
  password: String!
  
}
input PostInput {
    id: ID
    title: String!
    content: String!
}

type Query {
    getAllUsers: [User]
    getUser(id: ID): User
}
type Mutation {
    createUser(input: UserInput): User
}

type Subscription {
    postCreated: Post
  }
  subscription PostFeed {
    postCreated {
      author
      comment
    }
  }
`)

module.exports = schema 
