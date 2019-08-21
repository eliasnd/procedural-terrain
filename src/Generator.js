import MidpointDisplacement from './Generators/MidpointDisplacement';
import PerlinNoise from './Generators/PerlinNoise';
import DiamondSquare from './Generators/DiamondSquare';
import ExponentiallyDistributedNoise from './Generators/ExponentiallyDistributedNoise';

const Generate = (data) =>
{
	if (!data)
	{
		let map1 = ExponentiallyDistributedNoise(257, 1, 12, 0.4, 1.7);
		let map2 = PerlinNoise(257, 6, 6, 0.4, 2);

		//for (let y = 0; y < 257; y++)
		//	for (let x = 0; x < 257; x++)
		//		map1.set(x, y, map1.get(x, y) + map2.get(x, y) / 8);

		return map1;
	}

	if (data.selected === 'Midpoint Displacement')
		return MidpointDisplacement(data['Size'], data['Spread'], data['Spread Decay']);
	else if (data.selected === 'Diamond Square')
		return DiamondSquare(data['Size'], data['Spread'], data['Spread Decay']);
	else if (data.selected === 'Perlin Noise')
		return PerlinNoise(data['Size'], data['Scale'], data['Octaves'], data['Persistence'], data['Lacunarity']);
	else if (data.selected === 'Exponentially Distributed Noise')
		return ExponentiallyDistributedNoise(data['Size'], data['Scale'], data['Octaves'], data['Persistence'], data['Lacunarity']);
}

export default Generate;