import React from 'react';
import Generate from './Generator';
import Erode from './Eroder';
import SidebarGui from './UI/SidebarGui';
import View from './Viewer/View';

const undoStyle = {
	right: '0%',
	bottom: '0%',
	border: 'none',
	fontSize: '14px',
	position: 'absolute'
}

class Controller extends React.Component
{
	constructor(props)
	{
		super(props);

		let map = Generate();

		this.state = {
			lastMap: map,
			map: map,
			extras: [],
			progress: '0'
		}

		this.handleInput = this.handleInput.bind(this);
		this.undo = this.undo.bind(this);
		this.addExtra = this.addExtra.bind(this);
		this.setMesh = this.setMesh.bind(this);
		this.progress = 0;
	}

	setMesh(map)
	{
		this.setState({
			lastMap: this.state.map.clone(),
			map: map
		});
	}

	addExtra(extra)
	{
		let extras = this.state.extras;
		extras.push(extra);

		this.setState({
			extras: extras
		});
	}

	handleInput(data)
	{
		if (data.name == 'Generators')
			this.setState({
				lastMap: this.state.map.clone(),
				map: Generate(data)
			});
		else if (data.name == 'Eroders')
			this.setState({
				lastMap: this.state.map.clone(),
				map: Erode(this.state.map, data, this.updateProgress)
			});
	}

	undo()
	{
		this.setState({
			map: this.state.lastMap
		});
	}

	render()
	{
		var guiConfig = require('./UI/GuiConfig.js').config;

		return (
			<div>
				<View map = {this.state.map} extras = {this.state.extras}/>
				<SidebarGui config = {guiConfig} tabCount = '10' callback = {this.handleInput}/>
				<button onClick = {this.undo} style = {undoStyle}>Undo</button>
			</div>
		);
	}
}

export default Controller;