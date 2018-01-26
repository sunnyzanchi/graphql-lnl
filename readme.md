# GraphQL Lunch and Learn

To get started, we'll need to add `express`, `express-graphql`, and `graphql`. We'll be using yarn for this.

```
yarn add express express-graphql graphql
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

## Making the API Useful

While an API that returns the string "testing" is incredibly cool and will no doubt make you the envy of all your friends, let's get even crazier. Let's set up a GraphQL API in front of a single RESTful API so we can some of the benefits before we even start using multiple APIs.

GraphQL APIs are strongly typed. That means that every query has a _type_ defined that specifies exactly what fields can be requested, and only fields that are defined can be requested. For example, `testing` is the only field currently defined in our schema, if we tried to query for anything else, we would receive an error.

GraphQL is just the system for defining your schema and validating requests against that schema. The actual implementation of getting that data is totally up to you. To make it easy on ourselves, instead of creating a schema out of thin air and setting up our own database and querying that to fulfill GraphQL requests, we're going to use a free, existing API. https://swapi.co/ is a completely free API for all sorts of Star Wars data. We'll be working from the [People API](https://swapi.co/documentation#people). For brevity, we won't define types for related item fields, like `films` or `species` but we could do so fairly easily.

Let's update our schema to add a `people` query. First, since we're using an external API, we'll need to make HTTP requests. I'm going to use axios, but you can use a different library if you'd prefer. `yarn add axios` and let's update our `schema.js`:

```javascript
const axios = require('axios');
const {
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema
} = require('graphql');
const PersonType = require('./types/person');

const query = new GraphQLObjectType({
  fields: {
    people: {
      args: {
        name: { type: GraphQLString }
      },
      description: 'Find people whose name matches the provided string',
      type: new GraphQLList(PersonType),
      async resolve(_, { name }) {
        const { data } = await axios.get(
          `https://swapi.co/api/people/?search=${name}&format=json`
        );
        return data.results;
      }
    }
  },
  name: 'Query'
});

module.exports = new GraphQLSchema({
  query
});
```

Okay. Let's go over our changes. Instead of a query called `testing`, we now have a query called `people`. In GraphQL, queries can have arguments, which is what we've defined with the `args` property. Any arguments you want to have access to in the resolve function _must_ be defined in `args`. Any arguments that are provided to the query you will have access to as an object that is the second parameter to the resolve function. Our resolve function uses the `name` argument to query our external API, then returns the data. If you noticed, our resolve function is async, which means it returns a Promise. This is totally fine in GraphQL, it will handle this return value just how it would a synchronous return value. Another thing that's changed is the `type`. We're no longer returning a plain string; we're returning a list of our custom-defined type PersonType.

Go ahead and look at the documentation and see if you can define the schema that describes the _Person_ type. We're going to save our type in `./types/person.js`. Don't include the fields `films`, `homeworld`, `species`, `starships`, `url`, or `vehicles` since these are reference fields and would need their own types, greatly increasing the complexity of our example. The fields that come from the API are snake_case, like "birth_year". Bonus points if you can expose the data as camelCase (hint: type fields can have resolve functions, too). If you're a little lost, the shell of your PersonType should look like this:

```javascript
module.exports = new GraphQLObjectType({
  fields: {...},
  name: 'PersonType'
})
```

If you have a bit of extra time, you can take a minute to try and implement one of the related fields. If you want to look at an example, this repo has the `vehicles` field added on the Person type at tag `step3.1`.
