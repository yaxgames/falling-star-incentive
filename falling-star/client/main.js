import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

//Collections shared in the client 
Blogs = new Mongo.Collection("blogs");
Users = new Mongo.Collection("users");
CurrentUser = "";
Template.blogdisplay.helpers({
	Blogs: function(){
		return Blogs.find({}, {sort: {datetime:-1}});
	}
});

Template.login.events({
	"submit .login": function(e){
		var loginattempt = [e.target.user.value,e.target.pass.value];
		//to proceed with the login check
		return false;
	}
});

Template.login.events({
	//Creating new blogs via the create form
	"submit .blogcreate": function(e){
		var blogentry = [e.target.title.value,e.target.desc.value];
		var cUserID = Users.find({username: CurrentUser}).fetch()[0].userid;
		Blogs.insert({title: blogentry[0], description: blogentry[1],datetime: Date(), userid: cUserID});
		
		return false;
	}
});