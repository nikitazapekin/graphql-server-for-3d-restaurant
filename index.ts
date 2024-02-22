
 /*======================================================================================================y*/
 /*
 const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { PubSub } = require('graphql-subscriptions');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
type Table = {
  dataOfBooking: string,
  amountOfBookedChairs: number
};
const tables = {
  table1: {
      id: 1,
      timeForBooking: [] as Table[],
      amountOfChairs: 4
  },
  table2: {
      id: 2,
      timeForBooking: [] as Table[],
      amountOfChairs: 4
  },
  table3: {
      id: 3,
      timeForBooking: [] as Table[],
      amountOfChairs: 2
  },
  table4: {
      id: 4,
      timeForBooking: [] as Table[],
      amountOfChairs: 2
  },
  tables5: {
      id: 5,
      timeForBooking: [] as Table[],
      amountOfChairs: 2
  },
  table6: {
      id: 6,
      timeForBooking: [] as Table[],
      amountOfChairs: 2
  },
  table7: {
      id: 7,
      timeForBooking: [] as Table[],
      amountOfChairs: 2
  },
  table8: {
      id: 8,
      timeForBooking: [] as Table[],
      amountOfChairs: 2
  }
};
const PORT = 5000;
const users = [{ id: 1, username: "Vasya", age: 25 }]
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
  type BookingAction {
    table: Int
    from: String
    to: String
    amountOfChairs: Int
  }
  input BookingActionObject {
    table: Int
    from: String
    to: String
    amountOfChairs: Int
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
    createBookingAction(input: BookingActionObject): BookingAction
  }

  type MutationBookingAction {
    createBookingAction(input: BookingActionObject): BookingAction
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
const createBookingAction = (input) => {
  return {
    ...input

  }
}
const resolvers = {
  MutationBookingAction: {
    createBookingAction: (parent, {input}) => {
      const timeForBooking = input.from+"-"+input.to
      console.log("TIME FOR BOOKINF" +timeForBooking)
      console.log(input)
      const bookingElement = createBookingAction({timeForBooking: timeForBooking, amountOfChairs: input.amountOfBookingChairs})
      console.log("OBJ"+JSON.stringify(bookingElement))
      return bookingElement
    }
  },
  Mutation: {
    createUser: (parent, { input }) => {
      console.log(input)
      const user = createUser(input)
      users.push(user)
      return user
  },


  createBookingAction: (parent, {input}) => {
    const timeForBooking = input.from+"-"+input.to
    console.log("TIME FOR BOOKINF" +timeForBooking)
    console.log(input)
    const bookingElement = createBookingAction({timeForBooking: timeForBooking, amountOfChairs: input.amountOfBookingChairs})
    console.log("OBJ"+JSON.stringify(bookingElement))
    return bookingElement
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
*/




const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { PubSub } = require('graphql-subscriptions');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
/*

const tables = {
  table1: {
      id: 1,
      timeForBooking: [] as Table[],
      amountOfChairs: 4
  },
  table2: {
      id: 2,
      timeForBooking: [] as Table[],
      amountOfChairs: 4
  },
  table3: {
      id: 3,
      timeForBooking: [] as Table[],
      amountOfChairs: 2
  },
  table4: {
      id: 4,
      timeForBooking: [] as Table[],
      amountOfChairs: 2
  },
  tables5: {
      id: 5,
      timeForBooking: [] as Table[],
      amountOfChairs: 2
  },
  table6: {
      id: 6,
      timeForBooking: [] as Table[],
      amountOfChairs: 2
  },
  table7: {
      id: 7,
      timeForBooking: [] as Table[],
      amountOfChairs: 2
  },
  table8: {
      id: 8,
      timeForBooking: [] as Table[],
      amountOfChairs: 2
  }
};

*/
type Table = {
  tableID: number
  from: string,
  to: string, 
  amountOfChairs: number
  timeForBooking: string

  //dataOfBooking: string,
 // amountOfBookedChairs: number
};
//{"tableID":1,"from":"2024-02-22T10:00:00","to":"2024-02-22T12:00:00","amountOfChairs":4,"timeForBooking":"2024-02-22T10:00:00-2024-02-22T12:00:00"}
const tables = [
 {
      id: 1,
      timeForBooking: [] as Table[],
      amountOfChairs: 4
  },
 {
      id: 2,
      timeForBooking: [] as Table[],
      amountOfChairs: 4
  },
 {
      id: 3,
      timeForBooking: [] as Table[],
      amountOfChairs: 2
  },
 {
      id: 4,
      timeForBooking: [] as Table[],
      amountOfChairs: 2
  },
   {
      id: 5,
      timeForBooking: [] as Table[],
      amountOfChairs: 2
  },
 {
      id: 6,
      timeForBooking: [] as Table[],
      amountOfChairs: 2
  },
 {
      id: 7,
      timeForBooking: [] as Table[],
      amountOfChairs: 2
  },
 {
      id: 8,
      timeForBooking: [] as Table[],
      amountOfChairs: 2
  }
];

