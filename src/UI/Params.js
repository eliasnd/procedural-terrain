import React from 'react';

const paramStyle = {
	paddingTop: '5%',
	display: 'block',
	textAlign: 'right',
	paddingRight: '15%'
}

const labelStyle = {
	display: 'inline-block'
}

const inputStyle = {
	textAlign: 'center',
	display: 'inline-block'
}

const Parameter = function(props)
{
	var handleChange = (event) =>
	{
		props.callback(props.label, event.target.value);
	}

	return (
		<div style = {paramStyle}>
			<span>{props.label}: </span>
			<input type = {props.type} onChange = {handleChange} style = {inputStyle} defaultValue = {props.default}/>
		</div>
	);
}

class Params extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			params: {}
		}
		this.getParam = this.getParam.bind(this);
	}

	getParam(label, value)
	{
		var params = this.state.params;
		params[label] = value;

		this.props.callback(params);

		this.setState({
			params: params
		});
	}

	render()
	{
		let config = this.props.options[this.props.selected];
		let params = Object.keys(config);

		params = params.map(param => <Parameter key = {param} label = {param} type = {config[param].type} default = {config[param].default} callback = {this.getParam}/>);

		return (
			<div>
				{params}
			</div>
		);
	}
}

export default Params;