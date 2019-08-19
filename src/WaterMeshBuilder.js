import * as THREE from "three";

const height = 8;
const meshSize = 33;

const BuildWaterMesh = (map) => 
{
	//Initialize buffergeometry
	var geometry = new THREE.BufferGeometry();

	var sizeFactor = meshSize / map.size; //Keep meshes of any resolution same size in scene

	//Set vertices
	var vertices = new Float32Array(map.size**2 * 3);

    var rawMap = map.map;

	for (let y = 0; y < map.size; y++)
		for (let x = 0; x < map.size; x++)
		{
			let index = (y * map.size + x) * 3;
			vertices[index] = (x - map.size/2) * sizeFactor;
			vertices[index+1] = rawMap[y * map.size + x] * height - height/2;
			vertices[index+2] = (y - map.size/2) * sizeFactor;
		}

	geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));

	//Set faces
	var faces = [];

	for (let y = 0; y < map.size-1; y++)
        for (let x = 0; x < map.size-1; x++)
        {
        	faces.push(y * map.size + x, (y+1) * map.size + x, (y+1) * map.size + x+1);
        	faces.push(y * map.size + x, (y+1) * map.size + x+1, y * map.size + x+1);
        }

    geometry.setIndex(faces);

    geometry.computeVertexNormals();

    var material = new THREE.MeshPhongMaterial({ 
        color: 0x1a73a0,
        shininess: 75,
        specular: 0x1e1e1e
     });

	var mesh = new THREE.Mesh(geometry, material);
	return mesh;    
}

export default BuildWaterMesh;