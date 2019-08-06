import ParticleErosion from './Eroders/ParticleErosion';

const Erode = (map, data, callback) =>
{
	if (!data)
		return ParticleErosion(map, 1000, 0.3, -9.81, 0.01, 8, 64, 0.02, 0.7, 0.2, 2);

	if (data.selected == 'Particle Erosion')
		ParticleErosion(map, data['Particles'], data['Inertia'], data['Gravity'], data['Min Slope'], data['Capacity'], 
									data['Max Steps'], data['Evaporation'], data['Erosion'], data['Deposition'], data['Erosion Radius'], callback);

	return map;
}

export default Erode;