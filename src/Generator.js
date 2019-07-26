import MidpointDisplacement from './Generators/MidpointDisplacement';
import PerlinNoise from './Generators/PerlinNoise';
import DiamondSquare from './Generators/DiamondSquare';

const Generate = (data) =>
{
	if (!data)
		return PerlinNoise(257, 2, 12, 0.4, 2);

	if (data.selected == 'Midpoint Displacement')
		return MidpointDisplacement(data['Size'], data['Spread'], data['Spread Decay']);
	else if (data.selected == 'Diamond Square')
		return DiamondSquare(data['Size'], data['Spread'], data['Spread Decay']);
	else if (data.selected == 'Perlin Noise')
		return PerlinNoise(data['Size'], data['Scale'], data['Octaves'], data['Persistence'], data['Lacunarity']);
}

export default Generate;