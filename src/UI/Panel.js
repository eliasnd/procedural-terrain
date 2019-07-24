import React from 'react';

const colors = ['#ff9aa2', '#c7ceea', '#b5ead7', '#fff5ba', 'grey', 'white', 'yellow', 'purple', 'brown']

class Panel extends React.Component
{
	constructor(props)
	{
		super(props);

		this.toggle = this.toggle.bind(this);
	}

	toggle()
	{
		this.props.toggle(this.props.tabIndex);
	}

	render()
	{
		var tabStyle = {
			borderRadius: '15% 0% 0% 15%',
			position: 'absolute',
			border: 'none',
			height: (100 / this.props.tabCount) + '%',
			width: '5%',
			top: (100 / this.props.tabCount) * this.props.tabIndex + '%',
			right: this.props.open != undefined ? (this.props.panelWidth ? this.props.panelWidth : '20%') : '0%',
			backgroundColor: this.props.color ? this.props.color : colors[this.props.tabIndex]
		}

		var panelStyle = {
			position: 'absolute',
			height: '100%',
			width: '20%',
			top: '0%',
			right: '0%',
			backgroundColor: this.props.color ? this.props.color : colors[this.props.tabIndex]
		}

		if (this.props.open == this.props.tabIndex)
		{ 
			return(
				<div>
					<button style = {tabStyle} onClick = {this.toggle}>
						{this.props.name}
					</button>
					<div style = {panelStyle}/>
				</div>
			);
		}
		else
		{
			return (
				<button style = {tabStyle} onClick = {this.toggle}>
					{this.props.name}
				</button>
			);
		}
	}
}

export default Panel;