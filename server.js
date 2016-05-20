var express = require('express');
var app = express();
var fs = require("fs");
var sql = require('mssql');
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));

//skeleton object for account as expected by PC
var user =  {
  Account: {
    Id: "",
    Name: "",
    Number: "",
    EmailAddresses: {
      EmailAddress: [
        {
          EmailAddress: "",
          EmailType: 0
        }
      ]
    },
    PhoneNumbers: {
      PhoneNumber: [
        {
          Number: "",
          PhoneType: 0
        }
      ]
    },
    Addresses: {
      Address: [
        {
          City: "",
          Country: "",
          Line1: "",
          Line2: "",
          Line3: "",
          PostalCode: "",
          State: "",
          Type: "billing"
        }
      ]
    },
    CustomAttribute: ""
  }
};


app.post("/GetAccountByAccountNumber", function (req, res) {
      console.log("Entered GetAccountByAccountNumber POST routine");
      // Distilling AccountNumber from request body
      // We need bodyParser for this! if you don't include it, the request body will be empty.
      var response = req.body;
      var reqAccount = response.AccountNumber;

      // Starting SQL Account lookup using promises
      // Due to assync nature of calls
      reqSearchAccount(reqAccount)
        // only when this returns do we have a sqlUser object
        .then(function(sqlUser){

          // Build returnUser object using var user as a skeleton
          // user is the object as it is expected back by Purecloud
          // TODO in separate function??
          var returnUser = user;
          returnUser.Account.Number = sqlUser[0].AccountNumber;
          returnUser.Account.Id = sqlUser[0].AccountNumber;
          returnUser.Account.Name = sqlUser[0].Name;
          returnUser.Account.Addresses.Address[0].Line1 = sqlUser[0].StreetName + " " + sqlUser[0].StreetNumber;
          returnUser.Account.Addresses.Address[0].PostalCode = sqlUser[0].ZIP;
          returnUser.Account.Addresses.Address[0].City = sqlUser[0].City;
          returnUser.Account.PhoneNumbers.PhoneNumber[0].Number = sqlUser[0].Phone;
          returnUser.Account.EmailAddresses.EmailAddress[0].EmailAddress = sqlUser[0].Email;
          return returnUser;
        })
        .then(function(finalUser){
          //only when returnUser is built and returned can we send finalUser back
          res.send(finalUser);
          res.status(200);
        });
   });

//GET method mimics POST for debugging purposes in browser
//therefore many log entries...
// just discard or delete for own purposes
app.get("/GetAccountByAccountNumber", function (req, res) {
      console.log("\n\nEntered GetAccountByAccountNumber GET routine");
      // dummy and fixed Account value because we don't receive any info via POST method
      // remember: just for testing purposes, OK.
      var reqAccount = "112233";

      reqSearchAccount(reqAccount)
        .then(function(sqlUser){
          // Build user object
          // TODO in separate function?
          var returnUser = user;
          console.log("Debugging info");
          console.log("==============");
          console.log(returnUser);
          console.log("--------------");
          console.log(sqlUser[0].Name);
          returnUser.Account.Number = sqlUser[0].AccountNumber;
          returnUser.Account.Id = sqlUser[0].AccountNumber;
          returnUser.Account.Name = sqlUser[0].Name;
          returnUser.Account.Addresses.Address[0].Line1 = sqlUser[0].StreetName + " " + sqlUser[0].StreetNumber;
          returnUser.Account.Addresses.Address[0].PostalCode = sqlUser[0].ZIP;
          returnUser.Account.Addresses.Address[0].City = sqlUser[0].City;
          returnUser.Account.PhoneNumbers.PhoneNumber[0].Number = sqlUser[0].Phone;
          returnUser.Account.EmailAddresses.EmailAddress[0].EmailAddress = sqlUser[0].Email;
          console.log("Returning user");
          return returnUser;
        })
        .then(function(finalUser){
          console.log("Final user");
          console.log(finalUser);
          res.send(finalUser);
          res.status(200);
        });
    });

// Following routes are for potential future use
// please discard at this point
app.get('/addUser', function (req, res) {
   // First read existing users.
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       data = JSON.parse( data );
       data["user4"] = user["user4"];
       console.log( data );
       res.end( JSON.stringify(data));
   });
})

app.get('/listUsers', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       console.log( data );
       res.end( data );
   });
})

app.get('/:id', function (req, res) {
   // First read existing users.
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       users = JSON.parse( data );
       var user = users["user" + req.params.id]
       console.log( user );
       res.end( JSON.stringify(user));
   });
})

// here we're setting up the server to listen on port 8081
var server = app.listen(8081, function () {
  //var host = "localhost";
  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)
});

// config of the SQL connection. Make sure to fill in the password.
// If MSSQL is setup with the default instance name, server can be 'localhost'
// in this case it has a different name so we're using localhost\\instancename
var config = {
    user: 'sa',
    password: 'Admin01!',
    server: 'localhost\\PCENVMSSQL', // You can use 'localhost\\instance' to connect to named instance
    database: 'CRM',

}

function reqSearchAccount(account) {
  // using promise because we need successfull connection to sql first
  return sql.connect(config).then(function() {
    // building sql query
    var sqlQuery = 'select * from dbo.customers where AccountNumber=' + account;
    // returning result to previous eleming in promise chain
    return new sql.Request().query(sqlQuery).then(function(recordset) {
      // returning result to previous eleming in promise chain
      return recordset;
    }).catch(function(err) {
      // ... query error checks
      console.log("error 1 happened");
    });
  }).catch(function(err) {
    // ... query error checks
    console.log("error 2 happened");
  });
}
