var express = require('express');
var router = express.Router();
var bodyParser=require('body-parser');
var request=require('request');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var nodemailer = require('nodemailer');
var parseInt = require('parse-int');
const Nexmo = require('nexmo');
var async = require("async");

var mongoose = require('mongoose');


const nexmo = new Nexmo({
  apiKey: '..Key..',
  apiSecret: '..Key..'
});



var User = require('../models/user');


router.get('/join', function(req, res){
	
	console.log("I am here123");
	res.render('join');
});

router.get('/dashboard', function(req, res){
	
	console.log("I am here123");
	res.render('dashboard');
});

router.post('/dashboard', function(req, res){
	
	console.log("I am in post");
	
	var query=req.body.query;
	var params=req.body.entereddata;
	var result="Computed result: ";

	console.log(query+" "+params);
	
	
	var r1;

	
	
	function first()
	{
	
				
				if(query=="routecollection")
				{
							request('https://busoccupancy.herokuapp.com/farecollection/'+params, function (error, response, body) {
							if (!error && response.statusCode == 200) 
							{
							var o=JSON.parse(body);
							
							r1=result.concat(o[0].fare);
							console.log("result="+r1);
							res.status(200).send('<html><body><h3>'+r1+'</h3></body></html>');

							}
						});
					
				}
				else if(query=="buscollection")
				{
							request('https://busoccupancy.herokuapp.com/farecollectionbus/'+params, function (error, response, body) {
							if (!error && response.statusCode == 200) 
							{
							var o=JSON.parse(body);
							r1=result.concat(o[0].fare);
							console.log("result="+r1);

							res.status(200).send('<html><body><h3>'+r1+'</h3></body></html>');
							}
						});
					
				}
				else if(query=="conductor")
				{
							request('https://busoccupancy.herokuapp.com/workingtimeconductor/'+params, function (error, response, body) {
							if (!error && response.statusCode == 200) 
							{
							var o=JSON.parse(body);
							r1=result.concat(o[0].time).concat(" mins");
							console.log("result="+r1);

							res.status(200).send('<html><body><h3>'+r1+'</h3></body></html>');
							}
						});
					
				}
				else if(query=="driver")
				{
							request('https://busoccupancy.herokuapp.com/workingtimedriver/'+params, function (error, response, body) {
							if (!error && response.statusCode == 200) 
							{
							var o=JSON.parse(body);
							r1=result.concat(o[0].time).concat(" mins");;
							console.log("result="+r1);

							res.status(200).send('<html><body><h3>'+r1+'</h3></body></html>');
							}
						});
					
				}
				else if(query=="stops")
				{
							request('https://busoccupancy.herokuapp.com/mostusedbusstops/'+params, function (error, response, body) {
							if (!error && response.statusCode == 200) 
							{
							var o=JSON.parse(body);
							r1=result.concat("Maximum onboarding happens at "+o[0].source).concat("\n"+".   Maximum offboarding happens at "+o[0].destination);
							console.log("result="+r1);

							res.status(200).send('<html><body><h4>'+r1+'</h4></body></html>');
							}
						});
					
				}
				
				
	
	
	}
	
	first();
	
	
	
});





// initiatebus
router.get('/initiatebus', function(req, res){
	
	console.log("I am here123");
	res.render('initiatebus');
});

router.get('/conductor', function(req, res){
	
	console.log("I am here123");
	res.render('conductor');
});



router.get('/', function(req, res){
			res.render('initiatebus');
});


router.post('/initiatebus', function(req, res){
	
	console.log("I am here");
	var id = req.body.route;
	var direction = req.body.direction;
	var busno = req.body.busno;
	var starttime=req.body.start;
	var driverid=req.body.driver;
	var conductorid=req.body.conductor;

			
			request('http://busoccupancy.herokuapp.com/initiatebus/'+id+'/'+direction+'/'+starttime+'/'+busno+'/'+conductorid+'/'+driverid, function (error, response, body) {
				if (!error && response.statusCode == 200) 
				{
				var t=JSON.parse(body);
				console.log("----->"+body);
				
				}
			});
	
	res.redirect('/users/initiatebus');
});


router.post('/conductor', function(req, res){
	
	console.log("I am here in conductor");
	var id = req.body.busno;
	var starttime=req.body.start;
	var src=req.body.source;
	var dest=req.body.destination;
	var c1=req.body.adult;
	var c2=req.body.child;
	var c3=req.body.senior_citizen;
	var res1="";
	
	console.log("--->"+starttime.substr(0,starttime.indexOf(":"))+"--");
	console.log("-->"+starttime.substr(starttime.indexOf(":")+1,starttime.length -starttime.indexOf(":") -2 )+"--");
	
	
	var t1=(parseInt(starttime.substr(0,starttime.indexOf(":"))))*60;
	var t2=parseInt(starttime.substr(starttime.indexOf(":")+1,starttime.length -starttime.indexOf(":") -1 ));
	var t3=t1+t2;
	console.log("t3="+t3);
	
	if(typeof c1 != 'undefined')
	res1="adult";
	if(typeof c2 != 'undefined')
	res1="child";
	if(typeof c3 != 'undefined')
	res1="senior_citizen";
			
			request('https://busoccupancy.herokuapp.com/issueticket/'+id+'/'+t3+'/'+src+'/'+dest+'/'+res1, function (error, response, body) {
				if (!error && response.statusCode == 200) 
				{
				var t=JSON.parse(body);
				console.log("----->"+body);
				
				}
			});
	
	res.redirect('/users/conductor');
});


// Register
router.get('/resgister', function(req, res){
	res.render('register');
});

// Details
router.get('/details', function(req, res){
	res.render('details');
});














module.exports = router;