
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { PubSub } = require('graphql-subscriptions');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
//const typeDefs = require('./typeDefs')
type Table = {
  tableID: number
  from: string,
  to: string,
  amountOfChairs: number
  timeForBooking: string
  dataOfBooking: string
  isBookedBy: string
};
let tables = [
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

//getInfornationAboutAbilityOfBooking(date: String!): [TableInfo]
const typeDefs = `
type TableArray {
  tableID: Int
  from: String
  to: String
  amountOfChairs: Int
  timeForBooking: String
  dataOfBooking: String
  isBookedBy: String
}

type TableInfo {
  id: Int
  amountOfChairs: Int
  timeForBooking: [TableArray]
}
type TablesArray {
  id: Int
  amountOfChairs: Int
  timeForBooking: [TableArray]
}
type Query {
  currentNumber: Int
  getUser(id: ID!): User
  getTableInfo(id: ID!, date: String!):  TableInfo
  getCalendarInfoAboutTables(date: String!): [TablesArray]
  getInfornationAboutAbilityOfBooking(date: String!): [Boolean]
  getYourBookedTables( user: String!):  [TablesArray]
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
  isBookedBy: String
}
input BookingActionObject {
  tableID: Int
  from: String
  to: String
  amountOfChairs: Int
  dataOfBooking: String
  isBookedBy: String
}
input UserInput {
  id: ID
  username: String!
  password: String!
}
type Mutation {
  createUser(input: UserInput): User
  createBookingAction(input: BookingActionObject): BookingActionResult

  removeFromBookedElements(input:  BookingActionObject): [TablesArray]
 
}
type MutationBookingAction {
  createBookingAction(input: BookingActionObject): BookingActionResult
}
type BookingActionResult {
  bookingElement: BookingAction
  errorMessage: String
}
type Subscription {
  currentNumber: String
  tables: [TableInfo]
}
`;
//    removeFromBookedElements: (parent, { input }) => { 
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





const isAbleToBookMinures = (checkTime, startTime, endTime) => {
  const [checkHours, checkMinutes] = checkTime.split(":").map(Number);
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);
  const checkTotalMinutes = checkHours * 60 + checkMinutes;
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;
  if (checkTotalMinutes >= startTotalMinutes && checkTotalMinutes <= endTotalMinutes) {
    console.log(`${checkTime} находится в промежутке между ${startTime} и ${endTime}.`);
    return true
  } else {
    console.log(`${checkTime} не находится в промежутке между ${startTime} и ${endTime}.`);
    return false
  }
}

const isAbleToBook = (checkTime, startTime, endTime) => {
  const [checkStartTime, checkEndTime] = checkTime.split("-");
  const [checkStartHours, checkStartMinutes] = checkStartTime.split(":").map(Number);
  const [checkEndHours, checkEndMinutes] = checkEndTime.split(":").map(Number);

  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  const checkStartTotalMinutes = checkStartHours * 60 + checkStartMinutes;
  const checkEndTotalMinutes = checkEndHours * 60 + checkEndMinutes;
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;


  if (checkStartTotalMinutes < startTotalMinutes && checkEndTotalMinutes > endTotalMinutes) {
    return true
  }
  if (isAbleToBookMinures(checkStartTime, startTime, endTime) || isAbleToBookMinures(checkEndTime, startTime, endTime)) {
    return true
  }
  if (checkStartTotalMinutes >= startTotalMinutes && checkEndTotalMinutes <= endTotalMinutes) {
    return true;
  } else {
    return false;
  }
}


