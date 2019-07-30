import React from 'react';

const style = {
	textAlign: 'right',
	paddingRight: '10%'
}

const Generator = function(props)
{
	var options = props.options.map((option) => <option key = {option} value = {option}>{option}</option>);

	var handleChange = (event) =>
	{
		props.callback(event.target.value);
	}

	return (
		<div style = {style}>
			<div>
				<span>Generator: </span>
				<select default = {props.options[0]} onChange = {handleChange} id = 'generatorSelect'>
					{options}
				</select>
			</div>
		</div>
	);
} 

export default Generator;