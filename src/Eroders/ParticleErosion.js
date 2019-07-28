import HeightMap from './../HeightMap';
import Vector2 from './../Vectors';
import * as THREE from 'three';

var lerp = (a, b, f) => { return a + f * (b - a); }										//Basic linear interpolation
var bilerp = (a, b, c, d, u, v) => { return lerp(lerp(a, b, u), lerp(c, d, u), v); }	//Bilinear interpolation

/*
	An implementation of the particle-based hydraulic erosion method introduced by Hans Theobald Beyer
	Link: https://www.firespark.de/resources/downloads/implementation%20of%20a%20methode%20for%20hydraulic%20erosion.pdf

	Simulates a number of droplets falling on the map and rolling around, eroding and depositing sediment.
	Each droplet moves one space each step, and updates its velocity, water, sediment, direction, position, and steps taken.
	Effects can be changed by modifying params; intending to move this to UI later.

	This particle-based model provides many advantages, including executing in O(1) time, as opposed to flow-based models which run in O(n^2) time.
*/

const params = {
	inertia: 0,			//How much previous direction affects direction change: 0 means only gradient matters, 1 means only previous direction
	gravity: -9.81,		//Gravity constant
	minSlope: 0.01,		//Minimum slope to ensure visible effects
	capacity: 8,		//Capacity coefficient for droplets
	maxSteps: 500,		//Maximum number of steps for a droplet
	evaporation: 0.02,	//Evaporation factor
	erosion: 0.7,		//Erosion factor
	deposition: 0.2,	//Deposition factor
	radius: 2			//Radius of erosion
}

const makeSphere = (x, y, z, color) =>
{
	const height = 4;
	const meshSize = 33;
	var sizeFactor = meshSize / 257;

	let geometry = new THREE.SphereGeometry(0.05, 32, 32);
	geometry.computeVertexNormals();
	let mat = new THREE.MeshLambertMaterial( {color: color} );
	let mesh = new THREE.Mesh(geometry, mat);

	mesh.position.set((x - 257/2) * sizeFactor, y * height - height/2, (z - 257/2) * sizeFactor);

	return mesh;
}

const lockDebug = undefined;

