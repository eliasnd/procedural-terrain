import React from 'react';
import ReactDOM from 'react-dom';
import MidpointDisplacement from './MidpointDisplacement';
import BuildMesh from './MeshBuilder';
import BuildGUI from './Gui';
import * as THREE from 'three';
import * as DAT from 'dat-gui';

class View extends React.Component
{

	componentDidMount()
	{
		var scene = new THREE.Scene();
		var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

		var renderer = new THREE.WebGLRenderer();
		renderer.shadowMap.enabled = true;
		renderer.setSize(window.innerWidth, window.innerHeight);

		var gui = BuildGUI();

		var light = new THREE.DirectionalLight(0x404040, 5);
		light.position.set(0, 60, 0);

		scene.add(light);

		var map = MidpointDisplacement(17);
		var mesh = BuildMesh(map);

		scene.add(mesh);

		camera.position.set(-20, 35, -20);
		camera.lookAt(mesh.position);

		document.body.appendChild(renderer.domElement);

		renderer.render(scene, camera);

		function animate() 
		{
			requestAnimationFrame(animate);
			mesh.rotation.y += 0.005;

			renderer.render(scene, camera);
		}

		animate();
	}

	render()
	{
		return (
			<div/>
		);
	}
}

export default View;