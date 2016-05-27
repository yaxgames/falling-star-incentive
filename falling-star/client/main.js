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
		if(Users.find({username: loginattempt[0]}).fetch()[0] != undefined){
			if(Users.find({username: loginattempt[0]}).fetch()[0].password == loginattempt[1]){
				Session.set("currentuser",loginattempt[0]);
			}else{
				alert("Username/password not found - 1");
			}
		}else{
				alert("Username/password not found - 2");
		}
		//to proceed with the login check
		return false;
	}
});

Template.blogcreate.events({
	//Creating new blogs via the create form
	"submit .blogcreate": function(e){
	console.log("new blog: " + e.target.title.value);
		var blogentry = [e.target.title.value,e.target.desc.value];
		var cUserID = Users.find({username: Session.get("currentuser")}).fetch()[0].userid;
		Blogs.insert({title: blogentry[0], description: blogentry[1],datetime: Date(), userid: cUserID});
		
		return false;
	}
});