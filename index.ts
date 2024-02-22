
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { PubSub } = require('graphql-subscriptions');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
type Table = {
  tableID: number
  from: string,
  to: string, 
  amountOfChairs: number
  timeForBooking: string
dataOfBooking:  string
};
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
const typeDefs = `
type TableArray {
  tableID: Int
  from: String
  to: String
  amountOfChairs: Int
  timeForBooking: String
  dataOfBooking: String
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
    dataOfBooking: String
  }

  input BookingActionObject {
    tableID: Int
    from: String
    to: String
    amountOfChairs: Int
    dataOfBooking: String
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
     // const timeForBooking = input.from + "-" + input.to;
     const { tableID, from, to, amountOfChairs, dataOfBooking } = input;
     const timeForBooking = from + "-" + to;
      console.log("TIME FOR BOOKING: " + timeForBooking);
   //   const bookingElement = createBookingAction({...input, timeForBooking: timeForBooking});
     
   const bookingElement = createBookingAction({
    tableID,
    from,
    to,
    amountOfChairs,
    dataOfBooking,
    timeForBooking  // Assign the timeForBooking field here
  });
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
/*
mutation CreateBookingAction {
  createBookingAction(input: {
    tableID: 1
    from: "2024-02-22T10:00:00"
    to: "2024-02-22T12:00:00"
    amountOfChairs: 3
    dataOfBooking: "dkkd"
  }) {
    tableID
    from
    to
    amountOfChairs
    dataOfBooking
  }
}

*/
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