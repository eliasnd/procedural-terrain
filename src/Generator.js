import MidpointDisplacement from './Generators/MidpointDisplacement';
import PerlinNoise from './Generators/PerlinNoise';
import DiamondSquare from './Generators/DiamondSquare';
import ExponentiallyDistributedNoise from './Generators/ExponentiallyDistributedNoise';
import HeightMap from './HeightMap';

const add = (a, b) => a + b;
const sub = (a, b) => a - b;
const mult = (a, b) => a * b;
const div = (a, b) => a / b;

const GenerateMap = (data) => 
{
	var map;

	if (data.selected === 'Midpoint Displacement')
		map = MidpointDisplacement(data['Size'], data['Spread'], data['Spread Decay']);
	else if (data.selected === 'Diamond Square')
		map = DiamondSquare(data['Size'], data['Spread'], data['Spread Decay']);
	else if (data.selected === 'Perlin Noise')
		map = PerlinNoise(data['Size'], data['Scale'], data['Octaves'], data['Persistence'], data['Lacunarity']);
	else if (data.selected === 'Exponentially Distributed Noise')
		map = ExponentiallyDistributedNoise(data['Size'], data['Scale'], data['Octaves'], data['Persistence'], data['Lacunarity']);

	for (let y = 0; y < map.size; y++)
		for (let x = 0; x < map.size; x++)
			map.set(x, y, map.get(x, y) * data['Weight']);

	return map;
}

const CombineMaps = (map1, map2, func) => 
{
	let map = new HeightMap(map1.size);

	for (let y = 0; y < map1.size; y++)
		for (let x = 0; x < map1.size; x++)
			map.set(x, y, func(map1.get(x, y), map2.get(x, y)));

	return map;
}

const Generate = (data) =>
{
	if (!data)
	{
		let map1 = ExponentiallyDistributedNoise(257, 1, 12, 0.4, 1.7);
		let map2 = PerlinNoise(257, 2, 12, 0.4, 2);

		//for (let y = 0; y < 257; y++)
		//	for (let x = 0; x < 257; x++)
		//		map1.set(x, y, map1.get(x, y) + map2.get(x, y) / 8);

		return map2;
	}
	else if (data.type == 'AssemblyContent')
	{
		console.log(data);
		let assembly = data['data'];

		let map = GenerateMap(assembly[0]);

		for (let i = 1; i < assembly.length-1; i+=2)
		{
			let newMap = GenerateMap(assembly[i+1]);

			switch(assembly[i])
			{
				case '+':
					map = CombineMaps(map, newMap, (a, b) => a + b);
					break;
				case '-':
					map = CombineMaps(map, newMap, sub);
					break;
				case '*':
					map = CombineMaps(map, newMap, mult);
					break;
				case '/':
					map = CombineMaps(map, newMap, div);
					break;
			}
		}

		return map;
	}
	else
	{
		if (data.selected === 'Midpoint Displacement')
			return MidpointDisplacement(data['Size'], data['Spread'], data['Spread Decay']);
		else if (data.selected === 'Diamond Square')
			return DiamondSquare(data['Size'], data['Spread'], data['Spread Decay']);
		else if (data.selected === 'Perlin Noise')
			return PerlinNoise(data['Size'], data['Scale'], data['Octaves'], data['Persistence'], data['Lacunarity']);
		else if (data.selected === 'Exponentially Distributed Noise')
			return ExponentiallyDistributedNoise(data['Size'], data['Scale'], data['Octaves'], data['Persistence'], data['Lacunarity']);
	}
}

export default Generate;