const {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} = require('graphql');

const fields = {
  id: {
    type: new GraphQLNonNull(GraphQLID)
  },
  text: {
    type: new GraphQLNonNull(GraphQLString)
  }
};

const PostType = new GraphQLObjectType({
  fields,
  name: 'PostType'
});

const PostInputType = new GraphQLInputObjectType({
  fields,
  name: 'PostInputType'
});

module.exports = { PostInputType, PostType };
