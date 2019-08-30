import React from 'react';

var buttonStyle = {
	width: '8%',
	height: '24px',
	marginTop: '6px',
	marginBottom: '6px',
	borderRadius: '5px',
	borderWidth: '1px',
	borderColor: '#3b2c21',
	backgroundColor: '#659dbd',
	outline: 'none'
}

var buttonChars = ['+', '-', '*', '/', '↓'];

class AssemblyJoiner extends React.Component
{
	constructor(props)
	{
		super(props);

		this.state = {
			char: 4
		};

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick()
	{
		if (this.props.verified)
			if (this.state.char === 4)
			{
				this.props.callback(buttonChars[this.state.char]);
				this.setState({
					char: 0
				}, () => this.props.callback(buttonChars[this.state.char]));
			}
			else
				this.setState({
					char: (this.state.char+1) % 4
				}, () => this.props.callback(buttonChars[this.state.char]));

	}

	render()
	{
		return (
			<button onClick = {this.handleClick} style = {buttonStyle}>{buttonChars[this.state.char]}</button>
		);
	}
}

export default AssemblyJoiner;