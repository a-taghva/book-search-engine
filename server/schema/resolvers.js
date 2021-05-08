const { User} = require('../models')
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
  Query: {
    me: async (parent, params, context) => {
      if (!context.user) {
        return new AuthenticationError("You are not logged in!!");
      }

      const userData = await User.findOne({ _id: context.user._id }) 
        .select('-__v -password')
        .populate('savedBooks');

      return userData;
    }
  }
};

module.exports = resolvers;
