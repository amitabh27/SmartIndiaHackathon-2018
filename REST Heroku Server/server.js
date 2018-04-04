var express=require('express');
var app=express();
var async = require("async");
var bodyParser=require('body-parser');
var request=require('request');
var nodemailer = require('nodemailer');
var dateTime = require('node-datetime');
const Nexmo = require('nexmo');
var nodemailer = require('nodemailer');

const nexmo = new Nexmo({
  apiKey: '..Key..',
  apiSecret: '..Key..'
});


var err="No information available: Please check the details that you have provided";

app.use(bodyParser.json());
app.use(express.static(__dirname+'/public'));

var port = process.env.PORT || 5000;


var server=app.listen(process.env.PORT || 5000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });

app.get('/',function(req,res){
	return res.status(200).send("Welcome to SIH-2018 \"Bus Occupancy\" Server");
});


var city="bangalore";


app.get('/farecalculator/:sourcebusstop/:destinationbusstop',function(req,res){
	
	var source=req.params.sourcebusstop;
	var dest=req.params.destinationbusstop;
	var source_code="";
	var dest_code="";
	
	var result="";
	
	
		
	
				request('https://api.mlab.com/api/1/databases/busoccupancy/collections/Route_Details?q={"city": "'+city+'"}&apiKey=...Key....', function (error, response, body) {
				if (!error && response.statusCode == 200) 
				{
				var o=JSON.parse(body);
				console.log("----***>"+o[0].city);
				
						for(var i=0;i<o[0].code_name.length;i++)
						{
									if(o[0].code_name[i].name==source)
									source_code=o[0].code_name[i].code
									if(o[0].code_name[i].name==dest)
									dest_code=o[0].code_name[i].code;
							
						}
				
						
				
						for(var i=0;i<o[0].routes.length;i++)
						{

								var route_id = o[0].routes[i].route_id;
								var route_name = o[0].routes[i].route_name;
								var source_stage="";
								var dest_stage="";
								var f=0;
								
								
									for(var j=0;j<o[0].routes[i].stage_details.length;j++)
									{
										
										
										for(var k=0;k<o[0].routes[i].stage_details[j].bus_stops.length;k++)
										{
												
											if(o[0].routes[i].stage_details[j].bus_stops[k].code==source_code)
											{
											source_stage=o[0].routes[i].stage_details[j].stage_no;
											f=1;
											}
											else if(o[0].routes[i].stage_details[j].bus_stops[k].code==dest_code && f==1)
											{
											dest_stage=o[0].routes[i].stage_details[j].stage_no;
											f=2;
											break;	
											}
											
										}
										
									if(f==2)
									break;
							
									}
							if(f==2)
							{
								var a=parseInt(source_stage);
								var b=parseInt(dest_stage);
								var diff=b-a+1;
								
								var adult=o[0].routes[i].fare_matrix[diff].adult;
								var child=o[0].routes[i].fare_matrix[diff].child;
								var senior_citizen=o[0].routes[i].fare_matrix[diff].senior_citizen;
								
								result=result.concat("The fare via route ").concat(route_name).concat("(").concat(route_id).concat(") is Rs ").concat(adult).concat(",").concat(child).concat(",").concat(senior_citizen).concat(" for Adult,Child and Senior Citizen");
								
								
							}
									
						
						}

				res.status(200).send('{ \"data\":{\"type":\"text\",\"text\":\"'+result+'\"}}');
				}
			

				});


});


