import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

//Collections shared in the client 
Blogs = new Mongo.Collection("blogs");
Users = new Mongo.Collection("users");
CurrentUser = 0;
userloggedin = false;
//helpers
Template.blogdisplay.helpers({
	Blogs: function(){
		return Blogs.find({}, {sort: {datetime:-1}});
	}
});
Template.login.helpers({
	'nouser':function(){	
		if (CurrentUser == 0 || CurrentUser == undefined){
			console.log("no user logged in");
			return true;
		}
		console.log("user logged in " + CurrentUser);
		return false;
	}
	
});
Template.blogcreate.helpers({
	'userlogged': function(){
		if (CurrentUser != 0 && CurrentUser != undefined){
		console.log("user logged in " + CurrentUser);
			return true;
		}
		console.log("No user logged in ");
		return false;
	}
});

//events
Template.login.events({
	"submit .login": function(e){
	console.log("test login");
		var loginattempt = [e.target.user.value,e.target.pass.value];
		//to proceed with the login check
		return false;
	}
});

Template.blogcreate.events({
	//Creating new blogs via the create form
	"submit .blogcreate": function(e){
	console.log("new blog: " + e.target.title.value);
		var blogentry = [e.target.title.value,e.target.desc.value];
		var cUserID = 0;//Users.find({username: CurrentUser}).fetch()[0].userid;
		Blogs.insert({title: blogentry[0], description: blogentry[1],datetime: Date(), userid: cUserID});
		
		return false;
	}
});