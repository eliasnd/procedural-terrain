import HeightMap from './../HeightMap';
import Vector2 from './../Vectors';

var lerp = (a, b, f) => { return a + f * (b - a); }										//Basic linear interpolation
var bilerp = (a, b, c, d, u, v) => { return lerp(lerp(a, b, u), lerp(c, d, u), v); }	//Bilinear interpolation

/*
	An implementation of the particle-based hydraulic erosion method introduced by Hans Theobald Beyer
	Link: https://www.firespark.de/resources/downloads/implementation%20of%20a%20methode%20for%20hydraulic%20erosion.pdf

	Simulates a number of droplets falling on the map and rolling around, eroding and depositing sediment.
	Each droplet moves one space each step, and updates its velocity, water, sediment, direction, position, and steps taken.
	Effects can be changed by modifying params; intending to move this to UI later.
*/

const params = {
	inertia: 0,			//How much previous direction affects direction change: 0 means only gradient matters, 1 means only previous direction
	gravity: -9.81,		//Gravity constant
	minSlope: 0.01,		//Minimum slope to ensure visible effects
	capacity: 8,		//Capacity coefficient for droplets
	maxSteps: 64,		//Maximum number of steps for a droplet
	evaporation: 0.02,	//Evaporation factor
	erosion: 0.7,		//Erosion factor
	deposition: 0.2,	//Deposition factor
	radius: 2			//Radius of erosion
}

const ParticleErosion = (map, erosions) =>
{
	const UpdateDirection = (drop) =>						//Updates direction based on previous direction and gradient
	{
		let inertia = params.inertia;
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

		let lowerY = Math.max(0, Math.ceil(pos.y - params.radius));						//Calculate bounds of erosion with radius
		let upperY = Math.min(map.size, Math.floor(pos.y + params.radius));
		let lowerX = Math.max(0, Math.ceil(pos.x - params.radius));
		let upperX = Math.min(map.size, Math.floor(pos.x + params.radius));

		for (let y = lowerY; y < upperY && y < map.size; y++)
			for (let x = lowerX; x < upperX && x < map.size; x++)
				total += params.radius - new Vector2(pos.x - x, pos.y - y).magnitude();		//Calculate total weights

		for (let y = lowerY; y < upperY; y++)
			for (let x = lowerX; x < upperX; x++)
			{
				let weight = (params.radius - new Vector2(pos.x - x, pos.y - y).magnitude()) / total;		//Get individual weight at pos and keep total at 1 by dividing
				map.change(x, y, -amount * weight);
			}
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
	}

	const MoveDrop = (drop) => 			//Moves the drop one step -- i.e. over one coordinate space
	{
		if (drop.steps > params.maxSteps)
			return false;

		drop.dir = UpdateDirection(drop);

		let newPos = new Vector2(drop.pos.x + drop.dir.x, drop.pos.y + drop.dir.y);

		if (map.outOfBounds(newPos.x, newPos.y) || (Math.floor(newPos.x) == Math.floor(drop.pos.x) && Math.floor(newPos.y) == Math.floor(drop.pos.y)))
			return false;

		let diff = map.get(newPos.x, newPos.y) - map.get(drop.pos.x, drop.pos.y);

		if (diff > 0)
		{
			let amount = Math.min(drop.sediment, diff);
			drop.sediment -= amount;
			Deposit(drop.pos, amount);
		}
		else
		{
			let dropCapacity = Math.max(-diff, params.minSlope) * drop.vel * drop.water * params.capacity;

			if (drop.sediment > dropCapacity)
			{
				let amount = (drop.sediment - dropCapacity) * params.deposition;
				drop.sediment -= amount;
				Deposit(drop.pos, amount);
			}
			else
			{
				let amount = Math.min((dropCapacity - drop.sediment) * params.erosion, -diff);
				drop.sediment += amount;
				Erode(drop.pos, amount)
			}
		}

		drop.vel = Math.sqrt(Math.max(Math.pow(drop.vel, 2) + diff * params.gravity, 0));

		if (drop.vel == 0)
			return false;

		drop.water = drop.water * (1-params.evaporation);
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

		while (MoveDrop(drop))
		{ }
	}

	return map;
}

export default ParticleErosion;