app.get('/incomingbuses/:sourcebusstop/:destinationbusstop',function(req,res){
	
	var source=req.params.sourcebusstop;
	var dest=req.params.destinationbusstop;
	var source_code="";
	var dest_code="";
	var route_id=[];var r=0;
	var start=[];var start1=[];var start2=[];var start3=[];var start4=[];
	var route_start_lat=[];
	var route_start_lon=[];
	
	var source_code_lat="";
	var source_code_lon="";
	var time_needed=[]; var tn=0;
	var seq=[];
	var dt = dateTime.create();
	var formatted = dt.format('Y-m-d H:M:S');
	console.log(formatted);
	
	var time=formatted.substr(formatted.indexOf(" ")+1,8);
	var hours=parseInt(time.substr(0,2));
	var minutes=parseInt(time.substr(3,2));
	var server_time=hours*60+minutes;

	
	var result="";
	
	
	function second()
	{
		
		async.each(seq, function(apiRequest, cb) {
					apicall(apiRequest, cb);
					
			}, function(err) {
				if(err)
				console.log("error...");
				else
				process_arrays();
				
			});
			
	
			function apicall(item, cb){
		
						request('https://maps.googleapis.com/maps/api/directions/json?origin='+route_start_lat[item]+','+route_start_lon[item]+'&destination='+source_code_lat+','+source_code_lon+'&mode=driving&key=...Key....', function (error, response, body) {
						if (!error && response.statusCode == 200) 
						{
						
							body = body.replace('\u003c/b','');	
							body = body.replace('\u003e/','');
							body = body.replace('\u003cb','');
							body = body.replace('\u003e','');body = body.replace('<b>','');body = body.replace('</b>','');
							body = body.replace('<div>','');
							body = body.replace('</div>','');
							var o=JSON.parse(body);
							
							var t1=o.routes[0].legs[0].duration.text;
												
												
												if(t1.indexOf("hours") != -1)
												{
													
													console.log("came here");
													var t2=t1.substr(0,t1.indexOf(' '));
													t2=(parseInt(t2))*60;
													
													console.log("hours-mins="+t2);
													
													t1=t1.substr(t1.indexOf('hours')+6);
													console.log("only mins="+t1);
													t1=t1.substr(0,t1.indexOf(' '));
													t1=parseInt(t1);
													t1=t1+t2;
													
													
													
												}
												else
												{
												t1=t1.substr(0,t1.indexOf(' '));
												t1=parseInt(t1);
												}
												
												console.log("final t1="+t1);
							
						time_needed[tn]=t1;
						tn++;
						cb();
						}
					
					
						else
																{
																console.log("error....");
																cb(error || new Error(response.statusCode));
																}
						});
	
			}
		
   
			function process_arrays()
			{
			

			result=result.concat("The buses at your service are:");
			var temp=0;
			
			for(var i=0; i<tn;i++)
			{
				var time="";
				for(var j=0;j<5;j++)
				{
					
					
					if(j==0)temp=parseInt(start[i])+time_needed[i];if(j==1)temp=parseInt(start1[i])+time_needed[i];if(j==2)temp=parseInt(start2[i])+time_needed[i];
					if(j==3)temp=parseInt(start3[i])+time_needed[i];if(j==4)temp=parseInt(start4[i])+time_needed[i];

					
					//if(temp>server_time)
					//{
						
					if(time!="")
					time=time.concat(",");	
						
					var t1=parseInt(temp/60);
					var t2=temp%60;
					
					time=time.concat(t1.toString()).concat(":").concat(t2.toString());
					//}
					
				}
				result=result.concat("Route-").concat(route_id[i]).concat(" reaching you at ").concat(time);
			}

			res.status(200).send('{ \"data\":{\"type":\"text\",\"text\":\"'+result+'\"}}');		
			}

				
	}
	
	function first(callback)
	{
		
	request('https://api.mlab.com/api/1/databases/busoccupancy/collections/Route_Details?q={"city": "'+city+'"}&apiKey=...Key....', function (error, response, body) {
				if (!error && response.statusCode == 200) 
				{
				var o=JSON.parse(body);
				console.log("----***>"+o[0].city);
				
					for(var i=0;i<o[0].code_name.length;i++)
						{
									if(o[0].code_name[i].name==source)
									source_code=o[0].code_name[i].code
									if(o[0].code_name[i].name==dest)
									dest_code=o[0].code_name[i].code;
							
						}
				
						
				
						for(var i=0;i<o[0].routes.length;i++)
						{

								var route_idd = o[0].routes[i].route_id;
								var route_name = o[0].routes[i].route_name;
								var source_stage="";
								var dest_stage="";
								var f=0;
								
								
									for(var j=0;j<o[0].routes[i].stage_details.length;j++)
									{
										
										
										for(var k=0;k<o[0].routes[i].stage_details[j].bus_stops.length;k++)
										{
												
											if(o[0].routes[i].stage_details[j].bus_stops[k].code==source_code)
											{
											source_stage=o[0].routes[i].stage_details[j].stage_no;
											source_code_lat=o[0].routes[i].stage_details[j].bus_stops[k].latitude;
											source_code_lon=o[0].routes[i].stage_details[j].bus_stops[k].longitude;
											
											
											f=1;
											}
											else if(o[0].routes[i].stage_details[j].bus_stops[k].code==dest_code && f==1)
											{
											dest_stage=o[0].routes[i].stage_details[j].stage_no;
											f=2;
											break;	
											}
											
										}
										
									if(f==2)
									break;
							
									}
							if(f==2)
							{
								route_id[r]=route_idd;
								
								
								
										
										start[r]=o[0].routes[i].start_time[0];
										start1[r]=o[0].routes[i].start_time[1];
										start2[r]=o[0].routes[i].start_time[2];
										start3[r]=o[0].routes[i].start_time[3];
										start4[r]=o[0].routes[i].start_time[4];
								
								
								
								
								route_start_lat[r]=o[0].routes[i].stage_details[0].bus_stops[0].latitude;
								route_start_lon[r]=o[0].routes[i].stage_details[0].bus_stops[0].longitude;
								
								
								console.log("SATISFIES-->"+route_id[r]+" "+route_start_lat[r]+" "+route_start_lon[r]);
								seq[r]=r;
								r++;
							}
									
						
						}	
				
						

				callback(second);
				}
			

				});
	
	}
	
	
	first(second);
});


