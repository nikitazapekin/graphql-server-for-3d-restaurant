
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
  getTableInfo(id: ID!, date: String!):  TableInfo
  getCalendarInfoAboutTables(date: String!): TableInfo
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
  createBookingAction(input: BookingActionObject): BookingActionResult
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
/*
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
    getTableInfo(id: ID!, date: String!):  TableInfo
    getCalendarInfoAboutTables(date: String!): TableInfo
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

  type Subscription {
    currentNumber: String
    tables: [TableInfo]
  }
`; */
 
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






/*
const isAbleToBook = (checkTime, startTime, endTime) => {
  // Разбиваем строку checkTime на начальное и конечное время
  const [checkStartTime, checkEndTime] = checkTime.split("-");

  // Проверяем каждое время в промежутке checkTime
  const isTimeInRange = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;
    return totalMinutes >= startTotalMinutes && totalMinutes <= endTotalMinutes;
  };

  // Получаем часы и минуты начального и конечного времени бронирования
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  // Переводим время начала и конца в минуты для удобства сравнения
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;

  // Проверяем, что начальное и конечное время промежутка checkTime находятся в заданном интервале
  if (isTimeInRange(checkStartTime) && isTimeInRange(checkEndTime)) {
    console.log(`Промежуток ${checkTime} полностью содержится в промежутке между ${startTime} и ${endTime}.`);
    return true;
  } else {
    console.log(`Промежуток ${checkTime} не содержится полностью в промежутке между ${startTime} и ${endTime}.`);
    return false;
  }
}
 */


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
// Разбиваем строку checkTime на начальное и конечное время
const [checkStartTime, checkEndTime] = checkTime.split("-");

// Получаем часы и минуты начального и конечного времени промежутка
const [checkStartHours, checkStartMinutes] = checkStartTime.split(":").map(Number);
const [checkEndHours, checkEndMinutes] = checkEndTime.split(":").map(Number);

// Получаем часы и минуты начального и конечного времени бронирования
const [startHours, startMinutes] = startTime.split(":").map(Number);
const [endHours, endMinutes] = endTime.split(":").map(Number);

// Переводим все времена в минуты для удобства сравнения
const checkStartTotalMinutes = checkStartHours * 60 + checkStartMinutes;
const checkEndTotalMinutes = checkEndHours * 60 + checkEndMinutes;
const startTotalMinutes = startHours * 60 + startMinutes;
const endTotalMinutes = endHours * 60 + endMinutes;
console.log("=======================================================")
console.log(checkStartTime, startTime, endTime)
console.log( isAbleToBookMinures(checkStartTime, startTime, endTime))

 console.log( isAbleToBookMinures(checkEndTime, startTime, endTime))
console.log("=======================================================")

if(checkStartTotalMinutes<startTotalMinutes &&  checkEndTotalMinutes> endTotalMinutes) {
  return true
}
if(isAbleToBookMinures(checkStartTime, startTime, endTime) || isAbleToBookMinures(checkEndTime, startTime, endTime) ) {
    return true
}
if (checkStartTotalMinutes >= startTotalMinutes && checkEndTotalMinutes <= endTotalMinutes) {
  //console.log(`Промежуток ${checkTime} полностью содержится в промежутке между ${startTime} и ${endTime}.`);
  return true;
} else {
 // console.log(`Промежуток ${checkTime} не содержится полностью в промежутке между ${startTime} и ${endTime}.`);
  return false;
}
}


