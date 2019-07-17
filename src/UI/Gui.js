import React from 'react';
import Params from './Params';
import Generator from './Generator';

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

const generators = ['Midpoint Displacement', 'Diamond Square', 'Perlin Noise'];

class Gui extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			generator: 'Midpoint Displacement',
			data: {}
		};

		this.updateGenerator = this.updateGenerator.bind(this);
		this.updateData = this.updateData.bind(this);
		this.generate = this.generate.bind(this);
	}

	updateGenerator(generator)
	{
		this.setState({generator: generator});
	}

	updateData(data)
	{
		this.setState({data: data});
	}

	generate()
	{
		console.log(this.state.data);
		this.props.callback(this.state.generator, this.state.data);
	}

	render() 
	{
		return (
			<div style = {divStyle}>
				<Generator callback = {this.updateGenerator} options = {generators}/>
				<Params generator = {this.state.generator} callback = {this.updateData}/>
				<div style = {{textAlign: 'center'}}>
					<button onClick = {this.generate}>Generate</button>
				</div>
			</div>
		);
	}
}

export default Gui;