app.get('/initiatebus/:busid/:direction/:time/:busno/:conductor/:driver',function(req,res){
	
	
	var busid=req.params.busid;
	var direction=req.params.direction;
	var time=req.params.time;
	var busno=req.params.busno;
	var conductor=req.params.conductor;
	var driver=req.params.driver;
	var c="bangalore";
	var result="";
	
	result=result.concat("{").concat("\"route_id\":\"").concat(busid).concat("\",").concat("\"direction\":\"").concat(direction).concat("\",").concat("\"start_time\":\"").concat(time).concat("\",").concat("\"bus_no\":\"").concat(busno).concat("\",");
	result=result.concat("\"conductor_id\":\"").concat(conductor).concat("\",").concat("\"driver_id\":\"").concat(driver).concat("\",").concat("\"fare_collected\":\"").concat("0").concat("\",").concat("\"seat_details\":").concat("[]").concat("}");
	
	console.log("==="+result);
	result=JSON.parse(result);
	
	request.put('https://api.mlab.com/api/1/databases/busoccupancy/collections/Bus_Details?q={"city": "'+c+'"}&apiKey=...Key....',
											{ json: { "$push": {"bus_details": result}
											} },
											function (error, response, body) {
												if (!error && response.statusCode == 200) {
													console.log("----->"+body);
												}
											
												else
												console.log("-----XXXXX>"+JSON.stringify(response));
											}
											);


	res.status(200).send("{\"status\":\"done\"}");										

});


app.get('/issueticket/:busid/:time/:src/:dest/:param',function(req,res){

	var category=req.params.param;
	var busid=req.params.busid;
	var time=req.params.time;
	var src=req.params.src;
	var dest=req.params.dest;
	var city="bangalore";
	var id="";
	var result="{";
	var fare="";
	var f=0;
	
	result=result.concat("\"city\":\"").concat(city).concat("\",").concat("\"bus_details\":[");
	
	
	
	
	function third()
	{
					request.delete('https://api.mlab.com/api/1/databases/busoccupancy/collections/Bus_Details/'+id+'?apiKey=...Key....',function (error, response, body) {
							if (!error && response.statusCode == 200)
							{
								
									console.log("deleted...");
											request.post('https://api.mlab.com/api/1/databases/busoccupancy/collections/Bus_Details?apiKey=...Key....',
											{ json: result },
											function (error, response, body) {
												if (!error && response.statusCode == 200) {
													console.log("----->"+body);
												}
											
												else
												console.log("-----XXXXX>"+error);
											}
											);
									
									
									
							res.status(200).send("[\"success\"]");		
							}
						});	
	
	}
	
	
	function second(callback)
	{
			
			request('https://api.mlab.com/api/1/databases/busoccupancy/collections/Bus_Details?q={"city": "'+city+'"}&apiKey=...Key....', function (error, response, body) {
				if (!error && response.statusCode == 200) 
				{
					if(f==0)
					{
					var o=JSON.parse(body);
					id=o[0]._id.$oid;
					
					for(var i=0;i<o[0].bus_details.length;i++)
					{
							
							if(i<(o[0].bus_details.length-1) && i!=0)
							result=result.concat(",");
							
							
							if(o[0].bus_details[i].bus_no==busid && o[0].bus_details[i].start_time==time)
							{
								
								var t=parseInt(o[0].bus_details[i].fare_collected);
								var t2=parseInt(fare);
								var t3=t+t2;
								var t4=t3.toString();
								
								
								result=result.concat("{").concat("\"route_id\":\"").concat(o[0].bus_details[i].route_id).concat("\",").concat("\"direction\":\"").concat(o[0].bus_details[i].direction).concat("\",").concat("\"start_time\":\"").concat(o[0].bus_details[i].start_time).concat("\",").concat("\"bus_no\":\"").concat(busid).concat("\",");
								result=result.concat("\"conductor_id\":\"").concat(o[0].bus_details[i].conductor_id).concat("\",").concat("\"driver_id\":\"").concat(o[0].bus_details[i].driver_id).concat("\",").concat("\"fare_collected\":\"").concat(t4).concat("\",").concat("\"seat_details\":").concat("[");
	
								
								for(var j=0;j<o[0].bus_details[i].seat_details.length;j++)
								{
									
										if(j!=0)
										result=result.concat(",");
									
										result=result.concat(JSON.stringify(o[0].bus_details[i].seat_details[j]));
								}
								result=result.concat(",");
								result=result.concat("{\"source\":\"").concat(src).concat("\",\"destination\":\"").concat(dest).concat("\"}");
								
								
								
								result=result.concat("]}");
							}
							else
							{
							result=result.concat( JSON.stringify(o[0].bus_details[i]));	
							}
							
					}

				result=result.concat("]}");
				console.log("result="+result+"****");
				result=JSON.parse(result);
				}
				f=1;
				callback(third);	
				}
			});



	}
	
	
	function first(callback)
	{
	
				request('https://busoccupancy.herokuapp.com/farecalculator/'+src+'/'+dest, function (error, response, body) {
				if (!error && response.statusCode == 200) 
				{
					var o=JSON.parse(body);
					var res=o.data.text;
					res=res.substr(res.indexOf("Rs")+3,res.indexOf("for") - (res.indexOf("Rs")+3) );
					
					if(category=="adult")
					fare=res.substr(0,res.indexOf(","));
					else if(category=="child")
					fare=res.substr(res.indexOf(",")+1,res.lastIndexOf(",") - (res.indexOf(",")+1) );
					else
					fare=res.substr(res.lastIndexOf(",")+1,res.length-res.lastIndexOf(",")-2);
					
				console.log("fare determined="+fare+"**");	
				callback(second);	
				}
				});
	
	
	}
	
	first(second);


});



