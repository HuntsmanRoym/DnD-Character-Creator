mysql = require('mysql'),
    dbf = require('./gamemaster.dbf-setup.js');

var express=require('express'),
    app = express(),
    port = process.env.PORT || 1337;

app.use(express.static(__dirname + '/public'));
app.listen(port);

var race = '';
var charClass = '';
var subClass = '';

var DoQuery = function(sql)
{
    return dbf.query(mysql.format(sql));
};

app.get("/login", function(req, res)
{
    var uname = req.param('uname');
    var pword = req.param('pword');

    var sql = "SELECT * FROM dnd_users WHERE user = '" + uname + "' AND password = '" + pword + "';";
    var pResult = DoQuery(sql);

    var pResolve = Promise.resolve(pResult);
    pResolve.then(function(rows)
    {
        //If the result is not null we found a valid login
        if(!rows[0])
        {
            res.send(false);
        }
        else
        {
            res.send(true);
        }
    });
});

// create another request to update server variables of race and class
app.get("/changeRaceClass", function(req, res) {
    race = req.param('race');
    charClass = req.param('charClass');
    subClass = req.param('subClass');
});

app.get("/meta", function(req, res)
{
    var page = req.param('page');
    console.log("The page passed /meta in express.js is " + page);
    switch(page)
    {
        // Main Page?
        case "0":
            res.send("{}");
            break;
        // Race
        case "1":

            var user = req.param('opt1');

            var sql = "SELECT characterId, name, race, class, subclass FROM dnd_characters WHERE userId = (SELECT id FROM dnd_users WHERE user = " + user + ")";

            var sql = "SELECT * FROM dnd_races;";
            var pResult = DoQuery(sql);
            var pResolve = Promise.resolve(pResult);
            pResolve.then(function(rows)
            {
                charClass = rows.class;
               res.send(rows);
            });
            break;

        // Race Gender
        case "2":
            res.send("{}");
            break;

        // Class Subclass
        case "3":
            res.send("{}");
            break;

        // Ability Scores (Stats)
        case "4":
            res.send("{}");
            break;

        // Class Skills (Dependent on Class)
        case "5":
            //change hardcoded 2*100 and 3*100 to select max from dnd_charactors * 100 AND 2*10 to be select max from
            // dnd_charactors.class

            // subclass id sql = select subclass.id from dnd_charactors;
            // var subclassId = resolve this request and then move on....
            // if (var subclassId < 3) {

            var sql = "select * from dnd_powers where powerID < 2*100 + 2*10 and powerID >= 2*100 + 1*10;";
            // else {
            //      var sql = "select * from dnd_powers where powerID < 2*100 and powerID >= 2*100 + 1*10;";
            //}
            var pResult = DoQuery(sql);
            var pResolve = Promise.resolve(pResult);
            pResolve.then(function(rows)
            {
                res.send(rows);
                // console.log(rows);
            });
            console.log("Get Skills!!!!");
            break;

        // Feats (Dependent on Race)
        case "6":
            var sql = "SELECT * FROM dnd_proficiencies;";
            var pResult = DoQuery(sql);
            var pResolve = Promise.resolve(pResult);
            pResolve.then(function(rows)
            {
                res.send(rows);
                console.log(rows);
            });
            console.log("Got proficencies!");
            break;

        // Proficiencies
        case "7":
            console.log("Ayyy case 7 squad");
            var sql = "SELECT * FROM dnd_weapons";
            var result = DoQuery(sql);
            var resolve = Promise.resolve(result);
            resolve.then(function(rows)
            {
                console.log("here are the rows!!", rows);
                res.send(rows);
            });
            break;

        // Equipment
        case "8":
            res.send("{}");
            break;

        // Characteristics
        case "9":
            res.send("{}");
            break;

        // Personality
        case "10":

            res.send("{}");
            break;
    }

});