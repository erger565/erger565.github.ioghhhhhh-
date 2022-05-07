
const express = require('express');
const app = express();
const serv = require('http').Server(app);

app.use('/', express.static(__dirname + '/client/'));



serv.listen(2000);
console.log('Server started.');

const io = require('socket.io')(serv);

const fs = require('fs');

const map = JSON.parse(fs.readFileSync("map.json"));

const { Floor, Player, Bullet } = require('./classes.js');

const players = {};

const floors = [];


for (const f of map.data) floors.push(new Floor(f[0], f[1], f[2], f[3], f[4]));

io.on('connection', socket => {
	const id = socket.id;
	players[id] = new Player(0, 0, 1, 1);
	const p = players[id];
	socket.emit('id', socket.id);
	socket.emit('floors', floors);
	socket.on('move', data => {
		const x = Math.sin(data.angle) * data.speed;
		const y = Math.cos(data.angle) * data.speed;
		if (p.landed && data.jump) {
			p.sz ++;
			p.landed = false;
		}

		p.sx = x;
		p.sy = y;
	});

	socket.on('angle', a => {
		p.angle = a;
	});

	socket.on('shoot', a => {
    if (!p.ready) return;
		const b = new Bullet(p.x, p.y, p.z);
		p.bullets.push(b);

		b.sx = Math.sin(a) * 1;
		b.sy = Math.cos(a) * 1;
		b.sz = 0;
    p.ready = false;
    setTimeout(() => p.ready = true, 300);
	});

	socket.on('disconnect', () => {
		delete players[id];
	});
});
function update() {
	for (const i in players) {
		const p = players[i];

		p.x += p.sx;
		p.y += p.sy;
		p.z += p.sz;
    if(p.z < -40 &&  p.z <-20 && p.x < -160 && p.y < -160){
      p.sreSpawn();
      io.emit("oof");
    }
    if (p.x > -30 && p.y > -30) {
      if (p.z < -50 && p.score > -1 ) {
        p.firstreSpawn();
        io.emit("oof");
        console.log("score = 0, first respawn");
      }
    }
    if (p.x < -30 && p.y < -30 && p.x > -100 && p.y > -100) {
      if (p.z < -50 && p.score > -1) {
        p.sreSpawn();
        io.emit("oof");
        console.log("score = 0, first respawn");
      }
    }
    if (p.x < -40 && p.y > 80) {
      if (p.z < -50 && p.score > -1) {
        p.secondreSpawn();
        io.emit("oof");
        console.log("score = 0, first respawn");
      }
    }
    if (p.x < 170 && p.y < -30) {
      if (p.z < -50 && p.score > -1) {
        p.thirdreSpawn();
        io.emit("oof");
        console.log("score = 0, first respawn");
      }
    }
    if (p.x < 170 && p.y < -30) {
      if (p.z > 108 && p.z < 110 && p.score > -1) {
        p.fourthreSpawn();
        io.emit("oof");
        console.log("score = 0, first respawn");
      }
    }

    if (p.x > -30 && p.y > -30) {
      a()
      async function a() {
        await b()
        if (p.x > -30 && p.y > -30) {
          maap = (Math.floor(Math.random()*4))
          if (maap === 2) {
      

            a2()
            p.secondreSpawn();
          }
          if (maap === 1) {
          
            a1()
            p.sreSpawn();
          }
          if (maap === 3) {
          
            onepath = (Math.floor(Math.random()*2))
            a3()
            p.thirdreSpawn();
          }
        }
      }

      function b() {
          return new Promise(function(resolve, reject) {
              setTimeout(function() {
                  resolve();
              }, 20000)
          })
      }
      async function a1() {
        await b1()
        if (p.x < 30 && p.y < 30 && p.x > -100 && p.y > -100) {
          p.firstreSpawn();
          a()
        }
      }
      

      function b1() {
          return new Promise(function(resolve, reject) {
              setTimeout(function() {
                  resolve();
              }, 120000)
          })
      }
      async function a2() {
        await b2()
        if (p.x > -37 || p.x < -97 || p.y < 190 || p.y > 160) {
          p.firstreSpawn();
          a()
        }
      }
      

      function b2() {
          return new Promise(function(resolve, reject) {
              setTimeout(function() {
                  resolve();
              }, 40000)
          })
      }
      async function a3() {
        await b3()
        if (p.x < -40 || p.y > 90) {
          p.firstreSpawn();
          a()
        }
      }
      

      function b3() {
          return new Promise(function(resolve, reject) {
              setTimeout(function() {
                  resolve();
              }, 180000)
          })
      }

    }
    if (p.x < -30 && p.y < -30 && p.x > -100 && p.y > -100) {

    }
		let landed = false;
		for (const f of floors) {
			if (f.collide(p)) {
				landed = true;
				break;
			}
		}
		p.landed = landed;
		if (!p.landed) p.sz -= 0.05;
		else p.sz = 0;
		for (const i in p.bullets) {
			const b = p.bullets[i];
			b.x += b.sx;
			b.y += b.sy;
			if ((b.x < - 4|| b.x > 30 || b.y < 52 || b.y > 95) && (b.x > -47 || b.x < -80 || b.y > -47 || b.y < 100) && (b.x > -50 || b.x < -87 || b.y < 100 || b.y > 150))
				p.bullets.splice(i, 1);
      for (const i in players) {
        const target = players[i];
        if(p != target && b.collide(target)) {
          target.hp -= 20;
          p.bullets.splice(p.bullets.indexOf(b), 1);
          if (target.hp <= 0 && target.score === 0) {
            target.firstreSpawn();
            io.emit("oof");
            p.score++;

          }
          if(target.hp <= 0 && p.z < -50 && p.x > -30 && p.y > -30){
            target.sreSpawn();
            io.emit("oof");
          }
          if(target.hp <= 0 && p.x < -30 && p.y < -30 && p.x > -100 && p.y > -100){
            target.sreSpawn();
            io.emit("oof");
            p.score++;
          }
          if(target.hp <= 0 && p.x > -50 && p.x < -87 && p.y < 100 && p.y > 150> 80){
            target.secondreSpawn();
            io.emit("oof");
            p.score++;
          }
          break;
        }
      }
		}
	}
}


function send(){
  const pack = [];
	for (const i in players) {
		const p = players[i];
		const bullets = [];
		for (const b of p.bullets) bullets.push({ x: b.x, y: b.y, z: b.z, id: b.id });

		pack.push({
			x: p.x,
			y: p.y,
			z: p.z,
			id: i,
      hp: p.hp,
			angle: p.angle,
			bullets: bullets,
			score: p.score
		});
	}

	io.emit('players', pack);
}

setInterval(() => {
  update();
	send();
}, 1000 / 60);
