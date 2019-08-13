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

	//Calculate gradients for vertex shader
    var gradients = new Float32Array(map.size**2);

    var slopeRange = 2;

    const getMaxGrad = (x, y) => { return Math.max(Math.abs(map.get(x, y) - map.get(x-1, y)), Math.abs(map.get(x, y) - map.get(x+1, y)), Math.abs(map.get(x, y) - map.get(x, y-1)), Math.abs(map.get(x, y) - map.get(x, y+1))); };

    for (let y = 0; y < map.size; y++)
    	for (let x = 0; x < map.size; x++)
    	{
    		let maxGrad = 0;
    		for (let i = -slopeRange; i < slopeRange; i++)
    			for (let j = -slopeRange; j < slopeRange; j++)
    				maxGrad = Math.max(maxGrad, Math.abs(map.get(x, y) - map.get(x+j, y+i)));
    		
    		gradients[y * map.size + x] = maxGrad;
    	}

    //console.log(gradients);

    geometry.addAttribute('gradient', new THREE.BufferAttribute(gradients, 1));

    let slopeThreshold = 0.8995 / map.size;

    //Make shaders
    var shaderMaterial = new THREE.ShaderMaterial({
    	uniforms: {
    		'flatColor' : { value: [0.5, 0.7, 0.3, 1.0] },
    		'steepColor' : { value: [0.6, 0.4, 0.2, 1.0] },
    		'heightThreshold' : { value: 0.2 },
    		'slopeThreshold' : { value: slopeThreshold },
    		'smoothFactor' : { value: 0.005 }
    	},
    	vertexShader: vShader,
    	fragmentShader: fShader,
    });

	var mesh = new THREE.Mesh(geometry, shaderMaterial);
	return mesh;    
}

export default BuildMesh;