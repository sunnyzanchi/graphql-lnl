const {
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString
} = require('graphql');

module.exports = new GraphQLObjectType({
  description:
    'A single transport craft that does not have hyperdrive capability',
  fields: {
    cargoCapacity: {
      description: 'Max transport weight in kilograms',
      resolve(vehicle) {
        return Number(vehicle.cargo_capacity);
      },
      type: GraphQLInt
    },
    consumablesDuration: {
      description:
        'Maximum duration vehicle can provide consumables before resupply',
      resolve(vehicle) {
        return vehicle.consumables;
      },
      type: GraphQLString
    },
    costInCredits: {
      description: 'Cost of the vehicle new in galactic credits',
      resolve(vehicle) {
        return Number(vehicle.cost_in_credits);
      },
      type: GraphQLInt
    },
    crew: {
      description: 'The required number of personnel to operate the vehicle',
      type: GraphQLString
    },
    length: {
      description: 'Length of the vehicle in meters',
      resolve(vehicle) {
        return Number(vehicle.length);
      },
      type: GraphQLFloat
    },
    manufacturers: {
      description: 'Manufacturers of the vehicle',
      // A vehicle can have multiple or just one manufacturer
      // and comes from the SWAPI as a comma-delimited string
      resolve(vehicle) {
        return vehicle.manufacturer.split(',');
      },
      type: new GraphQLList(GraphQLString)
    },
    maxAtmospheringSpeed: {
      description: 'Max speed of the vehicle in atmosphere',
      resolve(vehicle) {
        return vehicle.max_atmosphering_speed;
      },
      type: GraphQLInt
    },
    maxPassengers: {
      description:
        'Maximum number of non-essential personnel the vehicle can transport',
      resolve(vehicle) {
        return vehicle.passengers;
      },
      type: GraphQLInt
    },
    model: {
      description: 'The official name of the vehicle',
      type: GraphQLString
    },
    name: {
      description: 'The common name of the vehicle',
      type: GraphQLString
    },
    vehicleClass: {
      description: 'The type of vehicle',
      resolve(vehicle) {
        return vehicle.vehicle_class;
      },
      type: GraphQLString
    }
  },
  name: 'VehicleType'
});
