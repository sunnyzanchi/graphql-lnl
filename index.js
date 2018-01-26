const express = require('express');
const graphqlHTTP = require('express-graphql');

const schema = require('./schema');

const app = express();
app.use(
  '/',
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

app.listen(1234);
console.log('Running a GraphQL API server at localhost:1234');
