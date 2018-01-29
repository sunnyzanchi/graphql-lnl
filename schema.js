const axios = require('axios');
// These are built-in GraphQL types. These are used for type enforcement
// on input and output values
const {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
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
    },
    post: {
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      description: 'Return a single post by the given id',
      resolve(_, { id }) {
        return {
          id,
          text: db.get(id)
        };
      },
      type: PostType
    },
    posts: {
      description: 'Return all posts',
      resolve() {
        return db.entries().map(([id, text]) => ({
          id,
          text
        }));
      },
      type: new GraphQLList(PostType)
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
