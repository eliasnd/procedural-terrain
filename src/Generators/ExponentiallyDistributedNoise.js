import HeightMap from './../HeightMap';

/*
	Exponentially Distributed Noise

	Exponentially Distributed Noise is a variation on Perlin Noise introduced by Ian Parberry in 2014.
	It generates exponentially distributed noise, meaning the resulting terrain has some distinctive
	landmarks and smaller gradients elsewhere, as opposed to Perlin Noise, where steep gradients are
	everywhere.

	Link: http://jcgt.org/published/0004/02/01/
*/

//Pseudorandom gradients
const p = [
	151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7,
	225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247,
	120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
	88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134,
	139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220,
	105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80,
	73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86,
	164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38,
	147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189,
	28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101,
	155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232,
	178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12,
	191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181,
	199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236,
	205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180, 	
	151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7,
	225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247,
	120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
	88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134,
	139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220,
	105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80,
	73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86,
	164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38,
	147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189,
	28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101,
	155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232,
	178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12,
	191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181,
	199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236,
	205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180, 		//Permutation table for pseudorandom gradient vectors
];

const m = [];

const dec = 1.07;

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

var lerp = (a, b, f) => { return a + f * (b - a); }				//Basic linear interpolation
var inverseLerp = (a, b, l) => { return (l - a) / (b - a); }	//Inverse linear interpolation

const init = () => 
{
	let mu = 1;

	for (let i = 0; i < 256; i++)
		m.push(mu /= dec);
}

const noise = (x, y) =>
{
	var fade = (num) => { return 6 * Math.pow(num, 5) - 15 * Math.pow(num, 4) + 10 * Math.pow(num, 3); } //Fade function to get smooth curve on [0, 1]

	var grad = (hash, x, y) => 					//Gradient function that calculates dot product
	{
		let grad = gradientVectors[hash & 3];	//Gets one of the four gradient vectors; change to hash & 7 if using SQRT2 gradients
		return x * grad[0] + y * grad[1];		//Dot product of distance vector [x, y] and gradient vector
	}

	var unitX = Math.floor(x) & 255;	//x and y as ints and in range [0, 255]
	var unitY = Math.floor(y) & 255;

	var xOffset = x - Math.floor(x);	//Fractional components of x and y
	var yOffset = y - Math.floor(y);

	var hashes = [			//Hash values to get pseudorandom gradients:
		p[p[unitX] + unitY],	//	By hashing unitX term, adding unitY term, and hashing again, gradients
		p[p[unitX+1] + unitY],	//	are replicable but seemingly random.
		p[p[unitX] + unitY+1],
		p[p[unitX+1] + unitY+1]
	];

	var dotProducts = [								//Runs grad function on respective gradient vectors and four corners
		m[hashes[0]] * grad(hashes[0], xOffset, yOffset),		//of unit cube
		m[hashes[1]] * grad(hashes[1], xOffset-1, yOffset),
		m[hashes[2]] * grad(hashes[2], xOffset, yOffset-1),
		m[hashes[3]] * grad(hashes[3], xOffset-1, yOffset-1)
	];

	let fadedxOffset = fade(xOffset);	//Fades the offsets to get smoother transitions in following step
	let fadedyOffset = fade(yOffset);

	let top = lerp(dotProducts[0], dotProducts[1], fadedxOffset); //Bilinear interpolation with four dot products
	let bottom = lerp(dotProducts[2], dotProducts[3], fadedxOffset);;
	let value = lerp(top, bottom, fadedyOffset);

	value = (value + 1) / 2; //Bind to [0, 1] instead of [-1, 1]

	return value;
}

const ExponentiallyDistributedNoise = (size, scale, octaves, persistence, lacunarity) =>
{
	if (m.length == 0)
		init();
	
	let map = new HeightMap(size);
	let loc = Math.floor(Math.random() * 10000);	//Pick random point in noise grid

	if (scale <= 0)
		scale = 0.0001;

	scale = size / scale;

	let maxNoiseHeight = Number.MIN_VALUE;
	let minNoiseHeight = Number.MAX_VALUE;

	for (let y = 0; y < size; y++)
		for (let x = 0; x < size; x++)
		{
			let amplitude = 1;		//Refers to each perlin octave as having amplitude and frequency like a wave 
			let frequency = 1;
			let noiseVal = 0;

			//Each successive octave increments the noiseval by a smaller amount with greater detail
			for (let o = 0; o < octaves; o++) 			
			{											
				let xCoord = x / scale * frequency;		//Converts integer coordinates into fractional ones for sampling noise
				let yCoord = y / scale * frequency;
				let sample = noise(loc + xCoord, loc + yCoord);

				noiseVal += sample * amplitude;

				amplitude *= persistence;
				frequency *= lacunarity;
			}

			if (noiseVal > maxNoiseHeight)
				maxNoiseHeight = noiseVal;
			if (noiseVal < minNoiseHeight)
				minNoiseHeight = noiseVal;

			map.set(x, y, noiseVal);
		}

	for (let y = 0; y < size; y++)
		for (let x = 0; x < size; x++)
			map.set(x, y, inverseLerp(minNoiseHeight, maxNoiseHeight, map.get(x, y))); //Smooths out map

	return map;
}

export default ExponentiallyDistributedNoise;