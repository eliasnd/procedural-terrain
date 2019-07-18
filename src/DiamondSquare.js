import HeightMap from './HeightMap';

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
	map.set(0, 0, Math.random());
	map.set(0, size-1, Math.random());
	map.set(size-1, 0, Math.random());
	map.set(size-1, size-1, Math.random());

	var interval = size-1;

	while (interval > 1)
	{
		let halfInterval = interval/2;

		for (let y = 0; y < size-1; y += interval) //Jump across heightmap by specified interval
			for (let x = 0; x < size-1; x += interval)
			{
				let midX = x + halfInterval;
				let midY = y + halfInterval;

				let avg = (map.get(x, y) + map.get(x, y + interval) + map.get(x + interval, y) + map.get(x + interval, y + interval)) / 4;

				map.set(midX, midY, avg + (Math.random() * spread - spread/2));
			}

		for (let y = 0; y < size-1; y += interval) //Jump across heightmap by specified interval
			for (let x = 0; x < size-1; x += interval)
			{
				let midX = x + halfInterval;
				let midY = y + halfInterval;

				if (map.get(x, midY) == 0)
					map.set(x, midY, AverageSurrounding(x, midY, halfInterval) + (Math.random() * spread - spread/2));
				if (map.get(x+interval, midY) == 0)
					map.set(x+interval, midY, AverageSurrounding(x+interval, midY, halfInterval) + (Math.random() * spread - spread/2));
				if (map.get(midX, y) == 0)
					map.set(midX, y, AverageSurrounding(midX, y, halfInterval) + (Math.random() * spread - spread/2));
				if (map.get(midX, y+interval) == 0)
					map.set(midX, y+interval, AverageSurrounding(midX, y+interval, halfInterval) + (Math.random() * spread - spread/2));
			}

		interval /= 2;
		spread *= spreadDecay;
	}

	return map;
}

export default DiamondSquare;