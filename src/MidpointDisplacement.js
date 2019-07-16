import HeightMap from './HeightMap';

/*
	Midpoint Displacement Algorithm

	Generates terrain by assigning each corner of a heightmap a random number between 0 and 1, then 
	sets the midpoint between each assigned value to the average of the endpoints plus or minus some random number
	within a spread value. Then multiplies the spread value by some decay factor and repeats on smaller squares until
	all values assigned.

	My original C# implementation did this recursively, but in hindsight I think an iterative implementation
	is more readable and has negligible time difference, although I haven't tested on map sizes larger than 2049.
*/

const Params = {
	spread: 0.5, //How far each midpoint can deviate from the average of its neighbors
	spreadDecay: 0.5 //How much the spread decays each iteration
}

const MidpointDisplacement = (size) => {
	var heightMap = new HeightMap(size);

	let spread = Params.spread;
	let spreadDecay = Params.spreadDecay;

	//Initialize corners to random numbers [0, 1)
	heightMap.set(0, 0, Math.random());
	heightMap.set(0, size-1, Math.random());
	heightMap.set(size-1, 0, Math.random());
	heightMap.set(size-1, size-1, Math.random());

	console.log("Corners are " + heightMap.get(0, 0) + ", " + heightMap.get(0, size-1) + ", " + heightMap.get(size-1, 0) + ", " + heightMap.get(size-1, size-1));

	var interval = size-1; //The interval between assigned points

	while (interval > 1)
	{
		let halfInterval = interval / 2;

		for (let y = 0; y < size-1; y += interval)
			for (let x = 0; x < size-1; x += interval)
			{
				let midX = x + halfInterval;
				let midY = y + halfInterval;

				if (heightMap.get(midX, y) == 0)
					heightMap.set(midX, y, ((heightMap.get(x, y) + heightMap.get(x+interval, y)) / 2) + (Math.random() * spread - spread/2));

				if (heightMap.get(midX, y+interval) == 0)
					heightMap.set(midX, y+interval, ((heightMap.get(x, y+interval) + heightMap.get(x + interval, y+interval)) / 2) + (Math.random() * spread - spread/2));

				if (heightMap.get(x, midY) == 0)
					heightMap.set(x, midY, ((heightMap.get(x, y) + heightMap.get(x, y+interval)) / 2) + (Math.random() * spread - spread/2));

				if (heightMap.get(x+interval, midY) == 0)
					heightMap.set(x+interval, midY, ((heightMap.get(x+interval, y) + heightMap.get(x+interval, y+interval)) / 2) + (Math.random() * spread - spread/2));

				if (heightMap.get(midX, midY) == 0)
					heightMap.set(midX, midY, (heightMap.get(midX, y) + heightMap.get(midX, y+interval) + heightMap.get(x, midY) + heightMap.get(x+interval, midY)) / 4 + (Math.random() * spread - spread/2));

			}

		spread *= spreadDecay;
		interval /= 2;
	}

	return heightMap;
}

export default MidpointDisplacement;