import * as THREE from "three";
import WaterMap from './../WaterMap';
import waterShader from './../Shaders/waterShader';

const height = 8;
const meshSize = 33;

const BuildWaterMesh = (waterMap, size) => 
{
	let geometry = new THREE.PlaneBufferGeometry(size, size, waterMap.size, waterMap.size);
	
	geometry.addAttribute('position', new THREE.BufferAttribute(waterMap.map, 3));
    geometry.attributes.position.needsUpdate = true;

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

    var uniforms = {
        heightMap: {value: waterMap},
        waterColor: {value: [0.1, 0.3, 0.9, 1.0]}
    };

    let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: waterShader.vShader,
        fragmentShader: waterShader.fShader
    });

    /*let material = new THREE.MeshPhongMaterial({
    	color: 0x18516d,
    	specular: 0x232323,
    	shininess: 46,
    	transparent: true,
    	opacity: 0.7
    });*/

    return new THREE.Mesh(geometry, material);
}

export default BuildWaterMesh;