app.get('/support/:content/:email',function(req,res){
	
	var content=req.params.content;
	var replyback=req.params.email;
	
	var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
			user: 'cabchain@gmail.com',
			pass: 'azxqsd@999'
			}
			});

			var mailOptions = {
			from: 'cabchain@gmail.com',
			to: 'cabchain@gmail.com',
			subject: 'Customer Query',
			html : 'The folowing query has been submitted : <br><br>\"'+content + '\". Please reply back to '+replyback+'. <br><br><br><br> *This is an auto-generated email.'
			};

			transporter.sendMail(mailOptions, function(error, info){
			if (error) {
			console.log(error);
			} else {
			console.log('Email sent: ' + info.response);
			}
			});
	
		res.status(200).send("[\"success\"]");
});



app.get('/needed_details/:src/:dest',function(req,res){
	
	var source=req.params.src;
	var dest=req.params.dest;
	var needed_route="";
	var needed_time="";
	var actual_time="";
	var names=[];
	var set=0;
	
	var source_code="";
	var dest_code="";
	var route_id=[];var r=0;
	var start=[];var start1=[];var start2=[];var start3=[];var start4=[];
	var route_start_lat=[];
	var route_start_lon=[];
	
	var source_code_lat="";
	var source_code_lon="";
	var time_needed=[]; var tn=0;
	var seq=[];
	var dt = dateTime.create();
	var formatted = dt.format('Y-m-d H:M:S');
	console.log(formatted);
	
	var time=formatted.substr(formatted.indexOf(" ")+1,8);
	var hours=parseInt(time.substr(0,2));
	var minutes=parseInt(time.substr(3,2));
	var server_time=hours*60+minutes;

	
	var result="";
	
	
	function second()
	{
		
		async.each(seq, function(apiRequest, cb) {
					apicall(apiRequest, cb);
					
			}, function(err) {
				if(err)
				console.log("error...");
				else
				process_arrays();
				
			});
			
	
			function apicall(item, cb){
		
						request('https://maps.googleapis.com/maps/api/directions/json?origin='+route_start_lat[item]+','+route_start_lon[item]+'&destination='+source_code_lat+','+source_code_lon+'&mode=driving&key=...Key....', function (error, response, body) {
						if (!error && response.statusCode == 200) 
						{
						
							body = body.replace('\u003c/b','');	
							body = body.replace('\u003e/','');
							body = body.replace('\u003cb','');
							body = body.replace('\u003e','');body = body.replace('<b>','');body = body.replace('</b>','');
							body = body.replace('<div>','');
							body = body.replace('</div>','');
							var o=JSON.parse(body);
							
							var t1=o.routes[0].legs[0].duration.text;
												
												
												if(t1.indexOf("hours") != -1)
												{
													
													console.log("came here");
													var t2=t1.substr(0,t1.indexOf(' '));
													t2=(parseInt(t2))*60;
													
													console.log("hours-mins="+t2);
													
													t1=t1.substr(t1.indexOf('hours')+6);
													console.log("only mins="+t1);
													t1=t1.substr(0,t1.indexOf(' '));
													t1=parseInt(t1);
													t1=t1+t2;
													
													
													
												}
												else
												{
												t1=t1.substr(0,t1.indexOf(' '));
												t1=parseInt(t1);
												}
												
												console.log("final t1="+t1);
							
						time_needed[tn]=t1;
						tn++;
						cb();
						}
					
					
						else
																{
																console.log("error....");
																cb(error || new Error(response.statusCode));
																}
						});
	
			}
		
   
			function process_arrays()
			{
			

			result=result.concat("The buses at your service are:");
			var temp=0;
			
			for(var i=0; i<tn;i++)
			{
				var time="";
				for(var j=0;j<5;j++)
				{
					
					
					if(j==0)temp=parseInt(start[i])+time_needed[i];if(j==1)temp=parseInt(start1[i])+time_needed[i];if(j==2)temp=parseInt(start2[i])+time_needed[i];
					if(j==3)temp=parseInt(start3[i])+time_needed[i];if(j==4)temp=parseInt(start4[i])+time_needed[i];

					
					//if(temp>server_time)
					//{
						
						
						
					if(time!="")
					time=time.concat(",");	
						
					var t1=parseInt(temp/60);
					var t2=temp%60;
					
					time=time.concat(t1.toString()).concat(":").concat(t2.toString());
					
					if(set==0)
					{
					set=1;
					needed_time=start[i].toString();
					actual_time=(t1.toString()).concat(":").concat(t2.toString());
					}
					
					
					//}
					
				}
				result=result.concat("Route-").concat(route_id[i]).concat(" reaching you at ").concat(time);
			}

			
			result="";
			result=result.concat(needed_route).concat(" ").concat(needed_time);
			
			res.status(200).send('{ \"data\":{\"type":\"text\",\"text\":\"'+result+'\"}}');		
			}

				
	}
	
	function first(callback)
	{
		
			request('https://api.mlab.com/api/1/databases/busoccupancy/collections/Route_Details?q={"city": "'+city+'"}&apiKey=...Key....', function (error, response, body) {
				if (!error && response.statusCode == 200) 
				{
				var o=JSON.parse(body);
				console.log("----***>"+o[0].city);
				
					for(var i=0;i<o[0].code_name.length;i++)
						{
									if(o[0].code_name[i].name==source)
									source_code=o[0].code_name[i].code
									if(o[0].code_name[i].name==dest)
									dest_code=o[0].code_name[i].code;
								
								
								names[i]=o[0].code_name.name;
							
						}
				
						
				
						for(var i=0;i<o[0].routes.length;i++)
						{

								var route_idd = o[0].routes[i].route_id;
								var route_name = o[0].routes[i].route_name;
								var source_stage="";
								var dest_stage="";
								var f=0;
								
								
									for(var j=0;j<o[0].routes[i].stage_details.length;j++)
									{
										
										
										for(var k=0;k<o[0].routes[i].stage_details[j].bus_stops.length;k++)
										{
												
											if(o[0].routes[i].stage_details[j].bus_stops[k].code==source_code)
											{
											source_stage=o[0].routes[i].stage_details[j].stage_no;
											source_code_lat=o[0].routes[i].stage_details[j].bus_stops[k].latitude;
											source_code_lon=o[0].routes[i].stage_details[j].bus_stops[k].longitude;
											
											
											f=1;
											}
											else if(o[0].routes[i].stage_details[j].bus_stops[k].code==dest_code && f==1)
											{
											dest_stage=o[0].routes[i].stage_details[j].stage_no;
											f=2;
											break;	
											}
											
										}
										
									if(f==2)
									break;
							
									}
							if(f==2)
							{
								route_id[r]=route_idd;
								needed_route=route_idd;
								
								
								
										
										start[r]=o[0].routes[i].start_time[0];
										start1[r]=o[0].routes[i].start_time[1];
										start2[r]=o[0].routes[i].start_time[2];
										start3[r]=o[0].routes[i].start_time[3];
										start4[r]=o[0].routes[i].start_time[4];
								
								
								
								
								route_start_lat[r]=o[0].routes[i].stage_details[0].bus_stops[0].latitude;
								route_start_lon[r]=o[0].routes[i].stage_details[0].bus_stops[0].longitude;
								
								
								console.log("SATISFIES-->"+route_id[r]+" "+route_start_lat[r]+" "+route_start_lon[r]);
								seq[r]=r;
								r++;
							}
									
						
						}	
				
						

				callback(second);
				}
			

				});
	
	}
	
	
	first(second);
	
	
	
	

	
	
	
	
	
		
	

	
});






