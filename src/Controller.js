import React from 'react';
import Generate from './Generator';
import ParticleErosion from './Eroders/ParticleErosion';
import SidebarGui from './UI/SidebarGui';
import View from './View';

class Controller extends React.Component
{
	constructor(props)
	{
		super(props);

		this.state = {
			map: Generate()
		}

		this.handleInput = this.handleInput.bind(this);
	}

	handleInput(data)
	{
		if (data.name == 'Generators')
			this.setState({
				map: Generate(data)
			});
	}

	render()
	{
		var guiConfig = require('./UI/GuiConfig.js').config;

		return (
			<div>
				<View map = {this.state.map}/>
				<SidebarGui config = {guiConfig} tabCount = '10' callback = {this.handleInput}/>
			</div>
		);
	}
}

export default Controller;