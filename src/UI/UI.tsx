import * as React from 'react';
import { Box, Drawer } from '@material-ui/core';
import Navbar from './Navbar';
import Panel from './Panel';
import CSS from 'csstype';
import './../index.css';

interface UIState {
	open: number | null
}

export default class UI extends React.Component<{}, UIState>
{
	constructor(props: {}) {
		super(props);

		let state = {
			open: null
		};

		this.state = state;

		this.open = this.open.bind(this);
	}

	open(index: number)
	{
		console.log('open ' + index);
		if (this.state.open === index)
			this.setState({
				open: null
			});
		else
			this.setState({
				open: index
			})
	}

	render()
	{
		let navStyle: CSS.Properties = {
			right: this.state.open !== null ? '30%' : '0'
		};

		if (this.state.open !== null)
		{
			return (
				<div className='ui-box'>
					<Navbar buttonCount={3} callback={this.open} style={navStyle}/>
					<Panel open={this.state.open}/>
				</div>
			);
		}
		else
			return (
				<div className='ui-box'>
					<Navbar buttonCount={3} callback={this.open} style={navStyle}/>
					<Panel open={this.state.open}/>
				</div>
			);
	}
}