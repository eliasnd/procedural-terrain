import React from 'react';
import ReactDOM from 'react-dom';
import MidpointDisplacement from './Generators/MidpointDisplacement';
import PerlinNoise from './Generators/PerlinNoise';
import DiamondSquare from './Generators/DiamondSquare';
import ParticleErosion from './Eroders/ParticleErosion';
import BuildMesh from './MeshBuilder';
import SidebarGui from './UI/SidebarGui';
import Panel from './UI/Panel';
import * as THREE from 'three';

const style = {
	position: 'relative',
	height: '100%',
}

class View extends React.Component
{
	constructor(props)
	{
		super(props);

		this.handleInput = this.handleInput.bind(this);
		this.generate = this.generate.bind(this);
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
		var mesh = BuildMesh(map);
		scene.add(mesh);

		this.setState({
			mesh: mesh,
			scene: scene,
			renderer: renderer,
			camera: camera
		});

		camera.position.set(-25, 20, -25);
		camera.lookAt(0, 0, 0);

		this.view.appendChild(renderer.domElement);

		renderer.render(scene, camera);

		function animate() 
		{
			requestAnimationFrame(animate);
			mesh.rotation.y += 0.005;

			renderer.render(scene, camera);
		}

		animate();
	}

	handleInput(input)
	{
		if (input.name == 'Generators')
			this.generate(input);
	}

	generate(data)
	{
		this.state.scene.remove(this.state.mesh);

		if (data.selected == 'Midpoint Displacement')
			var map = MidpointDisplacement(data['Size'], data['Spread'], data['Spread Decay']);
		else if (data.selected == 'Diamond Square')
			var map = DiamondSquare(data['Size'], data['Spread'], data['Spread Decay']);
		else if (data.selected == 'Perlin Noise')
			var map = PerlinNoise(data['Size'], data['Scale'], data['Octaves'], data['Persistence'], data['Lacunarity']);

		var mesh = BuildMesh(map);
		this.state.scene.add(mesh);
		mesh.rotation.y += 0.005;

		this.setState({
			mesh: mesh
		});
	}

	render()
	{
		var guiConfig = require('./UI/GuiConfig.js').config;

		return (
			<div ref = {ref => this.view = ref} style = {style}>
				<SidebarGui config = {guiConfig} tabCount = '10' callback = {this.handleInput}/>
			</div>
		);
	}
}

export default View;