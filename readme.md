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

Once we have these files saved, we can go ahead and start up our very first GraphQL server! Nodemon watches for changes and restarts automatically, so we should just need to run this once. Just run:

```
yarn start
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

## Mutations
Querying data is great. I love querying data. But if you're less of an output kind of person and more of input kind of person, you might be tired of all these queries. Fortunately, GraphQL has mutations that allow user input. Now, technically, regular old queries can update data, cause side effects — basically anything you code them to do — but that's bad practice. GraphQL mutations are explicit in the data that they allow to be inputted and provide type checking for arguments. I know you must be foaming at the mouth to try these mutations so let's get started.

### Mutation in the Schema
We'll need to update our schema by adding a mutation to it:
```javascript
const mutation = new GraphQLObjectType({...})

module.exports = new GraphQLSchema({
  mutation,
  query
});
```
Before we write our mutation resolver, let's give it something to work with. Since public APIs that allow updates are hard to find, and setting up a real database would take too long, we'll use a fake database, through the way of `hashmap`:
```
yarn add hashmap
```
Hashmap lets you get/set key-value pairs in memory, so it won't last after the server stops, but it will work for our purposes. Go ahead and make a new "database" in your schema:
```javascript
const HashMap = require('hashmap');
const db = new HashMap();
```

Now we can use `db.set(key, value)` and `db.get(key)` where we would normally read/write to a database. So, on to setting up the mutation. The properties that you need to supply to the GraphQLObject type constructor are the exact same as what's needed in the query constructor, so this should make it easy!

We're going to be setting up a mutation to add a post that looks like this:
```javascript
{
  id: 123, // GraphQLID (GraphQLInt would work here but it's semantically different)
  text: 'I eat stickers all the time dude!' // GraphQLString
}
```
Give your field a name like _addPost_ or _setPost_. One thing that's different, when you add the arg how you would for the query, the `type` of the arg may be confusing. It's not just going to be a string, since we'll be supplying an object. The trick here is that GraphQL lets you define a _GraphQLInputObjectType_. The arg for the mutation needs to be an input type, while the return value will need to be a regular (ouput) type. Gold start if you guessed it; this means we'll have to define two types!

### Defining the Types
Go ahead and add `post.js` in your types folder. You already know how to make a regular type, since you made the person type. The post type will be a lot easier, since it's only two fields! But how do you make the input type?

Turns out, it's actually incredibly easy. All you have to do is write the type the exact same way, but instead of using a _GraphQLObjectType_, you have to use a _GraphQLInputObjectType_. And that's it! Make sure to name it differently, the convention is to name input types the same as the corresponding output types, just with 'InputType' at the end. There are a few caveats, like the fact that a _GraphQLInputObjectType_ can't have a field as a type of _GraphQLObjectType_, it has to be another input type, and input types can't have resolver functions. But for the most part, they're the exact same!

In the case of the PostType and the PostInputType, since they have the same fields, you can even deduplicate the code/effort of typing the fields separately for both of them. Simply define the fields outside of your types as something like `const fields = {...}`, then use that object in both types.

When you're done, your types should look like this:
```javascript
const fields = {...}

const PostType = new GraphQLObjectType({
  fields,
  name: 'PostType'
});

const PostInputType = new GraphQLInputObjectType({
  fields,
  name: 'PostInputType'
});

module.exports = { PostInputType, PostType };
```
Alright! Now that we have our types defined, let's get back to the mutation in the schema.

### Mutation Resolvers
Now that we have our post input type, make sure it's imported, then you should be able to set the arg on your mutation to the PostInputType:
```javascript
args: {
  post: { type: PostInputType }
},
```
Almost done! Make sure you set the return type of the mutation to PostType, same way you set the return type on your people query earlier. The last thing we need to do is write the resolve function. The syntax for the arguments and the place you get them is the same as queries:
```javascript
resolve(_, { post }) {
  db.set(post.id, post.text);
  return post;
},
```
And there we go! Now we have the ability to supply the GraphQL API server with mutations. GraphQL syntax can be a little odd at times, so here's how you might do that:
```graphql
mutation {
  upsertPost(post: {
    id: 42,
    text: "Cat in the wall, eh? Now you’re talking my language."
  }) {
    id
    text
  }
}
```
You might notice a few differences from a regular query. You have to specify _mutation_ explicity. Wait. I guess that's really the only difference. You add the argument like normal, to define an object you can just use the same object literal syntax as JavaScipt, and you specify the fields you want back from the return value. Perfect.

### If you were skeptical when I said perfect, good looking out. There is actually something we missed
Yes, indeed. While this does work perfectly, you can add posts all day, and if you take the 2 minutes to add a query, you can read posts, too. The attentive coder might notice, however, that you can add a post *without* specifying an id. Oh no!

This is because, by default, all types in GraphQL are nullable. If you want to make something required, we need to explicitly enforce it, and GraphQL provides GraphQLNonNull to do just that. All you have to do is wrap the type that should be non-nullable with it:
```javascript
id: {
  type: new GraphQLNonNull(GraphQLID)
},
```
Now if we try and submit a mutation missing a non null field, GraphQL will send back an error. That's hot.
