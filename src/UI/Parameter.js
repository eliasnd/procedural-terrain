import React from 'react';

const style = {
	paddingTop: '5px',
	fontSize: '10px'
}

class Parameter extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {property: this.props.text};

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event)
	{
		this.props.handleChange(this.state.property, event.target.value)
	}

	render()
	{
		return (
			<div style = {style}>
				<label for = {this.state.property}>{this.state.property}: </label>
				<input type = 'text' id = {this.props.text} style = {{width: this.props.width}} onChange = {this.handleChange}/>
			</div>
		);
	}
}

export default Parameter;