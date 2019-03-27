(function () {
	Date.prototype.toSQL = Date_toYMD;

	function Date_toYMD() {
		var year, month, day, hour, minute, second;
		year = String(this.getFullYear());
		month = String(this.getMonth() + 1);
		if (month.length == 1) {
			month = "0" + month;
		}
		day = String(this.getDate());
		if (day.length == 1) {
			day = "0" + day;
		}
		hour = String(this.getHours());
		if (hour.length == 1) {
			hour = "0" + hour;
		}
		minute = String(this.getMinutes());
		if (minute.length == 1) {
			minute = "0" + minute;
		}
		second = String(this.getSeconds());
		if (second.length == 1) {
			second = "0" + second;
		}
		return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second + ".0";
	}
})();


function getSQLdate() {
	let date = new Date();
	date = date.toSQL();
	// date = date.getFullYear() + '-' +
	// 	('00' + (date.getMonth() + 1)).slice(-2) + '-' +
	// 	('00' + date.getDate()).slice(-2);
	return date;
}
var password = 'alio valio ir internetas';
// Public Key :  033c5db531f7c56b
// Private Key :  07d5a533b4f2098e

// c \equiv m^e \pmod{n} 
var crypto = require('crypto');
var CryptoJS = require("crypto-js");
var fs = require('fs');
var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
var session = require('express-session');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const si = require('systeminformation');
var soap = require('soap');


var Ddos = require('ddos')
var ddos = new Ddos({burst:10, limit:1000});
app.use(ddos.express)


//var admin;
//var connections = {};
server.listen(3000);
console.log("localhost:3000")
const hashRoundNumb = 10;
var allThemes = [];
fs.readdirSync("public/css/themes/").forEach(file => {
	if (file.split('.')[0] == "theme")
		allThemes.push(file.split('.')[1]);
});

app.use("/public", express.static(__dirname + "/public"));
//app.use(express.static(__dirname+ 'public'));
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie: {
		//secure: true,
		//maxAge: 3600000
	}
}));
//app.listen(3000);
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.get('/game', function (req, res) {
	res.render("game");
});

