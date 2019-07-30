import React from 'react';
//import Parameter from './Parameter';

const style = {
	textAlign: 'right',
	paddingRight: '5%',
	paddingTop: '5px',
	position: 'relative'
}

const Parameter = function(props)
{
	var handleChange = (event) =>
	{
		props.callback(props.text, event.target.value);
	}

	return (
		<div style = {style}>
			<span>{props.text}: </span>
			<input type = 'text' style = {{width: props.width}} onChange = {handleChange}/>
		</div>
	);
}

class Params extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			generator: this.props.generator,
			params: [],
			data: {}
		}

		this.getParam = this.getParam.bind(this);
	}

	getParam(param, value)
	{
		var data = this.state.data;
		data[param] = value;
		this.setState({data: data});

		this.props.callback(data);
	}

	render()
	{
		var params;
		if (this.props.generator === 'Midpoint Displacement')
			params = ['Size', 'Spread', 'Spread Decay'];
		else if (this.props.generator === 'Diamond Square')
			params = ['Size', 'Spread', 'Spread Decay'];
		else
			params = ['Size', 'Scale', 'Octaves', 'Persistence', 'Lacunarity'];

		params = params.map((param) => <Parameter key = {param} text = {param} width = {this.props.width} callback = {this.getParam}/>);

		return (
			<div style = {style}>
				{params}
			</div>
		);
	}
}

export default Params;