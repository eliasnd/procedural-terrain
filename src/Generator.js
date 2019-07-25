import MidpointDisplacement from './Generators/MidpointDisplacement';
import PerlinNoise from './Generators/PerlinNoise';
import DiamondSquare from './Generators/DiamondSquare';

const Generate = (data) =>
{
	if (!data)
		return PerlinNoise(33, 2, 12, 0.4, 2);

	if (data.selected == 'Midpoint Displacement')
		var map = MidpointDisplacement(data['Size'], data['Spread'], data['Spread Decay']);
	else if (data.selected == 'Diamond Square')
		var map = DiamondSquare(data['Size'], data['Spread'], data['Spread Decay']);
	else if (data.selected == 'Perlin Noise')
		var map = PerlinNoise(data['Size'], data['Scale'], data['Octaves'], data['Persistence'], data['Lacunarity']);

	return map;
}

export default Generate;