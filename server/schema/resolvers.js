const { User } = require('../models')
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

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
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('invalid credentials!');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('invalid credentials!');
      }

      const token = signToken(user);

      return { token, user };
    },

    
  }
};

module.exports = resolvers;
