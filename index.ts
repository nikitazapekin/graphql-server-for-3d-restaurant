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
/*
{
    "compilerOptions": {

      "rootDirs": ["src"],
      "outDir": "dist",
      "lib": ["es2020"],
      "target": "es2020",
      "module": "esnext",
      "moduleResolution": "node",
      "esModuleInterop": true,
      "types": ["node"],
      "skipLibCheck": true
    }
  }
  
  */
 
//=============================================================

//https://codesandbox.io/p/devbox/github/apollographql/docs-examples/tree/main/apollo-server/v4/subscriptions-graphql-ws?file=%2Fsrc%2Findex.ts%3A1%2C1-97%2C19&fontsize=14&hidenavigation=1&initialpath=%2Fgraphql&theme=dark 
// рабочее

//https://www.apollographql.com/docs/apollo-server/data/subscriptions/
//https://codesandbox.io/p/devbox/github/apollographql/docs-examples/tree/main/apollo-server/v4/subscriptions-graphql-ws?fontsize=14&hidenavigation=1&initialpath=%2Fgraphql&theme=dark
//https://codesandbox.io/p/devbox/github/apollographql/docs-examples/tree/main/apollo-server/v4/subscriptions-graphql-ws?file=%2Fsrc%2Findex.ts%3A29%2C1&fontsize=14&hidenavigation=1&initialpath=%2Fgraphql&theme=dark
/*import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import { createServer } from 'http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { PubSub } from 'graphql-subscriptions';
import bodyParser from 'body-parser';
import cors from 'cors'; */







/*
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const express = require('express');
const { createServer } = require('http');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const { PubSub } = require('graphql-subscriptions');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 4000;
const pubsub = new PubSub();

// A number that we'll increment over time to simulate subscription events
let currentNumber = 0;

// Schema definition
const typeDefs = `#graphql
  type Query {
    currentNumber: Int
  }

  type Subscription {
    numberIncremented: Int
  }
`;

// Resolver map
const resolvers = {
  Query: {
    currentNumber() {
      return currentNumber;
    },
  },
  Subscription: {
    numberIncremented: {
      subscribe: () => pubsub.asyncIterator(['NUMBER_INCREMENTED']),
    },
  },
};

// Create schema, which will be used separately by ApolloServer and
// the WebSocket server.
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create an Express app and HTTP server; we will attach the WebSocket
// server and the ApolloServer to this HTTP server.
const app = express();

 
app.use(cors())

const httpServer = createServer(app);

// Set up WebSocket server.
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});
const serverCleanup = useServer({ schema }, wsServer);

// Set up ApolloServer.
const server = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await server.start();
app.use('/graphql',// cors<cors.CorsRequest>(), 
bodyParser.json(), expressMiddleware(server));

// Now that our HTTP server is fully set up, actually listen.
httpServer.listen(PORT, () => {
  console.log(`🚀 Query endpoint ready at http://localhost:${PORT}/graphql`);
  console.log(`🚀 Subscription endpoint ready at ws://localhost:${PORT}/graphql`);
});

// In the background, increment a number every second and notify subscribers when it changes.
function incrementNumber() {
  currentNumber++;
  pubsub.publish('NUMBER_INCREMENTED', { numberIncremented: currentNumber });
  setTimeout(incrementNumber, 1000);
}

// Start incrementing
incrementNumber();
//yarn global add ts-node
//yarn add ts-node --dev
*/

 /*

const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const express = require('express');
const { createServer } = require('http');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const { PubSub } = require('graphql-subscriptions');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 5000;
const pubsub = new PubSub();
let currentNumber = 0;
const typeDefs = `
  type Query {
    currentNumber: Int
  }
  type Subscription {
    currentNumber: Int
  }
`;
// Resolver map
const resolvers = {
  Query: {
    currentNumber() {
      return currentNumber;
    },
  },
  Subscription: {
  //currentNumber: {
  //    subscribe: () => pubsub.asyncIterator(['NUMBER_INCREMENTED']),
  //  },
   // numberIncremented: {
     // subscribe: () => pubsub.asyncIterator(['NUMBER_INCREMENTED']),
   // }, 
  },
};

// Create schema, which will be used separately by ApolloServer and
// the WebSocket server.
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create an Express app and HTTP server; we will attach the WebSocket
// server and the ApolloServer to this HTTP server.
const app = express();

app.use(cors());

const httpServer = createServer(app);

// Set up WebSocket server.
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});
const serverCleanup = useServer({ schema }, wsServer);

// Set up ApolloServer.
const server = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

(async () => {
  await server.start();
  app.use('/graphql', bodyParser.json(), expressMiddleware(server));
  
  // Now that our HTTP server is fully set up, actually listen.
  httpServer.listen(PORT, () => {
    console.log(`🚀 Query endpoint ready at http://localhost:${PORT}/graphql`);
    console.log(`🚀 Subscription endpoint ready at ws://localhost:${PORT}/graphql`);
  });
  
  // In the background, increment a number every second and notify subscribers when it changes.
  function incrementNumber() {
    currentNumber++;
    console.log(currentNumber)
   // pubsub.publish('NUMBER_INCREMENTED', { numberIncremented: currentNumber });
  // pubsub.publish('NUMBER_INCREMENTED', { currentNumber: currentNumber });
  //pubsub.publish('currentNumber', { currentNumber: currentNumber });
  pubsub.publish('NUMBER_INCREMENTED', { numberIncremented: currentNumber });

    setTimeout(incrementNumber, 1000);
  }
  
  // Start incrementing
  incrementNumber();
})();

*/

/*
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const express = require('express');
const { createServer } = require('http');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const { PubSub } = require('graphql-subscriptions');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 5000;
const pubsub = new PubSub();
let currentNumber = 0;
const typeDefs = `
  type Query {
    currentNumber: Int
  }
  type Subscription {
    currentNumber: Int
  }
`;
// Resolver map
const resolvers = {
  Query: {
    currentNumber() {
      return currentNumber;
    },
  },
  Subscription: {
  currentNumber: {
     subscribe: () => pubsub.asyncIterator(['NUMBER_INCREMENTED']),
  },

  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });
const app = express();
app.use(cors());
const httpServer = createServer(app);
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});
const serverCleanup = useServer({ schema }, wsServer);

// Set up ApolloServer.
const server = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

(async () => {
  await server.start();
  app.use('/graphql', bodyParser.json(), expressMiddleware(server));
  httpServer.listen(PORT, () => {
    console.log(`🚀 Query endpoint ready at http://localhost:${PORT}/graphql`);
    console.log(`🚀 Subscription endpoint ready at ws://localhost:${PORT}/graphql`);
  });
  
  function incrementNumber() {
    currentNumber++;
    console.log(currentNumber)
   pubsub.publish('NUMBER_INCREMENTED', { currentNumber: currentNumber });


    setTimeout(incrementNumber, 1000);
  }
  
  // Start incrementing
  incrementNumber();
})(); */ 













/*=======================================================================================
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { PubSub } = require('graphql-subscriptions');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');

const PORT = 5000;
const users = [{id: 1, username: "Vasya", age: 25}]
// Ваши typeDefs и resolvers здесь
const typeDefs = `
  type Query {
    currentNumber: Int
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

type Query {
    getAllUsers: [User]
    getUser(id: ID): User
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

  Query: {
    currentNumber() {
      return currentNumber;
    },
    getUser: ({id}) => {
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

  // Start incrementing
  incrementNumber();
}

startServer().catch(error => console.error(error));
 ======================================================================================================*/
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
 //   createUser: ({input}) => {
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