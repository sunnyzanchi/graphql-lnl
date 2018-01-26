const axios = require('axios');
const {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString
} = require('graphql');
const VehicleType = require('./vehicle');

module.exports = new GraphQLObjectType({
  description: 'Data about a particular person',
  fields: {
    birthYear: {
      description: "The person's birth year",
      resolve(person) {
        return person.birth_year;
      },
      type: GraphQLString
    },
    created: {
      description: 'ISO 8601 date format of the creation time for this person',
      type: GraphQLString
    },
    edited: {
      description: 'ISO 8601 date format of the last edit time for this person',
      type: GraphQLString
    },
    eyeColor: {
      description: "The person's eye color",
      resolve(person) {
        return person.eye_color;
      },
      type: GraphQLString
    },
    hairColor: {
      description: "The person's hair color",
      resolve(person) {
        return person.hair_color;
      },
      type: GraphQLString
    },
    height: {
      description: "The person's height in centimeters",
      resolve(person) {
        return Number(person.height);
      },
      type: GraphQLInt
    },
    mass: {
      description: "The person's mass in kilograms",
      resolve(person) {
        return Number(person.mass);
      },
      type: GraphQLInt
    },
    name: {
      type: GraphQLString
    },
    skinColor: {
      description: "The person's skin color",
      resolve(person) {
        return person.skin_color;
      },
      type: GraphQLString
    },
    vehicles: {
      description: 'Vehicles the person has piloted',
      async resolve(person) {
        const getVehicles = person.vehicles.map(v =>
          axios.get(v + '?format=json')
        );

        const results = await Promise.all(getVehicles);
        return results.map(result => result.data);
      },
      type: new GraphQLList(VehicleType)
    }
  },
  name: 'PersonType'
});
