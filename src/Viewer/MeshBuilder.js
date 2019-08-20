import * as THREE from "three";

const height = 3;
const meshSize = 33;

/*
    Builds a mesh from a heightmap.
    Can pass additional parameters, including:
        vShader, fShader, as strings
        attributes as object
        uniforms as object
*/

const BuildMesh = (map, vShader, fShader, attributes, uniforms) => 
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

    //Add passed attributes
    if (attributes)
	    for (var attribute in attributes)
        geometry.addAttribute(attribute, attributes[attribute]);

    var material = new THREE.ShaderMaterial({
        uniforms: uniforms ? uniforms : '',
        vertexShader: vShader ? vShader : '',
        fragmentShader: fShader ? fShader : ''
    });

	var mesh = new THREE.Mesh(geometry, material);
	return mesh;    
}

export default BuildMesh;