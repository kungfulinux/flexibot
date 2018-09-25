var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		console.log("Connected correctly to server");
		if (err) throw err;
	        var dbo = db.db("flexibot");
		var cursor = dbo.collection('urls').find();
		cursor.each(function(err, results) {
					console.log(results);
			        });
	        db.close();
});
