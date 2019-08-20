import * as THREE from "three";
import BuildMesh from './MeshBuilder';
import slopeColorShader from './../Shaders/slopeColorShader';

const height = 8;
const meshSize = 33;

const BuildTerrainMesh = (map) => 
{
    var gradients = new Float32Array(map.size**2);

    var slopeRange = 1.5;

    for (let y = 0; y < map.size; y++)
        for (let x = 0; x < map.size; x++)
        {
            let maxGrad = 0;
            for (let i = -slopeRange; i < slopeRange; i++)
                for (let j = -slopeRange; j < slopeRange; j++)
                    maxGrad = Math.max(maxGrad, Math.abs(map.get(x, y) - map.get(x+j, y+i)));
            
            gradients[y * map.size + x] = maxGrad;
        }

    var gradientAttribute = new THREE.BufferAttribute(gradients, 1);

    var attributes = {
        'gradient' : gradientAttribute
    };

    let slopeThreshold = 0.8995 / map.size;

    var uniforms = {
        'lowColor' : { value: [0.5, 0.7, 0.3, 1.0] },
        'highColor' : { value: [0.95, 0.95, 0.95, 1.0] },
        'steepColor' : { value: [0.6, 0.4, 0.2, 1.0] },
        'heightThreshold' : { value: 0.2 },
        'slopeThreshold' : { value: slopeThreshold },
        'smoothFactor' : { value: 0.005 }
    };

	return BuildMesh(map, slopeColorShader.vShader, slopeColorShader.fShader, attributes, uniforms);  
}

export default BuildTerrainMesh;