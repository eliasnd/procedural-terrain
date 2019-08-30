import * as THREE from "three";
import WaterMap from './../WaterMap';
import slopeColorShader from './../Shaders/slopeColorShader';

const height = 8;
const meshSize = 33;

const BuildWaterMesh = (waterMap, size) => 
{
	let geometry = new THREE.PlaneBufferGeometry(size, size, waterMap.size, waterMap.size);
	
	geometry.addAttribute('position', new THREE.BufferAttribute(waterMap.map, 3));

	//Set faces
	var faces = [];

	for (let y = 0; y < waterMap.size-1; y++)
        for (let x = 0; x < waterMap.size-1; x++)
        {
        	faces.push(y * waterMap.size + x, (y+1) * waterMap.size + x, (y+1) * waterMap.size + x+1);
        	faces.push(y * waterMap.size + x, (y+1) * waterMap.size + x+1, y * waterMap.size + x+1);
        }

    geometry.setIndex(faces);

    geometry.computeVertexNormals();

    let material = new THREE.MeshPhongMaterial({color: 'blue'});

    return new THREE.Mesh(geometry, material);
}

export default BuildWaterMesh;