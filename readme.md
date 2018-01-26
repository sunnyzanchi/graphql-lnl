# GraphQL Lunch and Learn

To get started, we'll need to add `express`, `express-graphql`, and `graphql`. We'll be using yarn for this.
We'll also add a few dev dependencies. `eslint`, `eslint-config-gsandf`, and `nodemon`. ESLint will keep our code looking nice and help catch mistakes. Nodemon will watch our files and restart our server when they change. These are all already in the package.json, so just run yarn:
```
yarn
```
If you're unfamiliar with express, it's a web server framework for Node. We won't be doing much with it, it will just handle incoming requests, and `express-graphql` serves as the glue to get the requests to GraphQL.

## Initial Server Setup

The inital set up is very straight-forward. We'll make a new file called `index.js` and add the following to it:

```javascript
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
```

See, not so bad. You may have noticed that we import `./schema` here. We're going to define our schema in a separate file to keep things clean and easy to manage. We'll start out with just a quick example schema:

```javascript
const { GraphQLObjectType, GraphQLString, GraphQLSchema } = require('graphql');

const query = new GraphQLObjectType({
  fields: {
    testing: {
      type: GraphQLString,
      resolve() {
        return 'testing';
      }
    }
  },
  name: 'Query'
});

module.exports = new GraphQLSchema({
  query
});
```

Once we have these files saved, we can go ahead and start up our very first GraphQL server! Just run:

```
node ./index.js
```

If you navigate to `localhost:1234/` you should see the GraphiQL interface. Let's give our server its first query. In the text area on the left, type:

```
{
  testing
}
```

and hit the _Run_ button or press <kbd>Command</kbd>+<kbd>Enter</kbd>. Now we have the results of our first query!
