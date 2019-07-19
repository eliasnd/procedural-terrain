import HeightMap from './HeightMap';

const gradientVectors = [
	[1, 1],
	[1, -1],
	[-1, 1],
	[-1, -1],
	//[Math.SQRT2, 0],
	//[0, Math.SQRT2],
	//[-Math.SQRT2, 0],
	//[0, -Math.SQRT2]
];

const PerlinNoise = (size, frequency) => 
{
	var map = new HeightMap(size);

	var vectors = {};

	let adjustedSize = frequency * Math.ceil(map.size / frequency); //To get the blocks, we need a map that evenly divides by frequency

	//console.log("Checking, adjustedSize is " + adjustedSize + ", remainder is " + adjustedSize % frequency);

	for (let y = 0; y <= map.size; y += frequency)
		for (let x = 0; x <= map.size; x += frequency)
		{
			let index = Math.floor(Math.random() * gradientVectors.length);
			//console.log(gradientVectors[index]);
			vectors[[x, y]] = gradientVectors[index];
			//console.log(vectors[[x, y]])
		}

	for (let y = 0; y < map.size; y++)
		for (let x = 0; x < map.size; x++)
		{
			console.log("Point is " + x + ", " + y);
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

			if (x == 256)
				console.log(gradientVectors);

			//console.log(gradientVectors);

			let dotProducts = [
				distanceVectors[0][0] * gradientVectors[0][0] + distanceVectors[0][1] * gradientVectors[0][1],
				distanceVectors[1][0] * gradientVectors[1][0] + distanceVectors[1][1] * gradientVectors[1][1],
				distanceVectors[2][0] * gradientVectors[2][0] + distanceVectors[2][1] * gradientVectors[2][1],
				distanceVectors[3][0] * gradientVectors[3][0] + distanceVectors[3][1] * gradientVectors[3][1],
			];

			let value = (dotProducts[0] * (1 - xOffset) + dotProducts[1] * xOffset) * (1 - yOffset) + (dotProducts[2] * (1 - xOffset) + dotProducts[3] * xOffset) * yOffset;

			map.set(x, y, value);
		}

	return map;
}

export default PerlinNoise;

const PerlinNoiseMap = (size, scale, octaves, persistence, lacunarity) =>
{

}