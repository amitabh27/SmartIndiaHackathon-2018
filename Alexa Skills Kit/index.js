
'use strict';

const Alexa = require('alexa-sdk');

var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var request=require('request');

var err="No information available: Please check the details that you have provided";

app.use(bodyParser.json());
app.use(express.static(__dirname+'/public'));

const APP_ID = undefined;  

const languageStrings = {
    'en': {
        translation: {
            FACTS: [
                'something',
            ],
            SKILL_NAME: 'something',
            GET_FACT_MESSAGE: "Here's your dummy ",
            HELP_MESSAGE: 'help..',
            HELP_REPROMPT: 'What',
            STOP_MESSAGE: 'bye',
        },
    },
    'en-US': {
        translation: {
            FACTS: [
                'A year on Mercury is just 88 days long.',
            ],
            SKILL_NAME: 'something Facts',
        },
    },
    'en-GB': {
        translation: {
            FACTS: [
                'A year on Mercury is just 88 days long.',
            ],
            SKILL_NAME: 'something Facts',
        },
    },
    'de': {
        translation: {
            FACTS: [
                'simple fact....',
            ],
            SKILL_NAME: 'something',
            GET_FACT_MESSAGE: 'message... ',
            HELP_MESSAGE: 'description...',
            HELP_REPROMPT: 'hep....',
            STOP_MESSAGE: 'bye...',
        },
    },
};



const first = (source, destination,callback) => {
        request('https://busoccupancy.herokuapp.com/farecalculator/'+source+'/'+destination, function (error, response, body) {
			if (!error && response.statusCode == 200) 
			{
				console.log(body);
				var o=JSON.parse(body);
				var res=o.data.text;
				callback(null, res);
		
			}
		});
};


const second = (source, destination,callback) => {
        request('https://busoccupancy.herokuapp.com/incomingbuses/'+source+'/'+destination, function (error, response, body) {
			if (!error && response.statusCode == 200) 
			{
				console.log(body);
				var o=JSON.parse(body);
				var res=o.data.text;
				callback(null, res);
		
			}
		});
};

const third = (source, destination,callback) => {
        request('https://busoccupancy.herokuapp.com/occupancy/'+source+'/'+destination, function (error, response, body) {
			if (!error && response.statusCode == 200) 
			{
				console.log(body);
				var o=JSON.parse(body);
				var res=o.data.text;
				callback(null, res);
		
			}
		});
};




const handlers = {

    'farecalculator': function(){
       
		var source=this.event.request.intent.slots.source.value;
		var destination=this.event.request.intent.slots.dest.value;
		
		source=source.toLowerCase();
		destination=destination.toLowerCase();
		
		first(source, destination, (err, res) => {
			this.emit(':tell', res);
		});
    },
	
	'incomingbuses': function(){
		var source=this.event.request.intent.slots.source.value;
		var destination=this.event.request.intent.slots.dest.value;
		
		source=source.toLowerCase();
		destination=destination.toLowerCase();
		
		second(source, destination,(err, res) => {
			this.emit(':tell', res);
		});
    },
		'occupancy': function(){
		var source=this.event.request.intent.slots.source.value;
		var destination=this.event.request.intent.slots.dest.value;
		
		source=source.toLowerCase();
		destination=destination.toLowerCase();
		
		third(source, destination,(err, res) => {
			this.emit(':tell', res);
		});
    },
	
	

    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};