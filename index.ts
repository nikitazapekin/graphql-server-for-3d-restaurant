
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
  dataOfBooking: string
  isBookedBy: string,
  timeOfBooking: string,
  isConfirmed: boolean,

};
type HistoryTable = {
  tableID: number
  from: string,
  to: string,
  amountOfChairs: number
  timeForBooking: string
  dataOfBooking: string
  isBookedBy: string,
  timeOfBooking: string,
  isConfirmed: boolean,

}
let tables = [
  {
    id: 1,
    timeForBooking: [] as Table[],
    amountOfChairs: 4,
    history: [] as HistoryTable[]
  },
  {
    id: 2,
    timeForBooking: [] as Table[],
    amountOfChairs: 4,
    history: [] as HistoryTable[]
  },
  {
    id: 3,
    timeForBooking: [] as Table[],
    amountOfChairs: 2,
    history: [] as HistoryTable[]
  },
  {
    id: 4,
    timeForBooking: [] as Table[],
    amountOfChairs: 2,
    history: [] as HistoryTable[]
  },
  {
    id: 5,
    timeForBooking: [] as Table[],
    amountOfChairs: 2,
    history: [] as HistoryTable[]
  },
  {
    id: 6,
    timeForBooking: [] as Table[],
    amountOfChairs: 2,
    history: [] as HistoryTable[]
  },
  {
    id: 7,
    timeForBooking: [] as Table[],
    amountOfChairs: 2,
    history: [] as HistoryTable[]
  },
  {
    id: 8,
    timeForBooking: [] as Table[],
    amountOfChairs: 2,
    history: [] as HistoryTable[]
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
  isBookedBy: String
  timeOfBooking: String
  isConfirmed: Boolean
}

type TableInfo {
  id: Int
  amountOfChairs: Int
  timeForBooking: [TableArray]
  history: [TableArray]
}
type TablesArray {
  id: Int
  amountOfChairs: Int
  timeForBooking: [TableArray]
  history: [TableArray]
}
type Query {
  currentNumber: Int
  getUser(id: ID!): User
  getTableInfo(id: ID!, date: String!):  TableInfo
  getCalendarInfoAboutTables(date: String!): [TablesArray]
  getInfornationAboutAbilityOfBooking(date: String!): [Boolean]
  getYourBookedTables( user: String!):  [TablesArray]

  getYourBookedTablesHistory( user: String!):  [TablesArray]
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
  timeOfBooking: String
  isConfirmed: Boolean
}
input BookingActionObject {
  tableID: Int
  from: String
  to: String
  amountOfChairs: Int
  dataOfBooking: String
  isBookedBy: String
  timeOfBooking: String
  isConfirmed: Boolean
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

 confirmBookedElements(input:  BookingActionObject): [TablesArray]

 replaceToHistory(input:  BookingActionObject): [TablesArray]

 replaceFromHistory(input:  BookingActionObject): ReplaceFromHistoryResult
}
type MutationBookingAction {
  createBookingAction(input: BookingActionObject): BookingActionResult
}

type ReplaceFromHistoryResult {
  errorMessage: String
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
    return true
  } else {
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
      const { tableID, from, to, amountOfChairs, dataOfBooking, timeOfBooking, isConfirmed } = input;
      const timeForBooking = from + "-" + to;
      const bookingElement = createBookingAction({
        tableID,
        from,
        to,
        amountOfChairs,
        dataOfBooking,
        timeForBooking,
        timeOfBooking
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
      const currentTime = new Date();
      const hours = currentTime.getHours()
      const minutes = currentTime.getMinutes();
      const seconds = currentTime.getSeconds();
      const formattedHours = hours < 10 ? "0" + hours : hours;
      const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
      const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
      const timeOfBooking = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
      const bookingElement = createBookingAction({ ...input, timeForBooking: timeForBooking, timeOfBooking: timeOfBooking, isConfirmed: false });
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
      const selectedTable = tables.find(table =>
        table.timeForBooking.some(item =>
          item.isBookedBy === input.isBookedBy &&
          item.tableID === input.tableID &&
          input.from === item.from &&
          input.to === item.to &&
          input.dataOfBooking === item.dataOfBooking
        )
      );
      tables[selectedTable.id - 1].history.push(selectedTable.timeForBooking[0])
      tables = tables.map(table => ({
        ...table,
        timeForBooking: table.timeForBooking.filter(item => !(item.isBookedBy === input.isBookedBy && item.tableID === input.tableID && input.from === item.from && input.to === item.to && input.dataOfBooking === item.dataOfBooking))
      }));
      return tables;
    },
    replaceToHistory: (parent, { input }) => {
      const selectedTable = tables.find(table => ({
        ...table,
        timeForBooking: table.timeForBooking.filter(item => (item.isBookedBy === input.isBookedBy && item.tableID === input.tableID && input.from === item.from && input.to === item.to && input.dataOfBooking === item.dataOfBooking))
      }));
      tables[selectedTable.id - 1].history.push(selectedTable.timeForBooking[0])
      tables = tables.map(table => ({
        ...table,
        timeForBooking: table.timeForBooking.filter(item => !(item.isBookedBy === input.isBookedBy && item.tableID === input.tableID && input.from === item.from && input.to === item.to && input.dataOfBooking === item.dataOfBooking))
      }));
      return tables;

    },
    replaceFromHistory: (parent, { input }) => {
      console.log("REPLACE FROM HISTORY")
      const selectedElement = tables.map(table =>
        table.history.filter(item =>
          item.isBookedBy === input.isBookedBy &&
          item.tableID === input.tableID &&
          input.from === item.from &&
          input.to === item.to &&
          input.dataOfBooking === item.dataOfBooking
        )
      ).flat();

      console.log("selected" + JSON.stringify(selectedElement))
      let errorMessage = ""
      let isAdded = false
      for (let i = 0; i < tables.length; i++) {
        if (tables[i].id == selectedElement[0].tableID) {
          let flag = true
          let bookedTime = ""
          if (input.from != "00:00" || input.to != "00:00") {
            const currDay = tables[i].timeForBooking.filter(item => item.dataOfBooking == input.dataOfBooking)
            if (currDay.length == 0) {
              tables[Number(selectedElement[0].tableID) - 1].timeForBooking.push(selectedElement[0])
            } else {
              for (let z = 0; z < currDay.length; z++) {
                if (isAbleToBook(selectedElement[0].timeForBooking, currDay[z].from, currDay[z].to)) {
                  flag = false
                }
              }
              if (flag) {
                tables[Number(selectedElement[0].tableID) - 1].timeForBooking.push(selectedElement[0])
              }
            }
          }
          if ((tables[i].timeForBooking.length == 0 && input.from == "00:00" && input.to == "00:00")) {
            tables[Number(selectedElement[0].tableID) - 1].timeForBooking.push(selectedElement[0])
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
            }
          }
          else {
            console.log("FLAGggggggggggggggggggggggggggggggggggggg")
            if (flag) {

              selectedElement[0].isConfirmed = true
              tables[Number(selectedElement[0].tableID) - 1].timeForBooking.push(selectedElement[0])
              isAdded = true
             
              console.log("------------------------------------------")
              console.log("INPUT" + JSON.stringify(input))
              tables = tables.map(table => ({
                ...table,

                history: table.history.filter(item => !(item.isBookedBy === input.isBookedBy && item.tableID === input.tableID && input.from === item.from && input.to === item.to && input.dataOfBooking === item.dataOfBooking))
                //  history: table.history.filter(item => !(item.isBookedBy === input.isBookedBy && item.tableID === input.tableID && input.from === item.from && input.to === item.to && input.dataOfBooking === item.dataOfBooking))
              }));
              console.log("NEW " + JSON.stringify(tables))
            }
            else {
              errorMessage = `You cannot book this table as it is already booked for typed time`
            }
          }
        }
      }

      if(errorMessage.length>0) {
        console.log("MOREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
      } else {

        tables = tables.map(table => ({
          ...table,

          history: table.history.filter(item => !(item.isBookedBy === input.isBookedBy && item.tableID === input.tableID && input.from === item.from && input.to === item.to && input.dataOfBooking === item.dataOfBooking))
        //  history: table.history.filter(item => !(item.isBookedBy === input.isBookedBy && item.tableID === input.tableID && input.from === item.from && input.to === item.to && input.dataOfBooking === item.dataOfBooking))
      }));
        }
      tables = tables.map(table => ({
        ...table,
        timeForBooking: [...new Set(table.timeForBooking)]


      }));
      console.log("=============================================")
      console.log("NEWWW" + JSON.stringify(tables))
      return { errorMessage }

    },
    confirmBookedElements: (parent, { input }) => {

      console.log("CONFIRM BOOKED ELEMENTS")
      tables = tables.map((table) => ({
        ...table,
        timeForBooking: table.timeForBooking.map((item) => {
          if (
            item.tableID == input.tableID &&
            item.isBookedBy === input.isBookedBy &&
            item.from === input.from &&
            item.to === input.to &&
            item.dataOfBooking === input.dataOfBooking
          ) {

            return { ...item, isConfirmed: true };
          } else {
            return item;
          }
        }),
      }));
      console.log("TABLESSSSSSSSS" + JSON.stringify(tables))
      return tables
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
          timeForBooking: dateTimeForBooking,
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

      console.log("YOUR" + JSON.stringify(tablesCopy))
      return yourBookedOffersArray;
    },
    getYourBookedTablesHistory: (parent, { user }) => {
      const tablesCopy = JSON.parse(JSON.stringify(tables));
      const yourBookedOffersArray = tablesCopy.map(table => ({
        ...table,
        history: table.history.filter(item => item.isBookedBy === user)
      }));
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

