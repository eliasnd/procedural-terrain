import * as THREE from "three";

const height = 20;
const meshSize = 17;

const BuildMesh = (map) => {
	var geometry = new THREE.Geometry();

	var sizeFactor = meshSize / map.size;

	for (let y = 0; y < map.size; y++)
		for (let x = 0; x < map.size; x++)
			geometry.vertices.push(new THREE.Vector3((x - map.size/2) * sizeFactor, map.get(x, y) * height, (y - map.size/2) * sizeFactor));

	for (let y = 0; y < map.size-1; y ++)
            for (let x = 0; x < map.size-1; x++)
            {
            	geometry.faces.push(new THREE.Face3(y * map.size + x, (y+1) * map.size + x, (y+1) * map.size + x+1));
            	geometry.faces.push(new THREE.Face3(y * map.size + x, (y+1) * map.size + x+1, y * map.size + x+1));
            }

    geometry.computeVertexNormals();

	var material = new THREE.MeshLambertMaterial({ color: 'green' });
	var mesh = new THREE.Mesh(geometry, material);

	return mesh;
}

export default BuildMesh;