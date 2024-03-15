
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

//getInfornationAboutAbilityOfBooking(date: String!): [TableInfo]
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
 // console.log("=======================================================")
 // console.log(checkStartTime, startTime, endTime)
 // console.log(isAbleToBookMinures(checkStartTime, startTime, endTime))

 // console.log(isAbleToBookMinures(checkEndTime, startTime, endTime))
//  console.log("=======================================================")

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









/*
    createBookingAction: (parent, { input }) => {
      const timeForBooking = input.from + "-" + input.to;
      let errorMessage = ""
      const bookingElement = createBookingAction({ ...input, timeForBooking: timeForBooking });


const tablesCopy = JSON.parse(JSON.stringify(tables))
      console.log("ALLL"+JSON.stringify(tablesCopy))

      console.log("DESIRED TIMe" +timeForBooking, input.dataOfBooking)
      for (let i = 0; i < tablesCopy.length; i++) {
        if (tablesCopy[i].id == bookingElement.tableID) {
          let flag = true
          let bookedTime = ""
          for (let j = 0; j < tablesCopy[i].timeForBooking.length; j++) {
            console.log("ELEMENT" + JSON.stringify(tablesCopy[i].timeForBooking[j]))
            console.log(timeForBooking, tablesCopy[i].timeForBooking[j].from, tablesCopy[i].timeForBooking[j].to)
            if (isAbleToBook(timeForBooking, tablesCopy[i].timeForBooking[j].from, tablesCopy[i].timeForBooking[j].to) && tablesCopy[i].timeForBooking[j].dataOfBooking == input.dataOfBooking) //true =не находится false =  находится
            {
              flag = false
              console.log("CANNOR" + JSON.stringify(tablesCopy[i].timeForBooking[j]))
              bookedTime = tablesCopy[i].timeForBooking[j].from + "-" + tablesCopy[i].timeForBooking[j].to
            }
            else if (tablesCopy[i].timeForBooking[j].from == "00:00" && tablesCopy[i].timeForBooking[j].to == "00:00") {
              flag = false
            }
            else {
              console.log("НЕ Содержится", timeForBooking, tablesCopy[i].timeForBooking[j].from, tablesCopy[i].timeForBooking[j].to)
            }
          }
          if ((tablesCopy[i].timeForBooking.length == 0 && input.from == "00:00" && input.to == "00:00")) {
            tablesCopy[Number(bookingElement.tableID) - 1].timeForBooking.push(bookingElement)
          }
          else if ((tables[i].timeForBooking.length != 0 && input.from == "00:00" && input.to == "00:00")) {
            flag = false
            errorMessage = "You cannot reserve this table for the whole day as it is already booked for some time"
            bookedTime = "00:00-00:00"
          }
          else {

            if (flag) {
              tablesCopy[Number(bookingElement.tableID) - 1].timeForBooking.push(bookingElement)
            }
            else {
              errorMessage = `You cannot book this table as it is already booked for typed time`
              console.log("YOU CANT BOOK THIS TABLE BECAUUSE" + bookedTime)
            }
          }
        }
      }
      return { bookingElement, errorMessage };
    } */
    createBookingAction: (parent, { input }) => {
      const timeForBooking = input.from + "-" + input.to;
      let errorMessage = ""
      const bookingElement = createBookingAction({ ...input, timeForBooking: timeForBooking });



      console.log("ALLL"+JSON.stringify(tables))

      console.log("DESIRED TIMe" +timeForBooking, input.dataOfBooking)
      for (let i = 0; i < tables.length; i++) {
       
       
       
        if (tables[i].id == bookingElement.tableID) {
          let flag = true
          let bookedTime = ""
          console.log("IS FOUND")

          if(input.from!="00:00" || input.to!="00:00") {


            const currDay =  tables[i].timeForBooking.filter(item=> item.dataOfBooking==input.dataOfBooking)
            if(currDay.length==0){
              tables[Number(bookingElement.tableID) - 1].timeForBooking.push(bookingElement)
            } else {

              for(let z=0; z<currDay.length; z++ ){
                if(isAbleToBook(timeForBooking,currDay[z].from,currDay[z].to) ) {
flag=false
                }
              }
              if(flag) {
                tables[Number(bookingElement.tableID) - 1].timeForBooking.push(bookingElement)
              }
           /*   currDay.map(item => {
               if( isAbleToBook(timeForBooking, item.from, item.to)  ) {
                console.log("ABLE")
                return 
               }
              }) */
            }
 
          }
          /*  for (let j = 0; j < tables[i].timeForBooking.length; j++) {
              console.log("ELEMENT" + JSON.stringify(tables[i].timeForBooking[j]))
              
            }
          } */

        /* for (let j = 0; j < tables[i].timeForBooking.length; j++) {
            console.log("ELEMENT" + JSON.stringify(tables[i].timeForBooking[j]))
         



console.log("DATES"+tables[i].timeForBooking[j].dataOfBooking,  input.dataOfBooking)
            if (isAbleToBook(timeForBooking, tables[i].timeForBooking[j].from, tables[i].timeForBooking[j].to) && tables[i].timeForBooking[j].dataOfBooking == input.dataOfBooking) //true =не находится false =  находится
            {
              flag = false
              console.log("CANNOR" + JSON.stringify(tables[i].timeForBooking[j]))
              bookedTime = tables[i].timeForBooking[j].from + "-" + tables[i].timeForBooking[j].to
            }  */
          /*  if (isAbleToBook(timeForBooking, tables[i].timeForBooking[j].from, tables[i].timeForBooking[j].to) && tables[i].timeForBooking[j].dataOfBooking == input.dataOfBooking) //true =не находится false =  находится
            {
              flag = false
              console.log("CANNOR" + JSON.stringify(tables[i].timeForBooking[j]))
              bookedTime = tables[i].timeForBooking[j].from + "-" + tables[i].timeForBooking[j].to
            }
            else if (tables[i].timeForBooking[j].from == "00:00" && tables[i].timeForBooking[j].to == "00:00") {
          //    flag = false
            }
            else {
              console.log("НЕ Содержится", timeForBooking, tables[i].timeForBooking[j].from, tables[i].timeForBooking[j].to)
            } */
      //    }
          if ((tables[i].timeForBooking.length == 0 && input.from == "00:00" && input.to == "00:00")) {
            tables[Number(bookingElement.tableID) - 1].timeForBooking.push(bookingElement)
          }
          else if ((tables[i].timeForBooking.length != 0 && input.from == "00:00" && input.to == "00:00")) {
            let countOfOffersAtCurrentDataOfBooking =0
for(let z=0; z< tables[i].timeForBooking.length; z++) {
  console.log("DESIRED TIMe" +timeForBooking, input.dataOfBooking)
  console.log("BOOKedD TIME "+JSON.stringify(tables[i].timeForBooking[z]))
  if(tables[i].timeForBooking[z].dataOfBooking==input.dataOfBooking){
    countOfOffersAtCurrentDataOfBooking++
  }
  //BOOKedD TIME {"tableID":1,"from":"00:00","to":"00:00","amountOfChairs":1,"dataOfBooking":"15-3-2024","timeForBooking":"00:00-00:00"}
}
console.log("COUNTTT" +countOfOffersAtCurrentDataOfBooking)
if(countOfOffersAtCurrentDataOfBooking>0){
  flag = false
                console.log("INPUT DATA" , input.dataOfBooking) //16-3-2024
                errorMessage = "You cannot reserve this table for the whole day as it is already booked for some time"
                bookedTime = "00:00-00:00"
}
  else {
    tables[Number(bookingElement.tableID) - 1].timeForBooking.push(bookingElement)
  }
          }
         /* else if ((tables[i].timeForBooking.length != 0 && input.from == "00:00" && input.to == "00:00")) {

let count=0
let countOfOffers=0
            for(let z=0; z<tables[i].timeForBooking.length; z++) {
              console.log("BOOKING TIME" +JSON.stringify(tables[i].timeForBooking[z])) 

              console.log("TBS"+tables[i].timeForBooking[z].dataOfBooking)
              console.log("INP"+input.dataOfBooking)
              if(tables[i].timeForBooking[z].dataOfBooking==input.dataOfBooking){
                countOfOffers++
                count++
               // if(count!=1){


              }
              if(count!=0){

                flag = false
                // && input.dataOfBooking==tables[i].timeForBooking[i].dataOfBooking
    
                console.log("INPUT DATA" , input.dataOfBooking) //16-3-2024
                errorMessage = "You cannot reserve this table for the whole day as it is already booked for some time"
                bookedTime = "00:00-00:00"
              } 
           //   }



              else {

              //  console.log("YOU BOOKED THIS TABLE FOR WHOLE DAY")
                if(countOfOffers==0){
                }
                //if()
            //    tables[Number(bookingElement.tableID) - 1].timeForBooking.push(bookingElement)

              }


              if(count==0) {
                tables[Number(bookingElement.tableID) - 1].timeForBooking.push(bookingElement)
              }
              //BOOKING TIME{"tableID":1,"from":"00:00","to":"00:00","amountOfChairs":1,"dataOfBooking":"15-3-2024","timeForBooking":"00:00-00:00"}
            }
          }
          */
          else {

            if (flag) {
            //  tables[Number(bookingElement.tableID) - 1].timeForBooking.push(bookingElement)
            }
            else {
              errorMessage = `You cannot book this table as it is already booked for typed time`
              console.log("YOU CANT BOOK THIS TABLE BECAUUSE" + bookedTime)
            }
          }

        }
      }

      for(let i=0; i<tables.length; i++) {
        console.log("TABL"+JSON.stringify(tables[i]))
      }
      return { bookingElement, errorMessage };
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

      console.log("TABLEEEEEEEEEEEEEES" + JSON.stringify(tables))
      console.log(date)
      const tablesCopy = tables
      for (let i = 0; i < tablesCopy.length; i++) {
        console.log(JSON.stringify(tablesCopy[i]))
        let dateTimeForBooking = tablesCopy[i].timeForBooking.filter(item => {
          item.dataOfBooking == date
          return item.dataOfBooking == date;
        }
        )
        tablesCopy[i].timeForBooking = dateTimeForBooking
        /*
        */
      }

      console.log("table copy" + JSON.stringify(tablesCopy))
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
      //  console.log("ELEMENT" + JSON.stringify(tablesCopy[i]))
        let isBooked = false
        for (let j = 0; j < tablesCopy[i].timeForBooking.length; j++) {
          if (tablesCopy[i].timeForBooking[j].from == "00:00" && tablesCopy[i].timeForBooking[j].to == "00:00") {
            isBooked = true
          }
        }
        arrayOfAbleToBookTables.push(isBooked)
      }


      //const arrayOfAbleToBookTables = []ч
      return arrayOfAbleToBookTables
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