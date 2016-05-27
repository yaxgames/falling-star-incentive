import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

//Collections shared in the client 
Blogs = new Mongo.Collection("blogs");
Users = new Mongo.Collection("users");
//Creating session to hold temporary variables such as current user logged in.
Session.set("currentuser","");
userloggedin = false;
//helpers
Template.blogdisplay.helpers({
	Blogs: function(){
		return Blogs.find({}, {sort: {datetime:-1}});
	}
});
Template.login.helpers({
	'nouser':function(){	
		if (Session.equals("currentuser","")){
			console.log("no user logged in");
			return true;
		}
		console.log("user logged in " + Session.get("currentuser"));
		return false;
	}
	
});
Template.blogcreate.helpers({
	'userlogged': function(){
		if (!Session.equals("currentuser","")){
		console.log("user logged in " + Session.get("currentuser"));
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
		var cUserID = Session.get("currentuser");//Users.find({username: CurrentUser}).fetch()[0].userid;
		Blogs.insert({title: blogentry[0], description: blogentry[1],datetime: Date(), userid: cUserID});
		
		return false;
	}
});