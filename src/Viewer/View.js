import React from 'react';
import ReactDOM from 'react-dom';
import BuildTerrainMesh from './TerrainMeshBuilder';
import BuildWaterMesh from './WaterMeshBuilder';
import simulate from './../Eroders/FluidErosion/PipeErosion';
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

		this.animate = this.animate.bind(this);
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
		renderer.setClearColor(0x6fa8bf, 1);

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
		var terrainMesh = BuildTerrainMesh(map);
		scene.add(terrainMesh);

		//Make water
		if (this.props.waterMap)
		{
			var waterMap = this.props.waterMap;
			var waterMesh = BuildWaterMesh(waterMap);
			console.log(waterMap.map);
			setTimeout(() => console.log(waterMap.map), 5000);

			scene.add(waterMesh);

			simulate(waterMap);
		}
		
		this.scene = scene;
		this.renderer = renderer;
		this.camera = camera;
		this.extras = [];
		this.mesh = terrainMesh;

		this.view.appendChild(renderer.domElement);
		this.animate();

		window.addEventListener('resize', this.handleResize, false);
	}

	animate()
	{
		requestAnimationFrame(this.animate);

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