import React from 'react';
import AssemblySwitch from './AssemblySwitch';
import AssemblyJoiner from './AssemblyJoiner';

var passStyle = {
	width: '80%',
	marginLeft: 'auto',
	marginRight: 'auto',
	paddingLeft: '2.5%',
	paddingRight: '2.5%',
	textAlign: 'center'
};

var contentStyle = {
	marginTop: '10%',
}

class SwitchPass extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			verified: false
		};

		this.verifyPass = this.verifyPass.bind(this);
		this.submitPass = this.submitPass.bind(this);
	}

	verifyPass()
	{
		this.props.verify(this.props.index);
		
		this.setState({
			verified: true
		})

		console.log(this.state.verified);
	}

	submitPass()
	{
		this.props.callback(this.props.index);
	}

	render()
	{
		return (
			<div>
				<div style = {passStyle}>
					<AssemblySwitch content = {this.props.content} verify = {this.verifyPass}/>
				</div>
				<AssemblyJoiner callback = {this.submitPass} verified = {this.state.verified}/>
			</div>
		);
	}
}

class AssemblyContent extends React.Component
{
	constructor(props)
	{
		super(props);

		this.addPass = this.addPass.bind(this);
		this.verifyPass = this.verifyPass.bind(this);

		this.state = {
			passes : [this.props.subtype === 'SwitchContent' ? 
				<SwitchPass 
					content = {this.props.content} 
					callback = {this.addPass} 
					verify = {this.verifyPass}
					index = '0'
				/> : undefined],
			verified: 0
		}
	}

	addPass(index) 
	{
		if (this.state.verified == this.state.passes.length && this.state.verified == index+1)
		{
			let passes = this.state.passes;
			passes.push(this.props.subtype === 'SwitchContent' ? 
				<SwitchPass 
					content = {this.props.content} 
					callback = {this.addPass}
					verify = {this.verifyPass}
					index = {this.state.passes.length}
				/> : undefined);
			this.setState({
				passes: passes
			});
		}
	}

	verifyPass() 
	{
		this.setState({
			verified: this.state.verified + 1
		});
	}

	render()
	{
		var component;

		return (
			<div style = {contentStyle}>
				{this.state.passes}
			</div>
		);
	}
}

export default AssemblyContent;