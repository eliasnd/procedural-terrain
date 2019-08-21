import React from 'react';
import SwitchContent from './SwitchContent';

const colors = ['#bc986a', '#659dbd', '#fbeec1', '#252228', 'grey', 'white', 'yellow', 'purple', 'brown']

class Panel extends React.Component
{
	constructor(props)
	{
		super(props);

		this.toggle = this.toggle.bind(this);
		this.returnData = this.returnData.bind(this);
	}

	toggle()
	{
		this.props.toggle(this.props.tabIndex);
	}

	returnData(data)
	{
		let newData = {
			name: this.props.name,
			type: this.props.type
		}

		this.props.callback({...newData, ...data});
	}

	render()
	{
		var tabStyle = {
			borderRadius: '15% 0% 0% 15%',
			position: 'absolute',
			borderStyle: 'solid',
			borderColor: '#3b2c21',
			borderWidth: '4px 0px 4px 4px',
			height: (100 / this.props.tabCount) + '%',
			width: '5%',
			top: 5 + (100 / this.props.tabCount) * this.props.tabIndex + '%',
			right: this.props.open != undefined ? (this.props.panelWidth ? this.props.panelWidth : '20%') : '0%',
			backgroundColor: this.props.color ? this.props.color : colors[this.props.tabIndex]
		}

		var panelStyle = {
			position: 'absolute',
			height: '90%',
			width: '20%',
			top: '5%',
			right: '0%',
			borderStyle: 'solid',
			borderColor: '#3b2c21',
			backgroundColor: this.props.color ? this.props.color : colors[this.props.tabIndex]
		}

		if (this.props.type == 'SwitchContent')
			var content = (<SwitchContent content = {this.props.content} callback = {this.returnData}/>);

		if (this.props.open == this.props.tabIndex)
		{ 
			return(
				<div>
					<button style = {tabStyle} onClick = {this.toggle}>
						{this.props.name}
					</button>
					<div style = {panelStyle}>
						{content}
					</div>
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