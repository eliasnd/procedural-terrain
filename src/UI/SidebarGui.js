import React from 'react';
import Panel from './Panel';

class SidebarGui extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			panels: this.props.config,
			openPanel: undefined
		}

		this.togglePanel = this.togglePanel.bind(this);
		this.returnData = this.returnData.bind(this);
	}

	togglePanel(index)
	{
		if (this.state.openPanel == index)
		{
			this.setState({
				openPanel: undefined
			});
		}
		else
		{
			this.setState({
				openPanel: index
			});
		}
	}

	returnData(data)
	{
		data.panel = this.state.openPanel;

		this.props.callback(data);
	}

	render()
	{
		var panels = this.state.panels.map((panel, index) => 
			<Panel 
				name = {panel.name} 
				key = {panel.name}
				type = {panel.type}
				content = {panel.content}
				tabCount = {this.props.tabCount ? this.props.tabCount : this.props.config.length} 
				tabIndex = {index} 
				open = {this.state.openPanel}
				toggle = {this.togglePanel}
				callback = {this.returnData}
			/>
		);

		return (
			<div>
				{panels}
			</div>
		);
	}
}

export default SidebarGui;