const ParticleErosion = (map, erosions, inertia, gravity, minSlope, capacity, maxSteps, evaporation, erosion, deposition, radius, callback) =>
{
	if (erosions > 10)
		var debug = lockDebug ? lockDebug : false;
	else
		var debug = lockDebug ? lockDebug : true;

	radius = parseInt(radius);

	const UpdateDirection = (drop) =>						//Updates direction based on previous direction and gradient
	{
		let gradient = map.grad(drop.pos.x, drop.pos.y);
		gradient = new Vector2(gradient[0], gradient[1]);

		let dir = new Vector2(drop.dir.x * inertia - gradient.x * (1-inertia), drop.dir.y * inertia - gradient.y * (1-inertia)); 	//Final direction is combination of gradient and previous dir

		if (dir.magnitude() == 0)							//If direction is 0, create random direction
			dir = new Vector2(Math.random(), Math.random());

		dir.normalize();									//Return direction with magnitude of 1 to guarantee moving one square each step

		return dir;
	}

	const Erode = (pos, amount) =>			//Erode amount from specified radius around position
	{
		let total = 0;

		let lowerY = Math.max(0, Math.ceil(pos.y - radius));						//Calculate bounds of erosion with radius
		let upperY = Math.min(map.size, Math.floor(pos.y + radius));
		let lowerX = Math.max(0, Math.ceil(pos.x - radius));
		let upperX = Math.min(map.size, Math.floor(pos.x + radius));

		for (let y = lowerY; y < upperY && y < map.size; y++)
			for (let x = lowerX; x < upperX && x < map.size; x++)
				total += radius - (new Vector2(pos.x - x, pos.y - y)).magnitude();		//Calculate total weights

		for (let y = lowerY; y < upperY; y++)
			for (let x = lowerX; x < upperX; x++)
			{
				let weight = (radius - new Vector2(pos.x - x, pos.y - y).magnitude()) / total;		//Get individual weight at pos and keep total at 1 by dividing
				map.change(x, y, -amount * weight);
			}

		if (debug)
			callback(makeSphere(pos.x, map.get(pos.x, pos.y), pos.y, 0xff0000));
	}

	const Deposit = (pos, amount) =>		//Deposit amount at four corners of coord
	{
		let xOffset = pos.x % 1.0;
		let yOffset = pos.y % 1.0;
		let x = Math.floor(pos.x);
		let y = Math.floor(pos.y);

		map.change(x, y, amount * (1-xOffset) * (1-yOffset));	//Use bilinear interpolation to drop amount accordingly
		map.change(x, y+1, amount * (1-xOffset) * yOffset);
		map.change(x+1, y, amount * xOffset * (1-yOffset));
		map.change(x+1, y+1, amount * xOffset * yOffset);

		if (debug)
			callback(makeSphere(pos.x, map.get(pos.x, pos.y), pos.y, 0x0000ff));
	}

	const MoveDrop = (drop) => 			//Moves the drop one step -- i.e. over one coordinate space
	{
		if (drop.steps > maxSteps || drop.water == 0)
			return false;

		if (debug)
			console.log(drop.steps + ": At " + drop.pos.x.toFixed(2) + ", " + drop.pos.y.toFixed(2) + ". Height is " + map.get(drop.pos.x, drop.pos.y));

		drop.dir = UpdateDirection(drop);

		let newPos = new Vector2(drop.pos.x + drop.dir.x, drop.pos.y + drop.dir.y);

		if (debug)
			console.log("		Newpos is " + newPos.x.toFixed(2) + ", " + newPos.y.toFixed(2));

		if (map.outOfBounds(newPos.x, newPos.y))// || (Math.floor(newPos.x) == Math.floor(drop.pos.x) && Math.floor(newPos.y) == Math.floor(drop.pos.y)))
			return false;

		let diff = map.get(newPos.x, newPos.y) - map.get(drop.pos.x, drop.pos.y);

		if (debug)
			console.log("		Diff is " + diff);

		if (diff > 0)
		{
			let amount = Math.min(drop.sediment, diff);
			if (debug)
				console.log("		Going uphill. Depositing " + amount);
			drop.sediment -= amount;
			Deposit(drop.pos, amount);
		}
		else
		{
			let dropCapacity = Math.max(-diff, minSlope) * drop.vel * drop.water * capacity;

			if (drop.sediment > dropCapacity)
			{
				let amount = (drop.sediment - dropCapacity) * deposition;
				if (debug)
					console.log("		Over capacity: " + drop.sediment.toFixed(5) + "/" + dropCapacity.toFixed(5) + ". Depositing " + amount.toFixed(5));
				drop.sediment -= amount;
				Deposit(drop.pos, amount);
			}
			else
			{
				let amount = Math.min((dropCapacity - drop.sediment) * erosion, -diff);
				if (debug)
					console.log("		Under capacity. Eroding " + amount.toFixed(5));
				drop.sediment += amount;
				Erode(drop.pos, amount)
			}
		}

		drop.vel = Math.sqrt(Math.max(Math.pow(drop.vel, 2) + diff * gravity, 0));

		if (debug)
			console.log("		Velocity is now " + drop.vel)

		if (drop.vel == 0)
			return false;

		drop.water = drop.water * (1-evaporation);
		drop.pos = newPos;
		drop.steps++;

		return true;
	}

	for (let i = 0; i < erosions; i++)
	{
		let drop = {
			pos: new Vector2(Math.random() * map.size, Math.random() * map.size),
			dir: new Vector2(0, 0),
			vel: 0,
			water: 1,
			sediment: 0,
			steps: 0
		}

		drop.dir = map.grad(drop.pos.x, drop.pos.y);
		drop.dir = new Vector2(-drop.dir[0], -drop.dir[1]);

		if (debug)
			callback(makeSphere(drop.pos.x, map.get(drop.pos.x, drop.pos.y), drop.pos.y, 0x00ff00));

		while (MoveDrop(drop))
		{ }
	}

	return map;
}

export default ParticleErosion;