app.get('/occupancy/:src/:dest',function(req,res){
	
	var src=req.params.src;
	var dest=req.params.dest;
	var needed_route="";
	var needed_time="";
	var names=[];
	var city="bangalore";
	var count=0;
	var standing=-1;
	var next_stop=0; var nx=0;
	var next_next_stop=0; var nxx=0;
	var result="";
	var fares="";
	var nodata=0;
	
	
	//ML
	var dt = dateTime.create();
	var formatted = dt.format('Y-m-d H:M:S');
	formatted=formatted.substr(0,formatted.indexOf(' '));
	console.log("Time="+formatted);
	var date=formatted;
	var timeslot=1;
	var stopid=0;
	
	
	
	function fourth()
	{
		
		request('https://vinayak777.pythonanywhere.com/busOccupacy?date='+date+'&time_slot='+timeslot+'&stop_id='+stopid, function (error, response, body) {
			if (!error && response.statusCode == 200)
			{
				console.log("---->"+body);
				var number=(parseInt(body)/60)*100;
				number=parseInt(100-number);
				console.log("---->"+number);
				
				if(nodata==1)
					result="No data available for the query issued";
				
				result=result.concat(" ## Predicted Availability : ").concat(number).concat(" %");
				
				res.status(200).send('{ \"data\":{\"type":\"text\",\"text\":\"'+result+'\"}}');
				
				
			}
			else
			console.log(error);

			});
		
	}
	
	
	function third(callback)
	{
		
		function getindex(str)
		{
		
			for(var i=0;i<names.length;i++)
			{
			
				if(names[i]==str)
					return i;
				
			}
		
		}
		
		
		request('https://api.mlab.com/api/1/databases/busoccupancy/collections/Bus_Details?q={"city": "'+city+'"}&apiKey=...Key....', function (error, response, body) {
				if (!error && response.statusCode == 200) 
				{
				var o=JSON.parse(body);
				console.log("----***>"+o[0].city);
				
						standing=getindex(src);
						stopid=standing;
						next_stop=standing+1;
						next_next_stop=standing+2;
						
						console.log("stops="+standing+" "+next_stop+" "+next_next_stop);
						
						for(var i=0;i<o[0].bus_details.length;i++)
						{
								if(o[0].bus_details[i].route_id==needed_route && o[0].bus_details[i].start_time==needed_time)
								{
										
										console.log("I got my bus");
										for(var j=0;j<o[0].bus_details[i].seat_details.length;j++)
										{
											if( getindex(o[0].bus_details[i].seat_details[j].source) < standing)
											count++;
											if( getindex(o[0].bus_details[i].seat_details[j].destination) <= standing )
											count--;
											if(getindex(o[0].bus_details[i].seat_details[j].destination) == next_stop)
											nx++;	
											if(getindex(o[0].bus_details[i].seat_details[j].destination) == next_next_stop)
											nxx++;
													
										}
									
	
	break;	
								}
							
						}
				
				
				result="The Current Seat Availability for the bus "+needed_route+" arriving at bus stop "+src+" is "+(60-count)+" seats. Number of passengers getting down at next couple of stops are "+nx+" and "+nxx+".";				
				result=result.concat(fares);
				
				/*if(nodata==1)
					result="No data available for the query issued";
				
				res.status(200).send('{ \"data\":{\"type":\"text\",\"text\":\"'+result+'\"}}');*/
				
				callback(fourth);

				}		
						
				});
		
		
	}
	
	
	function second(callback)
	{
	
				request('https://api.mlab.com/api/1/databases/busoccupancy/collections/Route_Details?q={"city": "'+city+'"}&apiKey=...Key....', function (error, response, body) {
				if (!error && response.statusCode == 200) 
				{
				var o=JSON.parse(body);
				console.log("----***>"+o[0].city);
				
					for(var i=0;i<o[0].code_name.length;i++)
						{
																
								names[i]=o[0].code_name[i].name;
							
						}
						
				//console.log("--->Names:"+names);		
				
				callback(third);
				}		
						
				});
	
	}
	
	
	function first(callback)
	{
		
	
		
				request('https://busoccupancy.herokuapp.com/needed_details/'+src+'/'+dest, function (error, response, body) {
							if (!error && response.statusCode == 200) 
							{
							var o=JSON.parse(body);
							var value=o.data.text;
							console.log("Needed----->"+o.data.text);
							
							if(value==" ")
							nodata=1;
							
							needed_route=value.substr(0,value.indexOf(' '));
							needed_time=value.substr(value.indexOf(' ')+1, value.length - (value.indexOf(' ')+1) );							
							console.log(needed_route+" "+needed_time);
							


							callback(second);
							}
						});
						
				
						
	}
	
	
	
	function initial(callback)
	{
		
										request('https://busoccupancy.herokuapp.com/farecalculator/'+src+'/'+dest, function (error, response, body) {
										if (!error && response.statusCode == 200) 
										{
										var o=JSON.parse(body);
										console.log("----->"+body);
										var value=o.data.text;
										value=value.toString();
										
										fares=value.substr(value.indexOf("Rs"),value.length-(value.indexOf("Rs")));
										console.log("****="+fares);
										var temp="The fares are as follows:";
										var f1=fares.substr(0,fares.lastIndexOf(","));
										fares=temp.concat(f1).concat(" Child and Senior Citizen");
										
										
										
									
										
										callback(first);
										}
										else
										console.log("error");
									});
		
	}
	
	
	
	initial(first);
	
	
});




