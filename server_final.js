var http = require('http');
var fs = require('fs');
var url = require('url');
var formidable = require("formidable");
var util = require('util');
var mysql = require('mysql');
var formdata = require('form-data');

var con = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'nodejs'
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

var server = http.createServer(function (req, res) {
    if (req.method.toLowerCase() == 'get') {
		
        /*var q = url.parse(req.url, true);
  		var filename = "." + q.pathname;
			fs.readFile(filename, function (err, data) {
				res.writeHead(200, {
					'Content-Type': 'text/html',
						'Content-Length': data.length
				});*/
	  var form = '<form action="" method="post" enctype="multipart/form-data">'+
				 '<fieldset>'+
					'<label for="name">Name:</label>'+
					'<input type="text" id="name" name="name"  />'+
					'<br />'+
					'<label for="email">Email:</label>'+
					'<input type="email" id="email" name="email"  />'+
					'<br />'+
					'<label for="description">Description:</label>'+
					'<textarea id="description" name="description" ></textarea>'+
					'<br />'+
					'<input type="submit" name="add" value="add" />'+
				 '</fieldset>'+
			  '</form>';
				res.write(form);
				res.end();
			//});
		
		//displayformedit(res);
    } else if (req.method.toLowerCase() == 'post') {
        processAllFieldsOfTheForm(req, res);
		//processFormFieldsIndividual(req, res);
    }

});

var server1 = http.createServer(function (req, res) {
    if (req.method.toLowerCase() == 'get') {
		selectAllFieldsOfTheForm(req, res);
		//updateAllFieldsOfTheForm(req, res);
	}
	else if (req.method.toLowerCase() == 'post') {
		updateAllFieldsOfTheForm(req, res);
	}
});

function processAllFieldsOfTheForm(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        //Store the data from the fields in your data store.
        //The data store could be a file or database or any other store based
        //on your application.
        res.writeHead(200, {'content-type': 'text/html'});
        res.write('received the data:<br>');
		//name.replace("'","");
         //res.end(util.inspect(fields));
		
		  var name = util.inspect(fields.name);
		  //console.log(util.isRegExp(/\'/g, ""));
		  //console.log(name.replace("'",""));
		  var name_1 = name.replace(/'/g, '');
		  
		  //res.write(name.replace("'",""));
		  //JSON.parse(name);	
		  var email = util.inspect(fields.email);
		  var email_1 = email.replace(/'/g, '');
		  var desc = util.inspect(fields.description);
		  var desc_1 = desc.replace(/'/g, '');
		  
		  if('input[type="submit"]' != null){
			  
		  var sql = "INSERT INTO demo_user (name, email, description) VALUES ?";
		  var values = [[name_1,email_1,desc_1]];
		 
		  
		  //name.replace("'","");
		  //name = name.replaceAll("'","");
		  
		  con.query(sql,[values], function (err, result) {
			if (err) throw err;
			//console.log("record inserted successfully");
			
			console.log("1 record inserted, ID: " + result.insertId);
		  }); 
		  }
		  //res.end();
		  
    		
			con.query("SELECT * FROM demo_user", function (err, result) {
				if (err) throw err;
				
				//res.end(util.inspect(result));
				res.write(
						'<table><tr><th>Id</th><th>Name</th><th>Email</th><th>Description</th><th>Action</th></tr>'
					);
				for (var i = 0; i < result.length; i++) {
					var row = result[i];
					//console.log(row.name);
					var s = row.id;
					res.write('<tr><td>'+row.id+'</td><td>'+row.name+'</td><td>'+row.email+'</td><td>'+row.description+'</td>'+
					'<td><a href="http://localhost:8081/?id='+row.id+'">Edit</a>');
					//console.log(util.inspect(row.name));
					
				}
					
					
					
				res.end();
			  });

});
	
}				  



server.listen(process.env.PORT || 8080);
console.log("server listening on 8080");

function selectAllFieldsOfTheForm(req, res) {
	var q = url.parse(req.url, true);
	//console.log(req.url);
	var qdata = q.query;
	//console.log(q.query);
	//console.log(qdata.id);
	con.query("SELECT * FROM demo_user WHERE id='"+qdata.id+"'", function (err, result) {
				if (err) throw err;
				//console.log(result[0].name);
				//console.log(result[0].email);
				//console.log(result[0].description);
				var name_1 = result[0].name;
				var email_1 = result[0].email;
				var desc_1 = result[0].description;
	var form = '<form action="?id='+qdata.id+'" method="post">'+
				 '<fieldset>'+
				 	'<label for="id">Id:</label>'+
					'<input type="text" id="id" name="id" value="'+qdata.id+'" readonly="readonly" />'+
					'<br />'+
					'<label for="name">Name:</label>'+
					'<input type="text" id="name" name="name" value="'+name_1+'"  />'+
					'<br />'+
					'<label for="email">Email:</label>'+
					'<input type="email" id="email" name="email" value="'+email_1+'"  />'+
					'<br />'+
					'<label for="description">Description:</label>'+
					'<textarea id="description" name="description" >'+desc_1+'</textarea>'+
					'<br />'+
					'<input type="submit" name="add" value="Update" />'+
				 '</fieldset>'+
			  '</form>';
				res.write(form);
				res.end();
				
				//var sql = "UPDATE demo_user SET name=";
				/*con.query(sql,function(err,result){
					
				});*/
	});
}
function updateAllFieldsOfTheForm(req, res){
	var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        //Store the data from the fields in your data store.
        //The data store could be a file or database or any other store based
        //on your application.
        res.writeHead(200, {'content-type': 'text/html'});
        res.write('updated data: <br>');
		//name.replace("'","");
         //res.end(util.inspect(fields));
		var id = util.inspect(fields.id);
		var id_1 = id.replace(/'/g, '');
		  var name = util.inspect(fields.name);
		  //console.log(util.isRegExp(/\'/g, ""));
		  //console.log(name.replace("'",""));
		  var name_1 = name.replace(/'/g, '');
		  
		  //res.write(name.replace("'",""));
		  //JSON.parse(name);	
		  var email = util.inspect(fields.email);
		  var email_1 = email.replace(/'/g, '');
		  var desc = util.inspect(fields.description);
		  var desc_1 = desc.replace(/'/g, '');
			  
		  var sql = "UPDATE demo_user SET name='"+name_1+"', email='"+email_1+"', description='"+desc_1+"' WHERE id='"+id_1+"'";
		  
		  //name.replace("'","");
		  //name = name.replaceAll("'","");
		  
		  con.query(sql, function (err, result) {
			if (err) throw err;
			//console.log("record inserted successfully");
			
			console.log("1 record upadated,id: '"+id_1+"'");
			res.end("1 record upadated,<br>id: '"+id_1+"'");
		  }); 
		  
	});
}
server1.listen(process.env.PORT || 8081);
console.log("server1 listening on 8081");