const resolvers = {
  MutationBookingAction: {
    createBookingAction: (parent, {input}) => {
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
    createBookingAction: (parent, {input}) => {
      const timeForBooking = input.from + "-" + input.to;
 let errorMessage = ""
      const bookingElement = createBookingAction({...input, timeForBooking: timeForBooking});
      for (let i=0; i< tables.length; i++){

        console.log("id" +tables[i].id+":" +"tableID" +bookingElement.tableID)
        console.log("TABLE" +JSON.stringify(tables[i]))
        if (tables[i].id ==bookingElement.tableID) {
console.log("FOUNDDDDD")
console.log(JSON.stringify(tables[i]))
          let flag = true
          let bookedTime = ""
for(let j=0; j< tables[i].timeForBooking.length; j++){
  console.log("ELEMENT"+JSON.stringify(tables[i].timeForBooking[j]))
console.log(timeForBooking,  tables[i].timeForBooking[j].from, tables[i].timeForBooking[j].to )
  if(isAbleToBook(timeForBooking, tables[i].timeForBooking[j].from, tables[i].timeForBooking[j].to )) //true =не находится false =  находится
   {
    flag=false
    console.log("CANNOR" + JSON.stringify(tables[i].timeForBooking[j]) )
    bookedTime= tables[i].timeForBooking[j].from+"-" +tables[i].timeForBooking[j].to 

  /*   flag=false
     console.log("CANNOR" + JSON.stringify(tables[i].timeForBooking[j]) )
     bookedTime= tables[i].timeForBooking[j].from+"-" +tables[i].timeForBooking[j].to  */
  } 
  else {
    console.log("НЕ Содержится", timeForBooking,  tables[i].timeForBooking[j].from, tables[i].timeForBooking[j].to )
  //  continue
   }
} 
if(flag) {
//  tables[i].timeForBooking.push(bookingElement)
//bookingElement.tableID

tables[Number(bookingElement.tableID)-1].timeForBooking.push(bookingElement)
}
 else {
  errorMessage = `You cannot book this table as it is already booked for ${bookedTime}`
  console.log( "YOU CANT BOOK THIS TABLE BECAUUSE" +bookedTime)
 }
        }
      }
 console.log(JSON.stringify(tables))
     // return bookingElement;e
     return { bookingElement, errorMessage };
    }
  }, 
  Query: {
    currentNumber() {
      return currentNumber;
    },
    getUser: (parent, { id}) => { 
      return users.find(user => user.id == id);
    },
    getTableInfo: (parent, { id , date }) => { 
      const table = tables.find(table => table.id == id);
let dateTimeForBooking = table.timeForBooking.filter(item=>{
  item.dataOfBooking==date
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
    

    getCalendarInfoAboutTables: (parent, {date})=> {
console.log(date)
const tablesCopy = tables
for(let i=0; i<tablesCopy.length; i++) {
console.log(JSON.stringify(tablesCopy[i]))
let dateTimeForBooking = tablesCopy[i].timeForBooking.filter(item=>{
  item.dataOfBooking==date
  return item.dataOfBooking == date;
}
  )
tablesCopy[i].timeForBooking = dateTimeForBooking
/*
*/
}

console.log("table copy" +JSON.stringify(tablesCopy))
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
//  const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
  const currentDateTime = `${formattedTime}-${formattedDate}`;

  //const date = "23-1-2024"
  //FORMATTED2024-2-23
  /*c
  */
  const formatttedDate = `${currentDate.getDate()}-${currentDate.getMonth() }-${currentDate.getFullYear()}`;
// console.log("TABLE" +JSON.stringify(tables))
 //console.log("FORMATTED" +formattedDate)
 const tablesCopy = tables.map(table => ({...table, timeForBooking: table.timeForBooking.filter(item => item.dataOfBooking ===formatttedDate)}));
  pubsub.publish('NUMBER_INCREMENTED', { currentNumber: currentDateTime });
//console.log(JSON.stringify(tablesCopy))
pubsub.publish('CURRENT_TABLES', { tables: tablesCopy });

  setTimeout(incrementNumber, 1000);
}
incrementNumber();
}

startServer().catch(error => console.error(error));


/*


mutation CreateBookingAction {
  createBookingAction(input: {
    tableID: 3
    from: "12:00"
    to: "14:00"
    amountOfChairs: 3
    dataOfBooking: "24-2-2024"
  }) {
    bookingElement {
      tableID
      from
      to
      amountOfChairs
      dataOfBooking
    }
    errorMessage
  }
}


*/
/*



subscription Subscription {
 
tables {
  amountOfChairs
}
}


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