import React from 'react';
import ReactDOM from 'react-dom';
import MidpointDisplacement from './Generators/MidpointDisplacement';
import PerlinNoise from './Generators/PerlinNoise';
import DiamondSquare from './Generators/DiamondSquare';
import ParticleErosion from './Eroders/ParticleErosion';
import BuildMesh from './MeshBuilder';
import Gui from './UI/Gui';
import * as THREE from 'three';

class View extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			gui: ''
		};
	}

	componentDidMount()
	{
		var scene = new THREE.Scene();
		var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

		var renderer = new THREE.WebGLRenderer();
		renderer.shadowMap.enabled = true;
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(0x1a214a, 1);

		var light = new THREE.DirectionalLight(0x404040, 5);
		light.position.set(0, 60, 0);

		scene.add(light);

		var map = PerlinNoise(257, 2, 12, 0.4, 2);
		map = ParticleErosion(map, 10000);
		var mesh = BuildMesh(map);
		scene.add(mesh);

		camera.position.set(-25, 20, -25);
		camera.lookAt(0, 0, 0);

		document.body.appendChild(renderer.domElement);

		renderer.render(scene, camera);

		function animate() 
		{
			requestAnimationFrame(animate);
			mesh.rotation.y += 0.005;

			renderer.render(scene, camera);
		}

		animate();

		var gui = <Gui callback = {generate}/>;

		function generate(generator, params)
		{
			if (generator === 'Midpoint Displacement')
				map = MidpointDisplacement(params.Size ? params.Size : 257, params.Spread ? params.Spread : 0.4, params['Spread Decay'] ? params['Spread Decay'] : 0.5);
			else if (generator === 'Diamond Square')
				map = DiamondSquare(params.Size ? params.Size : 257, params.Spread ? params.Spread : 0.4, params['Spread Decay'] ? params['Spread Decay'] : 0.5);
			else if (generator === 'Perlin Noise')
				map = PerlinNoise(params.Size ? params.Size : 257, params.Scale ? params.Scale : 2, params.Octaves ? params.Octaves : 12, params.Persistence ? params.Persistence : 0.4, params.Lacunarity ? params.Lacunarity : 2);
			else
				map = MidpointDisplacement(257, 0.4, 0.5);

			scene.remove(mesh);

			mesh = BuildMesh(map);

			scene.add(mesh);
		}

		this.setState({gui: gui});
	}

	render()
	{
		return (
			<div>
				{this.state.gui}
			</div>
		);
	}
}

export default View;