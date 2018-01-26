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
