import HeightMap from './HeightMap';

/*
	The diamond square algorithm works similarly to midpoint displacement but prioritizes the center of each square rather than the 
	midpoints
*/

const DiamondSquare = (size, spread, spreadDecay) => 
{
	var map = new HeightMap(size);

	const AverageSurrounding = (x, y, interval) =>
	{
		let heights = [];

		if (x > 0)
			heights.push(map.get(x - interval, y));
		if (x < size-1)
			heights.push(map.get(x + interval, y));
		if (y > 0)
			heights.push(map.get(x, y - interval));
		if (y < size-1)
			heights.push(map.get(x, y + interval));

		return heights.reduce((a, b) => a + b) / heights.length;
	}

	//Initialize corners to random numbers [0, 1)
	let startHeight = Math.random();
	map.set(0, 0, startHeight);
	map.set(0, size-1, startHeight);
	map.set(size-1, 0, startHeight);
	map.set(size-1, size-1, startHeight);

	var interval = size-1; //Start by moving in increments of the entire map

	while (interval > 1)
	{
		let halfInterval = interval/2;

		for (let y = 0; y < size-1; y += interval) //Jump across heightmap by specified interval
			for (let x = 0; x < size-1; x += interval)
			{
				let midX = x + halfInterval;
				let midY = y + halfInterval;

				let avg = (map.get(x, y) + map.get(x, y + interval) + map.get(x + interval, y) + map.get(x + interval, y + interval)) / 4; //Average of four corners

				map.set(midX, midY, avg + (Math.random() * spread - spread/2)); //Set middle of square to average plus or minus random value

				map.set(x, midY, (map.get(x, y) + map.get(x, y+interval)) / 2 + (Math.random() * spread - spread/2)); //Set midpoints similarly
				map.set(x+interval, midY, (map.get(x+interval, y) + map.get(x+interval, y+interval)) / 2 + (Math.random() * spread - spread/2));
				map.set(midX, y, (map.get(x, y) + map.get(x+interval, y)) / 2 + (Math.random() * spread - spread/2));
				map.set(midX, y+interval, (map.get(x, y+interval) + map.get(x+interval, y+interval)) / 2 + (Math.random() * spread - spread/2));
			}

		interval /= 2; 			//Repeat on smaller grid with less spread
		spread *= spreadDecay;
	}

	return map;
}

export default DiamondSquare;