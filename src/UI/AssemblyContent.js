import React from 'react';
import SwitchContent from './SwitchContent';

var passStyle = {
	width: '80%',
	marginLeft: 'auto',
	marginRight: 'auto',
	paddingLeft: '2.5%',
	paddingRight: '2.5%',
	textAlign: 'center'
};

var buttonStyle = {
	width: '8%',
	height: '24px',
	marginLeft: '46%',
	marginTop: '2%',
	marginBottom: '2%',
	borderRadius: '5px',
	borderWidth: '1px',
	borderColor: '#3b2c21',
	backgroundColor: '#659dbd',
	outline: 'none'
}

var contentStyle = {
	marginTop: '10%',
}

const SwitchPass = (props) =>
{
	return (
		<div>
			<div style = {passStyle}>
				<SwitchContent content = {props.content} collapsible/>
			</div>
			<button onClick = {props.callback} style = {buttonStyle}>+</button>
		</div>
	);
}

class AssemblyContent extends React.Component
{
	constructor(props)
	{
		super(props);

		this.addPass = this.addPass.bind(this);

		this.state = {
			passes : [this.props.subtype === 'SwitchContent' ? <SwitchPass content = {this.props.content} callback = {this.addPass}/> : undefined]
		}
	}

	addPass() {
		let passes = this.state.passes;
		passes.push(this.props.subtype === 'SwitchContent' ? <SwitchPass content = {this.props.content} callback = {this.addPass}/> : undefined);
		this.setState({
			passes: passes
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