const profile = require('./ProfileModel');
const cache = require('../cache/Cache');
const userUtil = require('../util/user');
const time = require('../util/Constants').tenMinutes;
const OK = require('../util/Constants').OK_STATUS;
const notFound = require('../util/Constants').NOT_FOUND_STATUS;


exports.getProfile = function (req, res) {

    var userName = req.params.userName;
    var user_profile = cache.get(userName);

    if (user_profile)  res.json(user_profile);
    
    else{

        userUtil.getUserProfile(userName, function(erro, userProfile){

            if(erro)  return console.log(erro);
            
            else if(userProfile){

                cache.put(userName, userProfile, time);
                res.json(userProfile);
            }
            else  res.status(notFound).json("There is not a user with this username");
        })
    }
}

exports.getFollowing = function (req, res) {

        var userName = req.params.userName;
        var user_profile = cache.get(userName);

        if(user_profile){

            var names = user_profile.following.map(function(abstract){
                return abstract.profileName;
            })
            res.json(names);
        }
        else{

            userUtil.getUserProfile(userName, function(erro, userProfile){

                if(erro) return console.log(erro);
                
                else if(userProfile){
    
                    cache.put(userName, userProfile, time);
                  
                    var names = userProfile.following.map(function(abstract){
                        return abstract.profileName;
                    })
                    res.json(names);
                }
                else  res.status(notFound).json("There is not a user with this username");
            })
        }
}

exports.getFollowingUser = function (req, res) {

    var userName = req.params.userName;
    var name = req.params.name;
    var user_profile = cache.get(userName);

    if(user_profile){
    
        var user = user_profile.following.filter(function(abstract){
            return abstract.profileName == name;
        })
        if(user) res.json(user[0]);
        else res.status(notFound).json("There is not a user with this username");
    }
    else{
       
        userUtil.getUserProfile(userName, function(erro, userProfile){

            if(erro) return console.log(erro);

            else if(userProfile){

                cache.put(userName, userProfile, time);
                var user = userProfile.following.filter(function(abstract){
                    return abstract.profileName == name;
                })
                res.json(user[0]);
            }
            else res.status(notFound).json("There is not a user with this username");
        })
    }
}

exports.postFollowing = function (req, res) {

    var require = req.body;
    res.status(OK).json(require);
}