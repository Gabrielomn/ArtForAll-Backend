const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const art = require('../art/ArtModel');
const userAbstract = require('../user/UserAbstract');

var profileSchema = new Schema();

profileSchema.add({

	_id: Schema.Types.ObjectId,
	userName:{
		type: String,
		required: true,
//		unique:true
	},
	following:[userAbstract.abstractSchema],
	followingNumber:{
		type:Number
	},
	followers:[userAbstract.abstractSchema],
	followersNumber:{
		type:Number
	},
	userArts:[art.artSchema],
	userFavoritesArts:[art.artSchema]
})

profileSchema.methods.incrementFollowers = function(){
	this.followersNumber = this.followersNumber + 1;
}

profileSchema.methods.decrementFollowers = function(){
	if(this.followersNumber > 0) this.followersNumber = this.followersNumber - 1;
}

profileSchema.methods.incrementFollowing = function(){
	this.followingNumber = this.followingNumber + 1;
}

profileSchema.methods.decrementFollowing = function(){
	if(this.followingNumber > 0) this.followingNumber = this.followingNumber - 1;
}

profileSchema.methods.addFollowers = function(userName, _id){

	var abstract = new userAbstract.Abstract({

		profileName: userName,
		userP_id: _id
	})

	this.followers.push(abstract);

	this.incrementFollowers();
}

profileSchema.methods.removeFollowers = function(userP_id){

	var newFollowers = [];
	var found = false;
	
	this.followers.forEach(abstract => {
		
		if (abstract.userP_id !=userP_id ){
			newFollowers.push(abstract);
		}
		else found = true;

		if(found){ 

			console.log("removido.")
			this.followers = newFollowers;
		}
	})

	this.decrementFollowers();
}

profileSchema.methods.removeFollowing = function(userProfile){

	userProfile.removeFollowers(this._id);
	var newFollowings = [];
	var found = false;

	this.following.forEach(abstract => {
		
		if (abstract.userP_id != userProfile._id){
			newFollowings.push(abstract);
		}
		else found = true;

		if(found){ 

			console.log("removido.")
			this.following = newFollowings;
		}
	})

	this.decrementFollowing();
}

profileSchema.methods.addFollowing = function(userProfile){

	var abstract = new userAbstract.Abstract({

		profileName: userProfile.userName,
		userP_id: userProfile._id
	})

	this.following.push(abstract);
	userProfile.addFollowers(this.userName, this._id);

	this.incrementFollowing();
}

var Profile = mongoose.model('Profile', profileSchema);

module.exports = {Profile, profileSchema}
