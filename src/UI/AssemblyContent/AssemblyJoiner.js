import React from 'react';

var buttonStyle = {
	width: '8%',
	height: '24px',
	marginLeft: '46%',
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
		console.log(this.props.verified);
		if (this.props.verified)
			if (this.state.char === 4)
				this.setState({
					char: 0
				})
			else
				this.setState({
					char: (this.state.char+1) % 4
				});

		this.props.callback();
	}

	render()
	{
		console.log('rendering');
		return (
			<button onClick = {this.handleClick} style = {buttonStyle}>{buttonChars[this.state.char]}</button>
		);
	}
}

export default AssemblyJoiner;