import React from 'react';
import Params from './Params';
import Parameter from './Parameter';

//Styles {
	const divStyle = {
		position: 'absolute',
		width: '17%',
		right: '0%',
		backgroundColor: 'grey',
		paddingTop: '20px',
		paddingBottom: '20px',
		fontSize: '10px'
	}

	const generatorSelectStyle  = {
		paddingRight: '5%',
		textAlign: 'right',
	}

	const submit = {
		paddingTop: '10px',
		textAlign: 'center'
	}

	const paramsStyle = {
		textAlign: 'right',
		paddingRight: '5%',
		position: 'relative'
	}
//}

const configs = [
	['midpointDisplacement', 'Size', 'Spread', 'Spread Decay'],
	['diamondSquare', 'Size', 'Spread', 'Spread Decay'],
	['perlinNoise', 'Size', 'Scale', 'Octaves', 'Persistence', 'Lacunarity']
]

class Gui extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			generator: 'midpointDisplacement',
			params: ['Size', 'Spread', 'Spread Decay']
		};

		this.handleGeneratorChange = this.handleGeneratorChange.bind(this);
		this.buildParams = this.buildParams.bind(this);
	}

	handleGeneratorChange(event)
	{
		/*if (event.target.value == 'midpointDisplacement')
			var params = ['Size', 'Spread', 'Spread Decay'];
		else if (event.target.value == 'diamondSquare')
			var params = ['Size', 'Spread', 'Spread Decay'];
		else
			var params = ['Swoop', 'Scale', 'Octaves', 'Persistence', 'Lacunarity'];*/

		this.setState({
			generator: event.target.value,
			//params: params
		})
	}

	buildParams(params)
	{
		var parameters = params.map((param) => <Parameter text = {param} width = {this.props.width} handleChange = {this.getParams}/>);
		return parameters;
	}

	render() 
	{
		if (this.state.generator == 'midpointDisplacement')
			var params = ['Size', 'Spread', 'Spread Decay'];
		else if (this.state.generator == 'diamondSquare')
			var params = [];
		else
			var params = ['Swoop', 'Scale', 'Octaves', 'Persistence', 'Lacunarity'];

		var parameters = this.buildParams(params);

		return (
			<div style = {divStyle}>
				<form onsubmit = {this.props.generate}>
					<div style = {generatorSelectStyle}>
						<label for = 'generatorSelect'>Generator: </label>
						<select value = {this.state.generator} onChange = {this.handleGeneratorChange} id = 'generatorSelect'>
							<option value='midpointDisplacement'>Midpoint Displacement</option>
							<option value='diamondSquare'>Diamond Square</option>
							<option value='perlinNoise'>Perlin Noise</option>
						</select>
					</div>
					<div style = {paramsStyle}>
						{parameters}
					</div>
					<div style = {submit}>
						<input type = 'submit' value = 'Generate'/>
					</div>
				</form>
			</div>
		);
	}
}

export default Gui;