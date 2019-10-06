import React from 'react';
import SwitchContent from './SwitchContent';
import AssemblyContent from './AssemblyContent/AssemblyContent';

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
		let height = 100 / this.props.tabCount;

		let tabColor = this.props.color ? this.props.color : colors[this.props.tabIndex];

		var tabStyle = {
			height: (height * 0.8) + '%',
			top: 5 + (height) * this.props.tabIndex + '%',
			right: this.props.open != undefined ? (this.props.panelWidth ? this.props.panelWidth : '279px') : '0',
			marginTop: (height * 0.1) + '%',
			marginBottom: (height * 0.1) + '%',
			zIndex: this.props.open == this.props.tabIndex ? 2 : 0,
			borderColor: '#3b2c21 ' + tabColor + ' #3b2c21 #3b2c21',
			backgroundColor: tabColor
		}

		var panelStyle = {
			backgroundColor: this.props.color ? this.props.color : colors[this.props.tabIndex]
		}

		var content;

		if (this.props.type == 'SwitchContent')
			content = <SwitchContent content = {this.props.content} callback = {this.returnData}/>;
		else if (this.props.type == 'AssemblyContent')
			content = <AssemblyContent subtype = {this.props.subtype} content = {this.props.content} callback = {this.returnData}/>;

		if (this.props.open == this.props.tabIndex)
		{ 
			return(
				<div>
					<button className='tab' style = {tabStyle} onClick = {this.toggle}>
						{this.props.name}
					</button>
					<div className='panel' style = {panelStyle}>
						{content}
					</div>
				</div>
			);
		}
		else
		{
			return (
				<button className='tab' style = {tabStyle} onClick = {this.toggle}>
					{this.props.name}
				</button>
			);
		}
	}
}

export default Panel;