import React from 'react';
import Params from './Params';

const style = {
	textAlign: 'center',
	align: 'center',
	fontSize: '14px',
	paddingTop: '10%'
}

const switchStyle = {
	display: 'inline-block',
	paddingBottom: '5%',
	paddingTop: '5%',
	borderRadius: '15%',
	outline: 'none'
}

const buttonStyle = {
	fontSize: '14px',
	width: '10px',
	outline: 'none',
	backgroundColor: 'Transparent',
	display: 'inline-block',
	color: 'black',
	border: 'none',
}

const bodyStyle = {
	backgroundColor: '#b5ab8a',
	width: '90%',
	marginLeft: 'auto',
	marginRight: 'auto',
	border: 'solid',
	borderWidth: '0px 3px 3px 3px',
	borderRadius: '0px 0px 10px 10px',
	borderColor: '#3b2c21',
	paddingBottom: '5%'
}

class SwitchContent extends React.Component
{
	constructor(props)
	{
		super(props);

		let params = {};

		let fields = this.props.content.options[Object.keys(this.props.content.options)[0]];

		for (let i = 0; i < Object.keys(fields).length; i++)
		{
			let key = Object.keys(fields)[i];
			params[key] = fields[key]['defaultValue'];
		}

		this.state = {
			selected: Object.keys(this.props.content.options)[0],
			params: params,
			open: false,
			verified: false
		}

		this.toggleOpen = this.toggleOpen.bind(this);
		this.switch = this.switch.bind(this);
		this.getParams = this.getParams.bind(this);
		this.returnData = this.returnData.bind(this);
	}

	toggleOpen()
	{
		if (this.state.selected !== 'none')
			this.setState({
				open: !this.state.open
			});
	}

	switch(event)
	{
		this.setState({
			selected: event.target.value
		});
	}

	getParams(params)
	{
		let newParams = {...this.state.params, ...params}

		this.setState({
			params: newParams
		});
	}

	returnData()
	{
		this.props.callback({selected: this.state.selected, ...this.state.params});
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
				<button onClick = {this.returnData}>Erode</button>
			</div>
		);
	}
}

export default SwitchContent;