app.get('/', function (req, res) {
	//root
	//________________________demo

	//________________________
	if (req.session.user != undefined && req.session.hash != undefined) {
		bcrypt.compare(req.session.email, req.session.hash, function (err, answer) {
			if (answer) {
				// Passwords match
				var dataToSend = {
					buildings: {},
					userBuildings: [],
					options: [],
					themes: allThemes,
					username: req.session.user
				};
				//SELECT * FROM table WHERE DATE_FORMAT(field, '%m-%d') = DATE_FORMAT('2000-07-10', '%m-%d') AND id = "1"
				con.query("SELECT * FROM buildings").then(rows => {
					dataToSend.buildings = rows;
					return con.query("SELECT * FROM building_placed WHERE user_id = ?", [req.session.id_user]);
				}).catch(err => {}).then(rows => {
					dataToSend.userBuildings = rows;
					return con.query("SELECT * FROM options WHERE id_user = ?", [req.session.id_user]);
				}).catch(err => {}).then(rows => {
					dataToSend.subscription = rows;
					dataToSend.options = rows;
					req.session.language = rows[0].language;
					req.session.theme = rows[0].theme;
					res.render("app", {
						data: dataToSend
					});
					return 0;
				}).catch(err => {});
			} else {
				// Passwords don't match
				res.render("login");
			}
		});
	} else {
		res.render("login");
	}
});
app.get('/login', function (req, res) {
	res.render("login");
});
app.get('/signup', function (req, res) {
	res.render("signup");
});
app.get('/failed', function (req, res) {
	res.render("failed");
});
app.post('/', function (req, res) {
	res.render("login");
});
app.post('/signup', function (req, res) {
	res.render("signup", {
		auth: 0
	});
});
app.post('/signout', function (req, res) {
	req.session.destroy(function (err) {});
	res.redirect('/');
});
class Database {
	constructor(config) {
		this.connection = mysql.createConnection(config);
	}
	query(sql, args) {
		return new Promise((resolve, reject) => {
			this.connection.query(sql, args, (err, rows) => {
				if (err)
					return reject(err);
				resolve(rows);
			});
		});
	}
	close() {
		return new Promise((resolve, reject) => {
			this.connection.end(err => {
				if (err)
					return reject(err);
				resolve();
			});
		});
	}
}
var con = new Database({
	host: 'localhost',
	user: 'admin',
	password: 'admin',
	port: '3300',
	database: 'budgetdb',
	insecureAuth: true
});
app.post('/login', function (req, res) {
	//form input
	//___________________________________
	let username = req.body.email;
	let password = req.body.pass;
	let a = 0;
	con.query("SELECT * FROM users WHERE email = ?", [username]).then(rows => {
		if (rows != [] && rows.length != 0) {
			if (bcrypt.compareSync(password, rows[0].password)) {
				// Passwords match
				var hour = 3600000;
				req.session.cookie.expires = new Date(Date.now() + hour);
				req.session.cookie.maxAge = hour;
				req.session.hash = bcrypt.hashSync(username, hashRoundNumb);
				req.session.user = rows[0].username;
				req.session.email = rows[0].email;
				req.session.id_user = rows[0].id_user;
				res.redirect('/');
				return 0;
			} else {
				res.render("failed");
				return 0;
			}
		} else {
			res.render("failed");
			return 0;
		}
	}).catch(err => {
		console.log(err);
	});
});
app.post('/signupForm', function (req, res) {
	con.query("SELECT email FROM users WHERE email = ?", [req.body.email]).then(rows => {
		if (rows.length == 0) {
			return con.query("INSERT INTO users (username, password, email, date) VALUES(?,?,?,?)", [req.body.nickname, bcrypt.hashSync(req.body.register_password, hashRoundNumb), req.body.email, req.body.add_new_group, getSQLdate()]);
		} else {
			res.render("signup", {
				auth: 1
			});
			return 0;
		}
	}).catch(err => {}).then(rows => {
		return con.query("INSERT INTO options (id_user) VALUES(?)", [rows.insertId]);
	}).catch(err => {}).then(rows => {
		return res.redirect('/');
	}).catch(err => {});
});
app.post('/apply-options', function (req, res) {
	con.query("UPDATE options SET theme = ?, language = ?, color = ? WHERE id_user = ?", [req.body.option_theme, req.body.option_lan, req.body.new_color, req.session.id_user]).then(rows => {
		return 0;
	}).catch(err => {});
	res.redirect('/');
});
app.post('/update-account', function (req, res) {
	con.query("UPDATE users SET username = ? WHERE id_user = ?", [req.body.new_username, req.session.id_user]).then(rows => {
		req.session.user = req.body.new_username;
		return 0;
	}).catch(err => {});
	req.session.destroy(function (err) {});
	res.redirect('/');
});
app.post('/delete-account', function (req, res) {
	let user_id = req.session.id_user;
	req.session.destroy(function (err) {});

	con.query("DELETE FROM options WHERE id_user = ?", [user_id]).then(rows => {
		return con.query("DELETE FROM users WHERE id_user = ?", [user_id]);
	}).catch(err => {});
	res.redirect('/');
});
app.get('/monitor', function (req, res) {
	let user_id = req.session.id_user;
	if (user_id == 1) {
		res.render("monitor");
	} else {
		res.redirect('/');
	}
});
// app.post('/wsdl', function (req, res) {
// 	console.log("WAT")
// 	//var barcode = req.query.barcode || req.body.barcode;
// 	var wsdlUrl = 'http://www.searchupc.com/service/UPCSearch.asmx?wsdl';
// 	soap.createClient('localhost:3000/wsdl', function (err, soapClient) {
// 		// we now have a soapClient - we also need to make sure there's no `err` here. 
// 		if (err) {
// 			return res.status(500).json(err);
// 		}
// 		soapClient.GetProduct({
// 			upc: "",
// 			accesstoken: '924646BB-A268-4007-9D87-2CE3084B47BC'
// 		}, function (err, result) {
// 			if (err) {
// 				return res.status(500).json(err);
// 			}
// 			// now we have the response, but the webservice returns it as a CSV string. Let's use the parser
// 			var responseAsCsv = result.GetProductResult;
// 			csv.parse(responseAsCsv, {
// 				columns: true
// 			}, function (err, parsedResponse) {
// 				if (err) {
// 					return res.status(500).json(err);
// 				}
// 				// finally, we're ready to return this back to the client.
// 				return res.json(parsedResponse);
// 			});
// 		});

// 	});

// });

//___________BLOCKCHAIN PART_________


async function sendStatistics(admin) {
	if(admin != undefined){
		let data = {};
		try {
			data.cpu = await si.cpuCurrentspeed();
			data.load = (await si.currentLoad()).currentload;
			data.block = blockchain;
			data.backup = fs.readdirSync("backup");
			//data.network = await si.networkConnections();
			data.connections = [];
			var sockets = io.sockets.sockets;
			for(var socketId in sockets)
				data.connections.push({id:socketId, ip:sockets[socketId].request.connection.remoteAddress})
		} catch (e) {
			console.log(e)
		}
		admin.send(data);
		//setTimeout(sendStatistics, 2*1000);
	}
}

