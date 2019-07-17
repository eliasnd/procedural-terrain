import React from 'react';
import ReactDOM from 'react-dom';
import MidpointDisplacement from './MidpointDisplacement';
import BuildMesh from './MeshBuilder';
import Gui from './UI/Gui';
import * as THREE from 'three';
import * as DAT from 'dat-gui';

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

		var light = new THREE.DirectionalLight(0x404040, 5);
		light.position.set(0, 60, 0);

		scene.add(light);

		var map = MidpointDisplacement(257, 0.3, 0.5);
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

		var gui = <Gui generator = {this.generate}/>;

		function generate(params)
		{
			if (params.generator == 'midpointDisplacement')
				map = MidpointDisplacement(params.size, params.spread, params.spreadDecay);

			mesh = BuildMesh(map);

			scene.children.map((child) => { scene.remove(child); });
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