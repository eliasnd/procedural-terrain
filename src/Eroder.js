import ParticleErosion from './Eroders/ParticleErosion';

const Erode = (map, data, progressCallback) =>
{
	if (!data)
		return ParticleErosion(map, 1000, 0.3, -9.81, 0.01, 8, 64, 0.02, 0.7, 0.2, 2);

	console.log(data);

	if (data.selected == 'Particle Erosion')
	{
		let args = [
			data['Particles'], data['Inertia'], data['Gravity'], data['Min Capacity'], data['Capacity'], 
			data['Max Steps'], data['Evaporation'], data['Erosion'], data['Deposition'], data['Erosion Radius'], data['Smooth Factor']
		];

		ParticleErosion(map, data['Particles'], data['Inertia'], data['Gravity'], data['Min Capacity'], data['Capacity'], data['Max Steps'], 
					    data['Evaporation'], data['Erosion'], data['Deposition'], data['Erosion Radius'], data['Smooth Factor'], progressCallback);
	}

	return map;
}

export default Erode;