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

const ParticleErosion = (map, erosions, inertia, gravity, minSlope, capacity, maxSteps, evaporation, erosion, deposition, radius, callback) =>
{
	radius = parseInt(radius);

	for (let d = 0; d < erosions; d++)
	{
		let pos = [Math.random() * map.size, Math.random() * map.size];
		let	dir = [0, 0];
		let vel = 0;
		let water = 1;
		let sediment = 0;

		for (let s = 0; s < maxSteps; s++)
		{
			let x = Math.floor(pos[0]);
			let y = Math.floor(pos[1]);
			let u = pos[0] % 1.0;
			let v = pos[1] % 1.0;

			let currHeight = map.get(pos[0], pos[1]);
			let gradient = map.grad(pos[0], pos[1]);

			dir = [dir[0] * inertia - gradient[0] * (1-inertia), dir[1] * inertia - gradient[1] * (1-inertia)];
			let dirLength = Math.sqrt(dir[0] * dir[0] + dir[1] * dir[1]);

			if (dirLength == 0)
			{
				dir = [Math.random(), Math.random()];
				dirLength = Math.sqrt(dir[0] * dir[0] + dir[1] * dir[1]);
			}

			dir[0] /= dirLength;
			dir[1] /= dirLength;

			let newPos = [pos[0] + dir[0], pos[1] + dir[1]];

			if (map.outOfBounds(newPos[0], newPos[1]))
				break;

			let diff = map.get(newPos[0], newPos[1]) - map.get(pos[0], pos[1]);

			let sedimentCapacity = Math.max(-diff, minSlope) * vel * water * capacity;

			if (diff > 0 || sediment > sedimentCapacity)
			{
				let amount = diff > 0 ? Math.min(sediment, diff) : (sediment - sedimentCapacity) * deposition;


				map.change(x, y, amount * (1-u) * (1-v));
				map.change(x+1, y, amount * u * (1-v));
				map.change(x, y+1, amount * (1-u) * v);
				map.change(x+1, y+1, amount * u * v);

				sediment -= amount;
			}
			else
			{
				let amount = Math.min((sedimentCapacity - sediment) * erosion, -diff);

				let total = 0;

				for (let ry = Math.max(0, Math.ceil(y-radius)); ry < Math.min(map.size-1, Math.floor(y+radius)); ry++)
					for (let rx = Math.max(0, Math.ceil(x-radius)); rx < Math.min(map.size-1, Math.floor(x+radius)); rx++)
					{
						let dist = Math.sqrt(Math.pow(pos[0] - rx, 2) + Math.pow(pos[1] - ry, 2));
						if (dist <= radius)
							total += radius - dist;
					}

				for (let ry = Math.max(0, Math.ceil(y-radius)); ry < Math.min(map.size-1, Math.floor(y+radius)); ry++)
					for (let rx = Math.max(0, Math.ceil(x-radius)); rx < Math.min(map.size-1, Math.floor(x+radius)); rx++)
					{
						let dist = Math.sqrt(Math.pow(pos[0] - rx, 2) + Math.pow(pos[1] - ry, 2));
						if (dist <= radius)
							map.change(rx, ry, -amount * (radius - dist) / total);
					}

				sediment += amount;
			}

			vel = Math.sqrt(Math.max(Math.pow(vel, 2) + diff * gravity, 0));

			if (vel == 0)
				break;

			water = water * (1-evaporation);
			pos = newPos;
		}
	}
}

export default ParticleErosion;

