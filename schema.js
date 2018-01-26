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