app.get('/farecollectionbus/:busno',function(req,res){

	var busno = req.params.busno;
	var result=0;
	var city="bangalore";

	request('https://api.mlab.com/api/1/databases/busoccupancy/collections/Bus_Details?q={"city": "'+city+'"}&apiKey=...Key....', function (error, response, body) {
	if (!error && response.statusCode == 200)
	{
		var o = JSON.parse(body);
		console.log("-->"+o[0].city);

		for(var i=0;i<o[0].bus_details.length;i++)
		{
			if(o[0].bus_details[i].bus_no == busno)
					result = result + parseInt(o[0].bus_details[i].fare_collected);
		}
		console.log("*"+result);
		var t="[{\"fare\":\""+result+"\"}]";
		res.status(200).send(t);

	}
	
	});
});

app.get('/farecollection/:routeid',function(req,res){

	var routeid = req.params.routeid;
	var result=0;
	var city="bangalore";

	request('https://api.mlab.com/api/1/databases/busoccupancy/collections/Bus_Details?q={"city": "'+city+'"}&apiKey=...Key....', function (error, response, body) {
	if (!error && response.statusCode == 200)
	{
		var o = JSON.parse(body);
		console.log("-->"+o[0].city);

		for(var i=0;i<o[0].bus_details.length;i++)
		{
			if(o[0].bus_details[i].route_id == routeid)
					result = result + parseInt(o[0].bus_details[i].fare_collected);
		}
		console.log("*"+result);
		var t="[{\"fare\":\""+result+"\"}]";
		res.status(200).send(t);

	}
	
	});
});




