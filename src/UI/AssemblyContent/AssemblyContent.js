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
	textAlign: 'center'
}

var buttonStyle = {
	position: 'relative',
	marginTop: '10%'
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
		this.submitJoiner = this.submitJoiner.bind(this);
		this.submitContent = this.submitContent.bind(this);
	}

	verifyPass()
	{
		this.props.verify(this.props.index);
		
		this.setState({
			verified: true
		});
	}

	submitContent(data)
	{
		this.props.callback(data, 'content', this.props.index);
	}

	submitJoiner(char)
	{
		this.props.callback(char, 'joiner', this.props.index);
	}

	render()
	{
		return (
			<div>
				<div style = {passStyle}>
					<AssemblySwitch content = {this.props.content} verify = {this.verifyPass} callback = {this.submitContent}/>
				</div>
				<AssemblyJoiner callback = {this.submitJoiner} verified = {this.state.verified}/>
			</div>
		);
	}
}

class AssemblyContent extends React.Component
{
	constructor(props)
	{
		super(props);

		this.getData = this.getData.bind(this);
		this.verifyPass = this.verifyPass.bind(this);
		this.submit = this.submit.bind(this);

		let passes = [];

		if (this.props.subtype === 'SwitchContent')
			passes.push(<SwitchPass 
					content = {this.props.content} 
					callback = {this.getData} 
					verify = {this.verifyPass}
					index = '0'
				/>);

		this.state = {
			passes : passes,
			verified: 0,
			content: [],
			joiners: []
		}
	}

	getData(data, type, index)
	{
		if (type === 'joiner')
		{
			if (data === '↓')
			{
				if (this.state.verified == this.state.passes.length && this.state.verified == index+1)
				{
					let passes = this.state.passes;
					passes.push(this.props.subtype === 'SwitchContent' ? 
						<SwitchPass 
							content = {this.props.content} 
							callback = {this.getData}
							verify = {this.verifyPass}
							index = {this.state.passes.length}
						/> : undefined);
					this.setState({
						passes: passes
					});
				}
			}
			else
			{
				let joiners = this.state.joiners;
				joiners[index] = data;

				this.setState({
					joiners: joiners
				});
			}
		}
		else
		{
			let content = this.state.content;
			content[index] = data;
			this.setState({
				content: content
			});
		}
	}

	verifyPass() 
	{
		this.setState({
			verified: this.state.verified + 1
		});
	}

	submit()
	{
		let submission = [];
		for (let i = 0; i < this.state.verified-1; i++)
		{
			submission.push(this.state.content[i]);
			submission.push(this.state.joiners[i]);
		}

		submission.push(this.state.content[this.state.verified-1]);

		if (this.state.verified > 0)
			this.props.callback({data: submission});
	}

	render()
	{
		return (
			<div style = {contentStyle}>
				<div style = {contentStyle}>
					{this.state.passes}
				</div>
				<button style = {buttonStyle} onClick = {this.submit}>Generate</button>
			</div>
		);
	}
}

export default AssemblyContent;