import React from 'react';
import Params from './../Params';

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

const headerStyle = {
	backgroundColor: '#fbeec1',
	borderRadius: '7px',
	border: 'solid',
	borderWidth: '3px',
	borderColor: '#3b2c21'
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

class AssemblySwitch extends React.Component
{
	constructor(props)
	{
		super(props);

		this.state = {
			selected: 'none',
			params: {},
			open: false,
			verified: false
		}

		this.toggleOpen = this.toggleOpen.bind(this);
		this.switch = this.switch.bind(this);
		this.getParams = this.getParams.bind(this);
		this.initParams = this.initParams.bind(this);
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
		if (!this.state.verified)
			this.props.verify();

		this.setState({
			selected: event.target.value,
			verified: true
		}, this.initParams);
	}

	initParams()
	{
		let params = {};

		let fields = this.props.content.options[this.state.selected];

		for (var field in fields)
			params[field] = fields[field]['defaultValue'];

		this.setState({
			params: params
		});

		this.props.callback({
			selected: this.state.selected,
			...params
		});
	}

	getParams(params)
	{
		let newParams = {...this.state.params, ...params}

		this.setState({
			params: newParams
		});

		this.props.callback({
			selected: this.state.selected,
			...newParams
		});
	}

	render()
	{
		var options = Object.keys(this.props.content.options).map(option => <option key = {option} value = {option}>{option}</option>);

		options.unshift(<option key = 'none' value = 'none' disabled hidden>{'Select ' + this.props.content.label}</option>);

		if (!this.state.open)
			if (this.state.selected === 'none')
				return (
					<div>
						<div style = {headerStyle}>
							<div style = {switchStyle}>
								<select onChange = {this.switch} defaultValue = 'none' text-align = 'center'> {options} </select>
							</div>
							<button onClick = {this.toggleOpen} style = {buttonStyle}></button>
						</div>
					</div>
				);
			else
			{
				return (
					<div>
						<div style = {headerStyle}>
							<div style = {switchStyle}>
								<select onChange = {this.switch} defaultValue = 'none' text-align = 'center'> {options} </select>
							</div>
							<button onClick = {this.toggleOpen} style = {buttonStyle}>+</button>
						</div>
					</div>
				);
			}
		else
			return (
				<div>
					<div style = {headerStyle}>
						<div style = {switchStyle}>
							<select onChange = {this.switch} defaultValue = 'none'> {options} </select>
						</div>
						<button onClick = {this.toggleOpen} style = {buttonStyle}>-</button>
					</div>
					<div style = {bodyStyle}>
						<Params options = {this.props.content.options} selected = {this.state.selected} callback = {this.getParams}/>
					</div>
				</div>
			);
	}
}

export default AssemblySwitch;