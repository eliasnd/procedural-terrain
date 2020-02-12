import * as React from 'react';
import './../index.css';
import CSS from 'csstype';

interface NavbarProps { buttonCount: number, callback: (index: number) => void, style: CSS.Properties };

const Navbar = (props: NavbarProps) => 
{
	let buttons: Array<React.ReactElement> = [];

	for (let i = 0; i < props.buttonCount; i++)
		buttons.push(
			<button className='navbar-button' onClick={ () => { props.callback(i) } }>
				{ 'b' + i }
			</button>
		);

	return (
		<div className='navbar' style={props.style}>
			{buttons}
		</div>
	);
}

export default Navbar;