const PORT = 5000;

const users = [{ id: 1, username: "Vasya", age: 25 }];
/*
type TableArray {
  dataOfBooking:  String,
  amountOfBookedChairs: String
}
 tableID: number
  from: string,
  to: string, 
  amountOfChairs: number
  timeForBooking: string
  */
const typeDefs = `
type TableArray {
  tableID: Int
  from: String
  to: String
  amountOfChairs: Int
  timeForBooking: String
}
type TableInfo {
  id: Int
  amountOfChairs: Int
  timeForBooking: [TableArray]
}
  type Query {
    currentNumber: Int
    getUser(id: ID!): User
    getTableInfo(id: ID!):  TableInfo
  }

  type Subscription {
    currentNumber: Int
  }

  type User {
    id: ID
    username: String
    password: String 
  }

  type BookingAction {
    tableID: Int
    from: String
    to: String
    amountOfChairs: Int
  }

  input BookingActionObject {
    tableID: Int
    from: String
    to: String
    amountOfChairs: Int
  }

  input UserInput {
    id: ID
    username: String!
    password: String!
  }

  type Mutation {
    createUser(input: UserInput): User
    createBookingAction(input: BookingActionObject): BookingAction
  }

  type MutationBookingAction {
    createBookingAction(input: BookingActionObject): BookingAction
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

const createBookingAction = (input) => {
  return {
    ...input
  }
}

const resolvers = {
  MutationBookingAction: {
    createBookingAction: (parent, {input}) => {
      const timeForBooking = input.from + "-" + input.to;
      console.log("TIME FOR BOOKING: " + timeForBooking);
      const bookingElement = createBookingAction({...input, timeForBooking: timeForBooking});
      console.log("OBJ: " + JSON.stringify(bookingElement));
      return bookingElement;
    }
  },
  Mutation: {
    createUser: (parent, { input }) => {
      console.log(input);
      const user = createUser(input);
      users.push(user);
      return user;
    },
    createBookingAction: (parent, {input}) => {
      const timeForBooking = input.from + "-" + input.to;
      const bookingElement = createBookingAction({...input, timeForBooking: timeForBooking});
    for(let i=0; i< tables.length; i++){
     if (tables[i].id ==bookingElement.tableID) {
      tables[i].timeForBooking.push(bookingElement)
     }
    }
    console.log(JSON.stringify(tables))

      return bookingElement;
    }
  }, 
  Query: {
    currentNumber() {
      return currentNumber;
    },
    getUser: (parent, { id }) => { 
      return users.find(user => user.id == id);
    },
 /*   getTableInfo: (parent, {id})=>{
      console.log(tables.filter(item=>item.id==id))
//return tables.filter(item=>item.id==id)

    } */

    getTableInfo: (parent, { id }) => { 
      console.log( "tables "+JSON.stringify(tables))
      const table = tables.find(table => table.id == id);
      console.log( "table "+JSON.stringify(table))
      if (table) {
        return {
          id: table.id,
          amountOfChairs: table.amountOfChairs,
          timeForBooking: table.timeForBooking
        };
      } else {
        return null; 
      }
    }
    
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
   // console.log(currentNumber);
    pubsub.publish('NUMBER_INCREMENTED', { currentNumber: currentNumber });

    setTimeout(incrementNumber, 1000);
  }

  incrementNumber();
}

startServer().catch(error => console.error(error));
//:[{"tableID":1,"from":"2024-02-22T10:00:00","to":"2024-02-22T12:00:00","amountOfChairs":4,"timeForBooking":"2024-02-22T10:00:00-2024-02-22T12:00:00"}
/*
query {
  getTableInfo(id: 3) {
    id
    amountOfChairs
    timeForBooking {
    dataOfBooking
    amountOfBookedChairs
    }
  }
}

*/
/*
query {
  getTableInfo(id: 1) {
    id
    amountOfChairs
    timeForBooking {
      from
      to
    }
  }
}

*/
/*
mutation CreateBookingAction {
  createBookingAction(input: {
    tableID: 1
    from: "2024-02-22T10:00:00"
    to: "2024-02-22T12:00:00"
    amountOfChairs: 4
  }) {
    tableID
    from
    to
    amountOfChairs
  }
}

*/

/*

mutation CreateBookingAction {
  createBookingAction(input: {
    table: 1
    from: "2024-02-22T10:00:00"
    to: "2024-02-22T12:00:00"
    amountOfChairs: 4
  }) {
    from
    to
    amountOfChairs
  }
}

*/