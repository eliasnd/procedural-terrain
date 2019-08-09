import * as THREE from "three";

const height = 8;
const meshSize = 33;

var client = new XMLHttpRequest();
client.open('GET', './Shaders/slopeColorVertex.glsl');
client.open('GET', './Shaders/slopeColorFragment.glsl');

const BuildMesh = (map) => {
	console.log("Rebuilding mesh");
	var geometry = new THREE.BufferGeometry();

	var sizeFactor = meshSize / map.size;

	var vertices = new Float32Array(map.size**2 * 3);

	for (let y = 0; y < map.size; y++)
		for (let x = 0; x < map.size; x++)
		{
			let index = (y * map.size + x) * 3;
			vertices[index] = (x - map.size/2) * sizeFactor;
			vertices[index+1] = map.get(x, y) * height - height/2;
			vertices[index+2] = (y - map.size/2) * sizeFactor;
			//vertices.push((x - map.size/2) * sizeFactor, map.get(x, y) * height - height/2, (y - map.size/2) * sizeFactor);
		}

	geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));

	var faces = [];

	for (let y = 0; y < map.size-1; y++)
        for (let x = 0; x < map.size-1; x++)
        {
        	faces.push(y * map.size + x, (y+1) * map.size + x, (y+1) * map.size + x+1);
        	faces.push(y * map.size + x, (y+1) * map.size + x+1, y * map.size + x+1);
        }

    geometry.setIndex(faces);

    geometry.computeVertexNormals();

    var gradients = new Float32Array((map.size-1)**2);

    for (let y = 0; y < map.size-1; y++)
    	for (let x = 0; x < map.size-1; x++)
    	{
    		let grad = map.grad(x, y);
    		gradients[y * (map.size-1) + x] = Math.sqrt(grad[0]**2 + grad[1]**2);
    	}

    geometry.addAttribute('gradient', new THREE.BufferAttribute(gradients, 1));

    //var shadedMaterial = new THREE.ShaderMaterial({ })

	var material = new THREE.MeshStandardMaterial({ color: 'grey', roughness: '1', metalness: '0' });

	var shaderMat = new THREE.ShaderMaterial()

	var mesh = new THREE.Mesh(geometry, material);

	return mesh;
}

export default BuildMesh;