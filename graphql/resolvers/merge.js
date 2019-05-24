const DataLoader = require('dataloader');

const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');

const eventLoader = new DataLoader(eventIds => findEvents(eventIds));
const userLoader = new DataLoader(userIds => User.find({ _id: { $in: userIds } }));

const findUser = async (userId) => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      createdEvents: () => eventLoader.loadMany(user.createdEvents),
    };
  } catch (error) {
    throw error;
  }
};

const findSingleEvent = async (eventId) => {
  try {
    const event = await eventLoader.load(eventId.toString());
    return event;
  } catch (error) {
    throw error;
  }
};

const findEvents = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    // since this function is used in eventLoader
    events.sort((a, b) => (
      eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString())
    ));
    return events.map(event => transformEvent(event));
  } catch (error) {
    throw error;
  }
};

const transformEvent = event => ({
  ...event._doc,
  date: dateToString(event.date),
  creator: findUser.bind(this, event.creator),
});

const transformBooking = booking => ({
  ...booking._doc,
  user: findUser.bind(this, booking.userId),
  event: findSingleEvent.bind(this, booking.eventId),
  createdAt: dateToString(booking.createdAt),
  updatedAt: dateToString(booking.updatedAt),
});

module.exports = {
  transformEvent,
  transformBooking,
};
