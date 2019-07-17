import React from 'react';
import Parameter from './Parameter';

const style = {
	textAlign: 'right',
	paddingRight: '5%',
	position: 'relative'
}

class Params extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			generator: this.props.generator
		}

		this.getParams = this.getParams.bind(this);
	}

	getParams(param, event)
	{
		this.setState({param: event.target.value});
		this.props.passParams(this.state);
	}

	render()
	{
		var params;

		if (this.props.generator == 'midpointDisplacement')
			params = ['Size', 'Spread', 'Spread Decay'];
		else if (this.props.generator == 'diamondSquare')
			params = ['Size', 'Spread', 'Spread Decay'];
		else
			params = ['Size', 'Scale', 'Octaves', 'Persistence', 'Lacunarity'];

		params = params.map((param) => <Parameter text = {param} width = {this.props.width} handleChange = {this.getParams}/>);

		return (
			<div style = {style}>
				{params}
			</div>
		);
	}
}

export default Params;