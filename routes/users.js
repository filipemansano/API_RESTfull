// Dependencies
var express 	= require('express');
var validator 	= require('validator');
var User 		= require('../models/user');

var router 		= express.Router();

router.route('/')

	.get(function(req, res, next){

		User.find(function(err, users) {
			if (err){
				res.status(500).json({ message: 'On error occured'});
				next();
			}

			res.status(200).json(users);
		});
	})

	.post(function(req, res, next){

		var user = new User();

		var fields = ['fullname', 'email', 'year'];

		for (var i = fields.length - 1; i >= 0; i--) {
			
			if(!req.body[fields[i]]){
				res.status(400).json({ message: 'field '+fields[i]+ ' is required'});
			}
			
			user[fields[i]] = (typeof req.body[fields[i]] == 'string') ? validator.trim(validator.escape(req.body[fields[i]])) : req.body[fields[i]];
		}

		// save the user and check the errors
		user.save(function(err) {
			if (err){
				res.status(500).json({ message: 'On error occured'});
				next();
			}

			res.status(200).json({ message: 'User created!', user: user });
		});
	});

router.route('/:user_id')
	
	.all(function(req, res, next){
		req.params.user_id = validator.escape(req.params.user_id);
		next();
	})

	.get(function(req, res, next){

		User.findById(req.params.user_id, function(err, user) {
			if (err){
				res.status(500).json({ message: 'On error occured'});
				next();
			}

			if(user){
				res.status(200).json(user);
			}else{
				res.status(404).json({ message: 'User not found'});
			}
			
		});
	})

	.delete(function(req, res, next){

		User.remove({
            _id: req.params.user_id
        }, function(err, bear) {
           if (err){
				res.status(500).json({ message: 'On error occured'});
				next();
			}

            res.status(200).json({ message: 'User deleted Successfully!' });
        });
	})

	.put(function(req, res, next){

		User.findById(req.params.user_id, function(err, user) {

			if (err){
				res.status(500).json({ message: 'On error occured'});
				next();
			}

			if(!req.body.fullname && !req.body.year && !req.body.email){
				res.status(304).json({ message: 'Not change detected'});
			}

			if(req.body.fullname){
				user.fullname = validator.trim(validator.escape(req.body.fullname));
			}

			if(req.body.email){
				user.email = validator.trim(validator.escape(req.body.email));
			}

			if(req.body.year){
				user.year = req.body.year;
			}

			user.save(function(err) {
				if (err){
					res.status(500).json({ message: 'On error occured'});
					next();
				}

				res.status(200).json({ message: 'User updated!' });
			});
		});
	});

// Return Router
module.exports = router;