app.get('/workingtimedriver/:empid',function(req,res){

	var empid = req.params.empid;
	var result=[];
	var count=0;
	var city="bangalore";
	var total=0;

	function first(callback)
	{
		request('https://api.mlab.com/api/1/databases/busoccupancy/collections/Bus_Details?q={"city": "'+city+'"}&apiKey=...Key....', function (error, response, body) {
			if (!error && response.statusCode == 200)
			{
				var o = JSON.parse(body);
				console.log("-->"+o[0].city);

				for(var i=0;i<o[0].bus_details.length;i++)
				{
					if(o[0].bus_details[i].driver_id == empid)
						result[count++] = o[0].bus_details[i].route_id;
				}
				callback(second);
			}
		});
	}

	function second()
	{
		request('https://api.mlab.com/api/1/databases/busoccupancy/collections/Route_Details?apiKey=...Key....', function (error, response, body) {
				if(!error && response.statusCode == 200)
				{
					var o = JSON.parse(body);

					for(var i=0;i<o[0].routes.length;i++)
					{
						for(var j=0;j<result.length;j++)
						{
							if(result[j] == o[0].routes[i].route_id)
								total = total + parseInt(o[0].routes[i].total_time);
						}
					}
					var t="[{\"time\":\""+total+"\"}]";
					res.status(200).send(t);
				}
			});
	}
	first(second);
});


app.get('/workingtimeconductor/:empid',function(req,res){

	var empid = req.params.empid;
	var result=[];
	var count=0;
	var city="bangalore";
	var total=0;

	function first(callback)
	{
		request('https://api.mlab.com/api/1/databases/busoccupancy/collections/Bus_Details?q={"city": "'+city+'"}&apiKey=...Key....', function (error, response, body) {
			if (!error && response.statusCode == 200)
			{
				var o = JSON.parse(body);
				console.log("-->"+o[0].city);

				for(var i=0;i<o[0].bus_details.length;i++)
				{
					if(o[0].bus_details[i].conductor_id == empid)
						result[count++] = o[0].bus_details[i].route_id;
				}
				//console.log("*"+result);
				//var t="[{\"fare\":\""+result+"\"}]";
				//res.status(200).send(t);
				callback(second);
			}
		});
	}

	function second()
	{
		request('https://api.mlab.com/api/1/databases/busoccupancy/collections/Route_Details?apiKey=...Key....', function (error, response, body) {
				if(!error && response.statusCode == 200)
				{
					var o = JSON.parse(body);

					for(var i=0;i<o[0].routes.length;i++)
					{
						for(var j=0;j<result.length;j++)
						{
							if(result[j] == o[0].routes[i].route_id)
								total = total + parseInt(o[0].routes[i].total_time);
						}
					}
					var t="[{\"time\":\""+total+"\"}]";
					res.status(200).send(t);
				}
			});
	}
	first(second);
});



app.get('/mostusedbusstops/:routeid',function(req,res){

	var city="bangalore";
	console.log("I am reachable");
	var str1 ="";
	var str2 = "";
	var max1 = 0;
	var max2 = 0;
	var ans1=[];
	var ans2=[];
	var names=[];
	var routeid = req.params.routeid;
  
        function getindex(str)
		{
		
			for(var i=0;i<names.length;i++)
			{
			
				if(names[i]==str)
					return i;
				
			}
		
		}

		function second()
		{
		request('https://api.mlab.com/api/1/databases/busoccupancy/collections/Bus_Details?q={"city": "'+city+'"}&apiKey=...Key....', function (error, response, body) {
			if (!error && response.statusCode == 200)
			{
				var o = JSON.parse(body);
				console.log("-->"+o[0].city);

				for(var i=0;i<o[0].bus_details.length;i++)
				{
					if(o[0].bus_details[i].route_id == routeid)
					{
						for(var j=0;j<o[0].bus_details[i].seat_details.length;j++)
						{
							var str1 = o[0].bus_details[i].seat_details[j].source;
							var str2 = o[0].bus_details[i].seat_details[j].destination;
							console.log(getindex(str1));
							console.log(getindex(str2));
							ans1[getindex(str1)] = ans1[getindex(str1)]+1;
							ans2[getindex(str2)] = ans2[getindex(str2)]+1;
						}
					}
				}
				console.log(ans1);
				console.log("***"+ans2);
				max1 = -1,max2=-1;
				for(var i=0;i<ans1.length;i++)
				{
					if(ans1[i] >= max1 && ans1[i] != 0)
					{
						if(str1 != "")
							str1=str1.concat(',');

						if(ans1[i] == max1)
						str1 =str1.concat(names[i]);
						else
						str1=names[i];
						console.log("str1="+str1);
						max1 = ans1[i];
					}

					if(ans2[i] >= max2 )
					{
						if(str2 != "")
							str2=str2.concat(',');
						if(ans2[i] == max2)
						str2 = str2.concat(names[i]);
						else
						str2=names[i];
						max2=ans2[i];
					}
				}
				var t="[{\"source\":\""+str1+"\",\"destination\":\""+str2+"\"}]";
					res.status(200).send(t);
			}
		});
	}

		function first(callback)
		{
			request('https://api.mlab.com/api/1/databases/busoccupancy/collections/Route_Details?q={"city": "'+city+'"}&apiKey=...Key....', function (error, response, body) {
			if (!error && response.statusCode == 200)
			{
				var o = JSON.parse(body);
				//console.log(body);
				for(var i=0;i<o[0].code_name.length;i++)
				{
					names[i] = o[0].code_name[i].name;
					ans1[i]=0;
					ans2[i]=0;
				}
				console.log(names);
				callback(second);
			}
			else
				console.log(error);

			});
		}
		first(second);
		
		
});





