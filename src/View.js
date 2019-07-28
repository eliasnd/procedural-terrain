import React from 'react';
import ReactDOM from 'react-dom';
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

		this.spin = this.spin.bind(this);
		this.stopSpin = this.stopSpin.bind(this);
		this.spin = this.spin.bind(this);
		this.renderScene = this.renderScene.bind(this);
		this.clearExtras = this.clearExtras.bind(this);
	}

	componentDidMount()
	{
		var scene = new THREE.Scene();

		var renderer = new THREE.WebGLRenderer();
		renderer.shadowMap.enabled = true;
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(0x1a214a, 1);

		var light = new THREE.DirectionalLight(0x404040, 5);
		light.position.set(0, 60, 0);

		scene.add(light);

		var map = this.props.map;
		var mesh = BuildMesh(map);
		scene.add(mesh);

		var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.set(-25, 20, -25);
		camera.lookAt(0, 0, 0);

		this.scene = scene;
		this.renderer = renderer;
		this.camera = camera;
		this.mesh = mesh;
		this.extras = [];

		this.view.appendChild(renderer.domElement);
		this.spin();
	}

	startSpin()
	{
		if (!this.frame)
			this.frame = requestAnimationFrame(this.spin);
	}

	stopSpin()
	{
		if (this.frame)
			cancelAnimationFrame(this.frame);
	}

	spin()
	{
		requestAnimationFrame(this.spin);
		//this.mesh.rotation.y += 0.005;

		this.renderScene();
	}

	renderScene()
	{
		this.renderer.render(this.scene, this.camera);
	}

	setMesh(map)
	{
		this.stopSpin();

		this.scene.remove(this.mesh);

		var newMesh = BuildMesh(map);
		this.scene.add(newMesh);

		this.mesh = newMesh;
		this.clearExtras();
	}

	addExtra(obj)
	{
		this.stopSpin();
		console.log(obj);
		this.scene.add(obj);
		this.extras.push(obj);
		//this.scene.remove(this.mesh);

		//console.log(this.extras);
	}
	
	clearExtras()
	{
		this.extras.map((extra) => {this.scene.remove(extra)});
		this.extras = [];
	}

	render()
	{
		if (this.mesh)
		{
			this.setMesh(this.props.map);
			if (this.props.extras)
				this.props.extras.map((extra) => {this.addExtra(extra)});
		}

		return (
			<div ref = {ref => this.view = ref} style = {style}/>
		);
	}
}

export default View;