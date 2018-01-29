const axios = require('axios');
// These are built-in GraphQL types. These are used for type enforcement
// on input and output values
const {
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema
} = require('graphql');
const HashMap = require('hashmap');

const PersonType = require('./types/person');
const { PostType, PostInputType } = require('./types/post');

const db = new HashMap();

const query = new GraphQLObjectType({
  fields: {
    people: {
      args: {
        name: { type: GraphQLString }
      },
      description: 'Search for people by name',
      async resolve(_, { name }) {
        const { data } = await axios.get(
          `https://swapi.co/api/people/?search=${name}&format=json`
        );
        return data.results;
      },
      type: new GraphQLList(PersonType)
    }
  },
  name: 'Query'
});

const mutation = new GraphQLObjectType({
  fields: {
    upsertPost: {
      args: {
        post: { type: PostInputType }
      },
      resolve(_, { post }) {
        db.set(post.id, post.text);
        return post;
      },
      type: PostType
    }
  },
  name: 'Mutation'
});

module.exports = new GraphQLSchema({
  mutation,
  query
});
