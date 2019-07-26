import React from 'react';
import Generate from './Generator';
import Erode from './Eroder';
import SidebarGui from './UI/SidebarGui';
import View from './View';

class Controller extends React.Component
{
	constructor(props)
	{
		super(props);

		let map = Erode(Generate());

		this.state = {
			map: map
		}

		this.handleInput = this.handleInput.bind(this);
	}

	handleInput(data)
	{
		if (data.name == 'Generators')
			this.setState({
				map: Generate(data)
			});
		else if (data.name == 'Eroders')
			this.setState({
				map: Erode(this.state.map, data)
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