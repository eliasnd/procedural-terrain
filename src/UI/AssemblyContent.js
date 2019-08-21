import React from 'react';
import SwitchContent from './SwitchContent';

class AssemblyContent extends React.Component
{
	addComponent()
	{
		
	}

	render()
	{
		var component;

		if (this.props.subtype == 'SwitchContent')
			component = <SwitchContent content = {this.props.content}/>;

		return (
			<div>

			</div>
		);
	}
}