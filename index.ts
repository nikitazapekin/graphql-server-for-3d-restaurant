/*const express = require('express')
const {graphqlHTTP} = require('express-graphql')
const cors = require('cors')
const schema = require('./schema')
//const users = [{id: 1, username: "Vasya", age: 25}]
const users = [ {id: 1, username: "ahha", password: ""}]
const app = express()
app.use(cors())

const createUser = (input) => {
    const id = Date.now()
    return {
        id, ...input
    }
}
const root = {
    getAllUsers: () => {
        return users
    },
    getUser: ({id}) => {
        return users.find(user => user.id == id)
    },
    createUser: ({input}) => {
        console.log(input)
        const user = createUser(input)
        users.push(user)
        return user
    }
}


app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema,
    rootValue: root
}))

app.listen(5000, () => console.log('server started on port 5000')) */

 /*======================================================================================================y*/
 const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { PubSub } = require('graphql-subscriptions');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');

const PORT = 5000;
const users = [{ id: 1, username: "Vasya", age: 25 }]
// Ваши typeDefs и resolvers здесь
const typeDefs = `
  type Query {
    currentNumber: Int
    getUser(id: ID!): User
  }
  type Subscription {
    currentNumber: Int
  }
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
  type Mutation {
    createUser(input: UserInput): User
  }
  subscription PostFeed {
    postCreated {
      author
      comment
    }
  }
`;

const pubsub = new PubSub();
let currentNumber = 0;
const createUser = (input) => {
  const id = Date.now()
  return {
    id, ...input
  }
}
const resolvers = {
  Mutation: {
    createUser: (parent, { input }) => {
      console.log(input)
      const user = createUser(input)
      users.push(user)
      return user
  }
  }, 
  Query: {
    currentNumber() {
      return currentNumber;
    },
    getUser: (parent, { id }) => { 
      return users.find(user => user.id == id)
    },
  },
  Subscription: {
    currentNumber: {
      subscribe: () => pubsub.asyncIterator(['NUMBER_INCREMENTED']),
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({
  schema,
});

async function startServer() {
  await server.start();

  const app = express();
  server.applyMiddleware({ app });

  const httpServer = createServer(app);

  const subscriptionServer = SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: '/graphql' }
  );

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.graphqlPath}`);
  });

  function incrementNumber() {
    currentNumber++;
    console.log(currentNumber);
    pubsub.publish('NUMBER_INCREMENTED', { currentNumber: currentNumber });

    setTimeout(incrementNumber, 1000);
  }

  incrementNumber();
}

startServer().catch(error => console.error(error));
/*
query {
  getUser(id: 1) {
    id
    username
  }
}
mutation {
  createUser(input: { id: 2, username: "hs", password: "sa" }) {
    id
    username
  }
}
*/
/*
/*const express = require('express')
const {graphqlHTTP} = require('express-graphql')
const cors = require('cors')
const schema = require('./schema')
//const users = [{id: 1, username: "Vasya", age: 25}]
const users = [ {id: 1, username: "ahha", password: ""}]
const app = express()
app.use(cors())

const createUser = (input) => {
    const id = Date.now()
    return {
        id, ...input
    }
}
const root = {
    getAllUsers: () => {
        return users
    },
    getUser: ({id}) => {
        return users.find(user => user.id == id)
    },
    createUser: ({input}) => {
        console.log(input)
        const user = createUser(input)
        users.push(user)
        return user
    }
}


app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema,
    rootValue: root
}))

app.listen(5000, () => console.log('server started on port 5000'))
*/
//const express = require('express')
















//=============================================================================
/*
const {graphqlHTTP} = require('express-graphql')
const cors = require('cors')

const { ApolloServer, gql } = require('apollo-server-express');
const { createServer } = require('http');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { PubSub } = require('graphql-subscriptions');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const express = require('express');
const users = [ {id: 1, username: "ahha", password: ""}]
const PORT = 5000;
const typeDefs = gql`
 

  type Subscription {
    currentNumber: Int
  }



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

 
  
`;

const pubsub = new PubSub();
let currentNumber = 0;

const resolvers = {
  Query: {

  },
};


const createUser = (input) => {
  const id = Date.now()
  console.log("INP" +input)
  return {
      id, ...input
  }
}




const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({
  schema,
});

async function startServer() {
  await server.start();

  const app = express();
  server.applyMiddleware({ app });
  
  const httpServer = createServer(app);

  const subscriptionServer = SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: '/graphql' }
    );
    
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
      console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.graphqlPath}`);
    });
    
    const root = {
      getAllUsers: () => {
          return users
      },
      getUser: ({id}) => {
          return users.find(user => user.id == id)
      },
      createUser: ({input}) => {
        console.log("WORK")
          console.log(input)
          const user = createUser(input)
          users.push(user)
          return user
      }
    }
    
    
    app.use('/graphql', graphqlHTTP({
      graphiql: true,
      schema,
      rootValue: root
    }))
  function incrementNumber() {
    currentNumber++;
  //  console.log(currentNumber);
    pubsub.publish('NUMBER_INCREMENTED', { currentNumber: currentNumber });

    setTimeout(incrementNumber, 1000);
  }

  // Start incrementing
  incrementNumber();
}

startServer().catch(error => console.error(error));
*/