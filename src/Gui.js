import * as DAT from 'dat-gui';

const BuildGUI = () => {
	var gui = new DAT.GUI();

	var generators = {
		Generator: 'Generator'
	}

	gui.add(generators, 'Generator', ['Midpoint Displacement', 'Diamond Square', 'Perlin Noise'])

	return gui;
}

export default BuildGUI;