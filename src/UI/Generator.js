import React from 'react';

const style = {
	textAlign: 'right',
	paddingRight: '10%'
}

const Generator = function(props)
{
	var options = props.options.map((option) => <option value = {option}>{option}</option>);

	var handleChange = (event) =>
	{
		props.callback(event.target.value);
	}

	return (
		<div style = {style}>
			<span>Generator: </span>
			<select value = {props.options[0]} onChange = {handleChange} id = 'generatorSelect'>
				{options}
			</select>
		</div>
	);
} 

export default Generator;