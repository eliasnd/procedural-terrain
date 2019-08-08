import React from 'react';
import Generate from './Generator';
import Erode from './Eroder';
import SidebarGui from './UI/SidebarGui';
import ProgressBar from './UI/ProgressBar';
import View from './View';

const undoStyle = {
	right: '0%',
	bottom: '0%',
	border: 'none',
	fontSize: '14px',
	position: 'absolute'
}

const progressStyle = {
	top: '5%',
	position: 'absolute',
	left: '25%'
}

class Controller extends React.Component
{
	constructor(props)
	{
		super(props);

		let map = Erode(Generate(), this.addExtra);

		this.state = {
			lastMap: map,
			map: map,
			extras: [],
			progress: '0'
		}

		this.progressBar = false;

		this.handleInput = this.handleInput.bind(this);
		this.undo = this.undo.bind(this);
		this.addExtra = this.addExtra.bind(this);
		this.updateProgress = this.updateProgress.bind(this);
		this.progress = 0;
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
		this.setState({
			progressBar: true
		});

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

		this.setState({
			progressBar: false
		});
	}

	updateProgress(progress)
	{
		console.log("Updating progress to " + progress);
		this.setState({
			progress: progress
		});
		this.progress = progress;
		console.log("States progress is now " + this.state.progress);
	}

	undo()
	{
		this.setState({
			map: this.state.lastMap
		});
	}

	render()
	{
		console.log("Rerendering");
		var guiConfig = require('./UI/GuiConfig.js').config;

		return (
			<div>
				<View map = {this.state.map} extras = {this.state.extras}/>
				<ProgressBar style = {progressStyle} active = {this.state.progressBar} progress = {this.progress}/>
				<SidebarGui config = {guiConfig} tabCount = '10' callback = {this.handleInput}/>
				<button onClick = {this.undo} style = {undoStyle}>Undo</button>
			</div>
		);
	}
}

export default Controller;