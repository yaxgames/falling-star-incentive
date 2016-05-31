import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

//Collections shared in the client 
Blogs = new Mongo.Collection("blogs");
Users = new Mongo.Collection("users");
//Creating session to hold temporary variables such as current user logged in.
Session.set("currentuser","");
Session.set('registerdisplay',false);
Session.set('editdisplay',false);

//------------------helpers-----------------
//----Blog Display Helper, to display the blog in order of date---
Template.blogdisplay.helpers({
	Blogs: function(){
		return Blogs.find({}, {sort: {datetime:-1}});
	}
});
//------------the blog display helpers for form variables
Template.blogdisplay.helpers({
	'sameuser':function(bloguser){
		if(!Session.equals("currentuser","")){
			if(bloguser == Users.find({username:Session.get("currentuser")}).fetch()[0]._id){
				return true;
			}
			return false;
		}
	},
	'dateformat':function(date){
		return moment(date).format('YYYY-MMM-DD h:mm:ss a');
	},
	'editdisplay':function(){
		return Session.get("editdisplay");
	}
});
//----Helpers to determine if users are logged in---
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
Template.userregister.helpers({
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

//----helper to determine if the registration should display
Template.userregister.helpers({
	'registerdisplay':function(){
		return Session.get('registerdisplay');
	}
});


//----------------------------events----------------------------
//---Log in event----
Template.login.events({
//on login button
	"submit .login": function(e){
	//collect the form values into array
		var loginattempt = [e.target.user.value,e.target.pass.value];
		//if user exists check password
		if(Users.find({username: loginattempt[0]}).fetch()[0] != undefined){
			if(Users.find({username: loginattempt[0]}).fetch()[0].password == loginattempt[1]){
				Session.set("currentuser",loginattempt[0]);
			}else{
				alert("Username/password not found");
			}
		}else{
				alert("Username/password not found");
		}
		e.target.user.value ="";
		e.target.pass.value ="";
		return false;
	}
});
//----create new blogs----------
Template.blogcreate.events({
	//Creating new blogs via the create form
	"submit .blogcreate": function(e){
		//collect entry within array
		var blogentry = [e.target.title.value,e.target.desc.value];
		//finds the current user ID
		var cUserID = Users.find({username:Session.get("currentuser")}).fetch()[0]._id
		//adds new blog to collection
		Blogs.insert({title: blogentry[0], description: blogentry[1],datetime: Date(), userid: cUserID, username: Session.get("currentuser")});
		e.target.title.value ="";
		e.target.desc.value = "";
		return false;
	}
});

Template.blogdisplay.events({
	//removing the blog from the collection
	"click #remove": function(e){
	//makes sure the the current user isn't noone
		if(!Session.equals("currentuser","")){
		//makes sure only the maker of the blog can remove it
			if(Users.find({username:Session.get("currentuser")}).fetch()[0]._id == Blogs.findOne(this._id).userid){
				if(confirm("Are you sure you want to delete this blog?")){
					Blogs.remove(this._id);
				}
			}
		}
	},
	//edits blog with form
	"submit .blogedit":function(e){
		//adds a new blog based on the form, from the user with the current date and time
		Blogs.update(this._id,{title:e.target.title.value, description:e.target.desc.value, datetime: Date(),userid: Users.find({username:Session.get("currentuser")}).fetch()[0]._id, username: Session.get("currentuser")});
		e.target.title.value =""; 
		e.target.desc.value ="";
		Session.set("editdisplay",false)
		return false;
	},
	//display the edit form
	'click #edit':function(e){
		if(Session.get("editdisplay")){
			Session.set("editdisplay",false);
		}else{
			Session.set("editdisplay",true);
		}
		
	}
	
});
//----user registration section to toggle display of registration section
Template.userregister.events({
	'click .register': function(){
		
		if(!Session.get('registerdisplay')){
			Session.set('registerdisplay',true);
		}else{
			Session.set('registerdisplay',false);
		}
	},
//----registers new user----------
	'submit .userregister':function(e){
		//collects user info from the form
		var regattempt = [e.target.name.value,e.target.user.value,e.target.pass.value,e.target.desc.value];
		//checks if the username already exists otherwise create user
		if(Users.find({username: regattempt[1]}).fetch()[0] != undefined){
			alert("user already exists");
			e.target.name.value = "";
			
		}else{
			Users.insert({userid:0,name:regattempt[0],username:regattempt[1],password:regattempt[2],descriotion:regattempt[3]});	
		}
		e.target.name.value ="";
		e.target.user.value ="";
		e.target.pass.value ="";
		e.target.desc.value ="";
		Session.set("registerdisplay",false);
		return false;
	}
	
});
