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

    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },

    saveBook: async (parent, params, { user }) => {
      if (!user) {
        return new AuthenticationError('You need to be logged in!!')
      }

      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { savedBooks: params } },
          { new: true, runValidators: true }
        );

        return updatedUser;
      } catch (err) {
        console.log(err);
      }
    },
  }
};

module.exports = resolvers;
