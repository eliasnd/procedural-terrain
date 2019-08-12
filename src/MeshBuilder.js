import * as THREE from "three";

const height = 8;
const meshSize = 33;

const BuildMesh = (map, vShader, fShader) => 
{
	//Initialize buffergeometry
	var geometry = new THREE.BufferGeometry();

	var sizeFactor = meshSize / map.size; //Keep meshes of any resolution same size in scene

	//Set vertices
	var vertices = new Float32Array(map.size**2 * 3);

	for (let y = 0; y < map.size; y++)
		for (let x = 0; x < map.size; x++)
		{
			let index = (y * map.size + x) * 3;
			vertices[index] = (x - map.size/2) * sizeFactor;
			vertices[index+1] = map.get(x, y) * height - height/2;
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

    //var gradients = new Float32Array(map.size**2 * 2);	//Calculate gradients for vertex shader
    var gradients = new Float32Array(map.size**2);

    for (let y = 0; y < map.size; y++)
    	for (let x = 0; x < map.size; x++)
    	{
    		let maxGrad = Math.max(Math.abs(map.get(x, y) - map.get(x+1, y)), Math.abs(map.get(x, y) - map.get(x-1, y)), Math.abs(map.get(x, y) - map.get(x, y+1)), Math.abs(map.get(x, y) - map.get(x, y-1)));
    		gradients[y * map.size + x] = maxGrad;
    	}

    //console.log(gradients);

    geometry.addAttribute('gradient', new THREE.BufferAttribute(gradients, 1));

    //Make shaders
    var shaderMaterial = new THREE.ShaderMaterial({
    	//uniforms: uniforms,
    	vertexShader: vShader,
    	fragmentShader: fShader,
    	//lights: true
    });

	var mesh = new THREE.Mesh(geometry, shaderMaterial);
	return mesh;    
}

export default BuildMesh;