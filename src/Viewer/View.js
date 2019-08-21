import React from 'react';
import ReactDOM from 'react-dom';
import BuildTerrainMesh from './TerrainMeshBuilder';
import HeightMap from './../HeightMap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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
		this.setMesh = this.setMesh.bind(this);
		this.handleResize = this.handleResize.bind(this);
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

		//Make camera
		var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.set(-25, 20, -25);
		camera.lookAt(0, 0, 0);

		var controls = new OrbitControls(camera, renderer.domElement);
		controls.update();

		//Make map
		var map = this.props.map;

		var mesh = BuildTerrainMesh(map);

		scene.add(mesh);

		this.scene = scene;
		this.renderer = renderer;
		this.camera = camera;
		this.extras = [];
		this.mesh = mesh;

		this.view.appendChild(renderer.domElement);
		this.renderScene();
		this.spin();

		window.addEventListener('resize', this.handleResize, false);
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
		if (this.mesh)
			this.scene.remove(this.mesh);

		var newMesh = BuildTerrainMesh(map);
		this.scene.add(newMesh);

		this.mesh = newMesh;
		this.clearExtras();
	}

	addExtra(obj)
	{
		this.stopSpin();
		this.scene.add(obj);
		this.extras.push(obj);
	}
	
	clearExtras()
	{
		this.extras.map((extra) => {this.scene.remove(extra)});
		this.extras = [];
	}

	handleResize(event)
	{
		let width = window.innerWidth;
		let height = window.innerHeight;

		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(width, height);
	}

	render()
	{
		if (this.mesh)
		{
			this.clearExtras();
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