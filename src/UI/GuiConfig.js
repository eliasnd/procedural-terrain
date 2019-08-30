const guiConfig = 
[
	{
		name: 'Generators',
		type: 'AssemblyContent',
		subtype: 'SwitchContent',
		content: 
		{
			label: 'Generator: ',
			options:
			{
				'Exponentially Distributed Noise' : {
					'Size' : {
						defaultValue: '257',
						width: '25px'
					}, 
					'Scale' : {
						defaultValue: '1',
						width: '15px'
					}, 
					'Octaves' : {
						defaultValue: '12',
						width: '15px'
					}, 
					'Persistence' : {
						defaultValue: '0.4',
						width: '15px'
					}, 
					'Lacunarity' : {
						defaultValue: '1.7',
						width: '15px'
					},
					'Weight' : {
						defaultValue: '1',
						width: '15px'
					}
				},
				'Perlin Noise' : {
					'Size' : {
						defaultValue: '257',
						width: '25px'
					}, 
					'Scale' : {
						defaultValue: '2',
						width: '15px'
					}, 
					'Octaves' : {
						defaultValue: '12',
						width: '15px'
					}, 
					'Persistence' : {
						defaultValue: '0.4',
						width: '15px'
					}, 
					'Lacunarity' : {
						defaultValue: '2',
						width: '15px'
					},
					'Weight' : {
						defaultValue: '1',
						width: '15px'
					}
				},
				'Midpoint Displacement' : {
					'Size' : {
						type: 'text',
						width: '25px',
						defaultValue: '257',
					}, 
					'Spread' : {
						defaultValue: '0.8',
					}, 
					'Spread Decay' : {
						defaultValue: '0.5'
					},
					'Weight' : {
						defaultValue: '1',
						width: '15px'
					}
				},
				'Diamond Square' : {
					'Size' : {
						defaultValue: '257',
						width: '25px'
					}, 
					'Spread' : {
						defaultValue: '0.8'
					}, 
					'Spread Decay' : {
						defaultValue: '0.5'
					},
					'Weight' : {
						defaultValue: '1',
						width: '15px'
					}
				}
			},
			submit: 'Generate'
		}
	},
	{
		name: 'Eroders',
		type: 'SwitchContent',
		content: {
			label: 'Eroder: ',
			options: 
			{
				'Particle Erosion' : {
					'Particles' : {
						defaultValue: '10000',
						type: 'number',
						min: '1',
						max: '50000'
					},
					'Inertia' : {
						defaultValue: '0.1',
						type: 'number',
						min: '0',
						max: '1'
					},
					'Gravity' : {
						defaultValue: '-9.81',
						type: 'number',
						min: '0',
						max: '-100'
					},
					'Min Capacity' : {
						defaultValue: '0.01',
						type: 'number'
					},
					'Capacity' : {
						defaultValue: '4',
						type: 'number'
					},
					'Max Steps' : {
						defaultValue: '64',
						type: 'number',
						min: '1',
						max: '200'
					},
					'Evaporation' : {
						defaultValue: '0.02',
						type: 'number',
						min: '0',
						max: '1'
					},
					'Erosion' : {
						defaultValue: '0.3',
						type: 'number',
						min: '0',
						max: '2'
					},
					'Deposition' : {
						defaultValue: '0.3',
						type: 'number',
						min: '0',
						max: '2'
					},
					'Erosion Radius' : {
						defaultValue: '2',
						type: 'number',
						min: '1',
						max: '10'
					},
					'Smooth Factor' : {
						defaultValue: '2',
						type: 'number',
						min: '1',
						max: '10'
					}
				},
				'Fluid Erosion' : {
					'Resolution' : {
						defaultValue: 16
					},
					'Time Step' : {
						defaultValue: 50
					}
				}
			},
			submit: 'Erode'
		}
	},
	{
		name: 'Presets',
		content: 
		{
			type: 'Form',
		}
	},
]

module.exports = {
	config: guiConfig
};