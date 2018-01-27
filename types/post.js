const {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} = require('graphql');

const fields = {
  id: {
    type: GraphQLID
  },
  text: {
    type: GraphQLString
  }
};

const PostType = new GraphQLObjectType({
  fields,
  name: 'PostType'
});

const PostInputType = new GraphQLInputObjectType({
  fields: Object.entries(fields).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: { type: new GraphQLNonNull(value.type) }
  }), {}),
  name: 'PostInputType'
});

module.exports = { PostInputType, PostType };
