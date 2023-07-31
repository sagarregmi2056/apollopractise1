const express = require('express');
const { ApolloServer } = require("@apollo/server");

// express middleware 

const{ExpressMiddleware, expressMiddleware}= require('@apollo/server/express4')

const cors = require('cors');


const bodyParser = require('body-parser');
const {default:axios}= require('axios')

// starting of the server 
async function startServer(){

    const app = express();
    const server = new ApolloServer({
    //    same like data type here like schema of mongoose jastai as well as ! is like a required true in mongoose 
    typeDefs:`

    type User{
        id:ID!
        name:String!
        username:String!
        email:String!
        phone:String!
        website:String!
    }
    type TODO{

        
        id:ID!
        title:String!
        completed:Boolean

    }

    type Query{
        getTodos:[TODO]
        getAllUsers:[User]
        getUser(id:ID!):User
    }

    `,

    resolvers:{
        Query:{
            getTodos: async()=>
            
           ( await axios.get('https://jsonplaceholder.typicode.com/todos')).data,

           getAllUsers:async()=>
            
           ( await axios.get('https://jsonplaceholder.typicode.com/users')).data,

        //    fetching single user according to the id 

           getUser:async(parent,{id})=>
            
           ( await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data,
        },
    },


    });
    // above 
    // the type query will return the arrray of TODO with query getTodos
    // the logic was inserted inside resolvers


    // using middleware
    app.use(bodyParser.json());
    app.use(cors());

    //  starting server
    await server.start()




    app.use("/graphql",expressMiddleware(server));
    app.listen(8000,()=>console.log("server started at PORT 8000"));

}
startServer();