app.get('/mlapi/:date/:timeslot/:stopid',function(req,res){
	
	
	var date=req.params.date;
	var timeslot=req.params.timeslot;
	var stopid=req.params.stopid;
	
	
	
	
			request('https://vinayak777.pythonanywhere.com/busOccupacy?date='+date+'&time_slot='+timeslot+'&stop_id='+stopid, function (error, response, body) {
			if (!error && response.statusCode == 200)
			{
				console.log("---->"+body);
				var number=(parseInt(body)/60)*100;
				number=parseInt(100-number);
				console.log("---->"+number);
				res.status(200).send("[{\"status\":\""+number+"\"}]");
			}
			else
			console.log(error);

			});
	
	
	
	
	
});



app.get('/validatedetails/:name/:phone/:card/:cvv/:exp/:amt',function(req,res){
	
	
	var name=req.params.name;
	var phone=req.params.phone;
	var card=req.params.card;
	var cvv=req.params.cvv;
	var exp=req.params.exp;
	var amt=req.params.amt;
	
	var valid=0;
	
	
	
		function second()
		{
			if(valid==1)
			{
				
				var t=(Math.floor(100000 + Math.random() * 900000)).toString();
					nexmo.message.sendSms(
					'919820364381', '91'+phone, 'Hey '+name+', The OTP for Payment of amount Rs ' +amt+' is '+t,
							(err, responseData) => {
							if (err) {
							console.log(err);
							} else {
							console.dir(responseData);
							}
							}
					);
					
					request.put('https://api.mlab.com/api/1/databases/busoccupancy/collections/users?q={"phone": "'+phone+'"}&apiKey=...Key....',
						{ json: { "$set": {"otp": t}
						} },
						function (error, response, body) {
							if (!error && response.statusCode == 200) {
								console.log("----->Insertion"+body);
							}
							else
							{console.log(JSON.stringify(response));}
						});
						
					request.put('https://api.mlab.com/api/1/databases/busoccupancy/collections/users?q={"phone": "'+phone+'"}&apiKey=...Key....',
						{ json: { "$set": {"amount": amt}
						} },
						function (error, response, body) {
							if (!error && response.statusCode == 200) {
								console.log("----->Insertion"+body);
							}
							else
							{console.log(JSON.stringify(response));}
						});	
				
				
			res.status(200).send("[{\"status\":\"success\"}]");	
			}
			else
			res.status(200).send("[{\"status\":\"failure\"}]");
			
		}	
	
		function first(callback)
		{
			request('https://api.mlab.com/api/1/databases/busoccupancy/collections/users?q={"phone": "'+phone+'"}&apiKey=...Key....', function (error, response, body) {
				if (!error && response.statusCode == 200) 
				{
					
				var o = JSON.parse(body);
				console.log("--->"+name+" "+phone+" "+card+" "+cvv+" "+exp);
				
				if(o[0].name==name && o[0].phone==phone && o[0].cardno==card && o[0].cvv==cvv && o[0].expiry==exp)
				valid=1;
				
				callback(second);	
				}
			});
	
		}
		
		first(second);
	
	
});




app.get('/matchotp/:phone/:otp/:source/:dest',function(req,res){
	var phone = req.params.phone;
	var otp = req.params.otp;
	var source = req.params.source;
	var dest = req.params.dest;
	var city="bangalore";
	var busid="ka42 1302";
	var time="1140";
	
	
	function first()
	{
		request('https://api.mlab.com/api/1/databases/busoccupancy/collections/users?q={"phone": "'+phone+'"}&apiKey=...Key....', function (error, response, body) {
			if (!error && response.statusCode == 200)
			{
				var o = JSON.parse(body);
				console.log("-->"+body);
				
				if(o[0].otp == otp){
					
					console.log("matched");
					request('https://busoccupancy.herokuapp.com/issueticket/'+busid+'/'+time+'/'+source+'/'+dest+'/adult', function (error, response, body) {
							if (!error && response.statusCode == 200) 
							{
								console.log("success");
								res.status(200).send("[{\"status\":\"success\"}]");
							}
							else
							console.log("error..."+error);
						});
				}
				else
				{
						console.log("success");
								res.status(200).send("[{\"status\":\"failure\"}]");
				}
				
			}
			else
			console.log(error);
		
		});
	}
	
	
	first();
});




