io.of('/monitor').on('connection', function(client){
	client.on('monitor-get', function (data) {
		// if(admin != client){
		// 	admin = client;
		// 	setTimeout(sendStatistics, 2*1000);
		// }
		sendStatistics(client)


	});
	client.on('backup-blockchain', (data) => {
		let date = new Date();
		let content = date.getTime().toString() + '\n' + CryptoJS.AES.encrypt(JSON.stringify(blockchain), password).toString();
		fs.writeFile("backup/"+date.getTime(), content, function(err) {
			if(err) {
					return console.log(err);
			}
		});
	});
	client.on('set-blockchain', (data) => {
		
		fs.readFile('backup/' + data.id, "utf8",  function(err, data) {
			let index = data.indexOf('\n')
			let date = data.slice(0, index - 1);
			let encoded = data.slice(index + 1);
			blockchain = JSON.parse(CryptoJS.AES.decrypt(encoded, password).toString(CryptoJS.enc.Utf8))
			io.emit('new-chain', blockchain);
		});
	});
	client.on('leave', function (data) {
		admin = undefined;
	});
    // client.on('my-message', function (data) {
    //     io.of('my-namespace').emit('my-message', data);
    //     // or socket.emit(...)
    //     console.log('broadcasting my-message', data);
    // });
});
io.on('connection', function (client) {
	console.log('Client connected...');

	client.on('join', function (data) {
		//connections[client.id] = {"id":client.id, "ip":"0.0.0"};
		client.emit('first-time', blockchain);
	});
	client.on('leave', function (data) {
		
		//connections[client.id] = undefined;
	});

	client.on('sendNewData', function (data) {
		if(data !== []){

			let block = generateNextBlock(data);
			if (addBlock(block)) {
				io.emit('new-chain', blockchain);
				//console.log(data);
			} else {
				
			}
		}

	});

});
class Block {
	constructor(index, previousHash, timestamp, data, hash) {
		this.index = index;
		this.previousHash = previousHash.toString();
		this.timestamp = timestamp;
		this.data = data;
		this.hash = hash.toString();
	}
}

var getGenesisBlock = () => {
	return new Block(0, "0", 1465154705, "genesis block", "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7");
};

var blockchain = [getGenesisBlock()];


var generateNextBlock = (blockData) => {
	var previousBlock = getLatestBlock();
	var nextIndex = previousBlock.index + 1;
	var nextTimestamp = new Date().getTime() / 1000;
	var nextHash = calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData);
	return new Block(nextIndex, previousBlock.hash, nextTimestamp, blockData, nextHash);
};


var calculateHashForBlock = (block) => {
	return calculateHash(block.index, block.previousHash, block.timestamp, block.data);
};

var calculateHash = (index, previousHash, timestamp, data) => {
	return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
};

var addBlock = (newBlock) => {
	if (isValidNewBlock(newBlock, getLatestBlock())) {
		blockchain.push(newBlock);
		return true;
	} else return false;
};

var isValidNewBlock = (newBlock, previousBlock) => {
	if (previousBlock.index + 1 !== newBlock.index) {
		console.log('invalid index');
		return false;
	} else if (previousBlock.hash !== newBlock.previousHash) {
		console.log('invalid previoushash');
		return false;
	} else if (calculateHashForBlock(newBlock) !== newBlock.hash) {
		console.log(typeof (newBlock.hash) + ' ' + typeof calculateHashForBlock(newBlock));
		console.log('invalid hash: ' + calculateHashForBlock(newBlock) + ' ' + newBlock.hash);
		return false;
	}
	return true;
};



var replaceChain = (newBlocks) => {
	if (isValidChain(newBlocks) && newBlocks.length > blockchain.length) {
		console.log('Received blockchain is valid. Replacing current blockchain with received blockchain');
		blockchain = newBlocks;
		broadcast(responseLatestMsg());
	} else {
		console.log('Received blockchain invalid');
	}
};

var isValidChain = (blockchainToValidate) => {
	if (JSON.stringify(blockchainToValidate[0]) !== JSON.stringify(getGenesisBlock())) {
		return false;
	}
	var tempBlocks = [blockchainToValidate[0]];
	for (var i = 1; i < blockchainToValidate.length; i++) {
		if (isValidNewBlock(blockchainToValidate[i], tempBlocks[i - 1])) {
			tempBlocks.push(blockchainToValidate[i]);
		} else {
			return false;
		}
	}
	return true;
};

var getLatestBlock = () => blockchain[blockchain.length - 1];