const resolvers = {
  MutationBookingAction: {
    createBookingAction: (parent, { input }) => {
      const { tableID, from, to, amountOfChairs, dataOfBooking } = input;
      const timeForBooking = from + "-" + to;
      console.log("TIME FOR BOOKING: " + timeForBooking);

      const bookingElement = createBookingAction({
        tableID,
        from,
        to,
        amountOfChairs,
        dataOfBooking,
        timeForBooking
      });

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
    createBookingAction: (parent, { input }) => {
      const timeForBooking = input.from + "-" + input.to;
      let errorMessage = ""
      const bookingElement = createBookingAction({ ...input, timeForBooking: timeForBooking });
      for (let i = 0; i < tables.length; i++) {
        if (tables[i].id == bookingElement.tableID) {
          let flag = true
          let bookedTime = ""
          if (input.from != "00:00" || input.to != "00:00") {
            const currDay = tables[i].timeForBooking.filter(item => item.dataOfBooking == input.dataOfBooking)
            if (currDay.length == 0) {
              tables[Number(bookingElement.tableID) - 1].timeForBooking.push(bookingElement)
            } else {
              for (let z = 0; z < currDay.length; z++) {
                if (isAbleToBook(timeForBooking, currDay[z].from, currDay[z].to)) {
                  flag = false
                }
              }
              if (flag) {
                tables[Number(bookingElement.tableID) - 1].timeForBooking.push(bookingElement)
              }
            }
          }
          if ((tables[i].timeForBooking.length == 0 && input.from == "00:00" && input.to == "00:00")) {
            tables[Number(bookingElement.tableID) - 1].timeForBooking.push(bookingElement)
          }
          else if ((tables[i].timeForBooking.length != 0 && input.from == "00:00" && input.to == "00:00")) {
            let countOfOffersAtCurrentDataOfBooking = 0
            for (let z = 0; z < tables[i].timeForBooking.length; z++) {
              if (tables[i].timeForBooking[z].dataOfBooking == input.dataOfBooking) {
                countOfOffersAtCurrentDataOfBooking++
              }
            }
            if (countOfOffersAtCurrentDataOfBooking > 0) {
              flag = false
              errorMessage = "You cannot reserve this table for the whole day as it is already booked for some time"
              bookedTime = "00:00-00:00"
            }
            else {
              tables[Number(bookingElement.tableID) - 1].timeForBooking.push(bookingElement)
            }
          }
          else {
            if (flag) {
            }
            else {
              errorMessage = `You cannot book this table as it is already booked for typed time`
            }
          }

        }
      }
      return { bookingElement, errorMessage };
    }, 
    removeFromBookedElements: (parent, { input }) => { 
tables =tables.map(table => ({
  ...table,
  timeForBooking: table.timeForBooking.filter(item => !(item.isBookedBy === input.isBookedBy && item.tableID===input.tableID && input.from===item.from && input.to===item.to && input.dataOfBooking ===item.dataOfBooking))
}));
return tables; 
//}

/*
   console.log("YOUR BOOKED TABLES", user);
      const tablesCopy = JSON.parse(JSON.stringify(tables));
      const yourBookedOffersArray = tablesCopy.map(table => ({
        ...table,
        timeForBooking: table.timeForBooking.filter(item => item.isBookedBy === user)
      }));
    
      console.log("NEWWWWWWW", JSON.stringify(yourBookedOffersArray));
      return yourBookedOffersArray; 
    }
    */
/*

mutation RemoveFromBookedElements {
  removeFromBookedElements(input: {
    tableID: 2
    from: "12:00"
    to: "14:00"
    amountOfChairs: 3
    dataOfBooking: "20-3-2024"
    isBookedBy: "vw"
 } ) {
    timeForBooking {
       tableID
      from
      to
      amountOfChairs
      dataOfBooking
      isBookedBy
    }
  }
}
*/

    } 
  },
  Query: {
    currentNumber() {
      return currentNumber;
    },
    getUser: (parent, { id }) => {
      return users.find(user => user.id == id);
    },
    getTableInfo: (parent, { id, date }) => {
      const table = tables.find(table => table.id == id);
      let dateTimeForBooking = table.timeForBooking.filter(item => {
        item.dataOfBooking == date
        return item.dataOfBooking == date;
      }
      )
      if (table) {
        return {
          id: table.id,
          amountOfChairs: table.amountOfChairs,
          timeForBooking: dateTimeForBooking
        };
      } else {
        return null;
      }
    },


    getCalendarInfoAboutTables: (parent, { date }) => {
      const tablesCopy = tables
      for (let i = 0; i < tablesCopy.length; i++) {
        let dateTimeForBooking = tablesCopy[i].timeForBooking.filter(item => {
          item.dataOfBooking == date
          return item.dataOfBooking == date;
        }
        )
        tablesCopy[i].timeForBooking = dateTimeForBooking
      }
    },
    getInfornationAboutAbilityOfBooking: (parent, { date }) => {
      const tablesCopy = JSON.parse(JSON.stringify(tables));
      for (let i = 0; i < tablesCopy.length; i++) {
        const currentDateBookingElements = tablesCopy[i].timeForBooking.filter((item) => {
          if (item.dataOfBooking == date) {
            return item
          }
        })

        tablesCopy[i].timeForBooking = currentDateBookingElements
      }
      const arrayOfAbleToBookTables = []
      for (let i = 0; i < tablesCopy.length; i++) {
        let isBooked = false
        for (let j = 0; j < tablesCopy[i].timeForBooking.length; j++) {
          if (tablesCopy[i].timeForBooking[j].from == "00:00" && tablesCopy[i].timeForBooking[j].to == "00:00") {
            isBooked = true
          }
        }
        arrayOfAbleToBookTables.push(isBooked)
      }
      return arrayOfAbleToBookTables
    },
    getYourBookedTables: (parent, { user }) => {
      console.log("YOUR BOOKED TABLES", user);
      const tablesCopy = JSON.parse(JSON.stringify(tables));
      const yourBookedOffersArray = tablesCopy.map(table => ({
        ...table,
        timeForBooking: table.timeForBooking.filter(item => item.isBookedBy === user)
      }));
    
      console.log("NEWWWWWWW", JSON.stringify(yourBookedOffersArray));
      return yourBookedOffersArray; 
    }
  
},
  Subscription: {
    currentNumber: {
      subscribe: () => pubsub.asyncIterator(['NUMBER_INCREMENTED']),
    },
    tables: {
      subscribe: () => pubsub.asyncIterator(['CURRENT_TABLES']),
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
    const currentDate = new Date();
    const formattedTime = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
    const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
    const currentDateTime = `${formattedTime}-${formattedDate}`;
    const formatttedDate = `${currentDate.getDate()}-${currentDate.getMonth()}-${currentDate.getFullYear()}`;
    let tablesCopy = JSON.parse(JSON.stringify(tables));
    for (let i = 0; i < tablesCopy.length; i++) {
      const currentDateBookingElements = tablesCopy[i].timeForBooking.filter((item) => {
        if (item.dataOfBooking == formattedDate) {
          return item
        }
      })
      tablesCopy[i].timeForBooking = currentDateBookingElements
    }
    pubsub.publish('NUMBER_INCREMENTED', { currentNumber: currentDateTime });
    pubsub.publish('CURRENT_TABLES', { tables: tablesCopy });

    setTimeout(incrementNumber, 1000);
  }
  incrementNumber();
}

startServer().catch(error => console.error(error));



/*
mutation CreateBookingAction {
  createBookingAction(input: {
    tableID: 1
    from: "12:00"
    to: "14:00"
    amountOfChairs: 3
    dataOfBooking: "16-3-2024"
    isBookedBy: "valera"
  }) {
    bookingElement {
      tableID
      from
      to
      amountOfChairs
      dataOfBooking
      isBookedBy
    }
    errorMessage
  }
}


query {
  getTableInfo(id: 3, date: "16-03-2024") {
    id
    amountOfChairs
    timeForBooking {
    dataOfBooking
    
    }
  }
}

*/