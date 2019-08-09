import React from 'react';
import Params from './Params';

const style = {
	textAlign: 'center',
	align: 'center',
	fontSize: '14px',
	paddingTop: '10%',
}

const switchStyle = {
	paddingBottom: '5%',
	paddingTop: '5%',
	borderRadius: '15%',
}

const buttonStyle = {
	marginTop: '5%',
	fontSize: '14px',
	backgroundColor: 'green',
	color: 'white',
	border: 'none'
}

class SwitchContent extends React.Component
{
	constructor(props)
	{
		super(props);

		this.state = {
			selected: Object.keys(this.props.content.options)[0],
			params: {},
		}

		this.switch = this.switch.bind(this);
		this.getParams = this.getParams.bind(this);
		this.generate = this.generate.bind(this);
	}

	switch(event)
	{
		this.setState({
			selected: event.target.value
		});
	}

	getParams(params)
	{
		this.setState({
			params: params
		});
	}

	generate()
	{
		let data = this.state.params;
		data['selected'] = this.state.selected;

		let fields = this.props.content.options[this.state.selected];

		for (let i = 0; i < Object.keys(fields).length; i++)
		{
			let key = Object.keys(fields)[i];
			if (!(key in data))
				data[key] = fields[key]['defaultValue'];
		}

		this.props.callback(data);
	}

	render()
	{
		var options = Object.keys(this.props.content.options).map(option => <option key = {option} value = {option}>{option}</option>);

		return (
			<div style = {style}>
				<div style = {switchStyle}>
					<span>{this.props.content.label}</span>
					<select onChange = {this.switch}> {options} </select>
				</div>
				<Params options = {this.props.content.options} selected = {this.state.selected} callback = {this.getParams}/>
				<button onClick =  {this.generate} style = {buttonStyle}>{this.props.content.submit}</button>
			</div>
		);
	}
}

export default SwitchContent;