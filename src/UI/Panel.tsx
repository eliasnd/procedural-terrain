import * as React from 'react';
import { Drawer } from '@material-ui/core';
import './../index.css';

interface PanelProps {open: number | null};

export default class Panel extends React.Component<PanelProps> {

	render() {
		let style;

		if (this.props.open)
			style = {
				width: '30%'
			};
		else
			style = {
				width: '0%'
			}

		return (
			<div className='ui-panel' style={style}>

			</div>
		);
	}
}