import HeightMap from './../HeightMap';

const startHeight = 2;

const density = 997; //997 kg/m^3
const gravity = -9.81;

const SimulateFlow = (map) =>
{
	let waterMap = new HeightMap(map.size);
	waterMap.setAll(startHeight);

	let velMap = new HeightMap(map.size);
}

const Step = (heightMap, waterMap, x, y) => 
{
	//Q = hpg + 1/2pv^2 + (p0 + E)
	var pressure = waterMap.get(x, y) * density * gravity + 0.5 * density * 
}