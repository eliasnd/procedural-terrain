import HeightMap from './HeightMap';

const gradientVectors = [
	[1, 1],
	[1, -1],
	[-1, 1],
	[-1, -1],
	[Math.SQRT2, 0],
	[0, Math.SQRT2],
	[-Math.SQRT2, 0],
	[0, -Math.SQRT2]
];

const GenerateVectors = (map, frequency) =>
{
	var vectors = {};



	for (let y = 0; y <= map.size; y += frequency)
		for (let x = 0; x <= map.size; x += frequency)
			vectors.push({[x, y] : gradientVectors[Math.random * gradientVectors.length]});
}

const PerlinNoise = (size, frequency) => 
{
	var map = new HeightMap(size);

	var vectors = {};

	for (let y = 0; y <= map.size; y += frequency)
		for (let x = 0; x <= map.size; x += frequency)
			vectors.push({[x, y] : gradientVectors[Math.random * gradientVectors.length]});

	for (let y = 0; y <= map.size; y += frequency)
		for (let x = 0; x <= map.size; x += frequency)
		{
			let xOffset = x % frequency;
			let yOffset = y % frequency;
			let unitX = x - xOffset;
			let unitY = y - yOffset;

			let distanceVectors = [
				[xOffset/frequency, yOffset/frequency],
				[xOffset/frequency, (frequency-yOffset)/frequency],
				[(frequency-xOffset)/frequency, yOffset/frequency],
				[(frequency-xOffset)/frequency, (frequency-yOffset)/frequency]
			];

			let gradientVectors = [
				vectors[[unitX, unitY]],
				vectors[[unitX, unitY + frequency]],
				vectors[[unitX + frequency, unitY]],
				vectors[[unitX + frequency, unitY + frequency]],
			];
		}
}

const PerlinNoiseMap = (size, scale, octaves, persistence, lacunarity) =>
{

}