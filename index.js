const express = require('express')
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


/*
mutation {
  createUser(input: {
    username: "Gleb"
    age: 34
  }) {
    id username
  }
}
*/