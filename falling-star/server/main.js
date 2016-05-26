import { Meteor } from 'meteor/meteor';
Blogs = new Mongo.Collection("blogs");
Users = new Mongo.Collection("users");
Meteor.startup(() => {
  // code to run on server at startup
});


