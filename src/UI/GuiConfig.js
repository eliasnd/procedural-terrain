const guiConfig = 
[
	{
		name: 'Generators',
		type: 'SwitchContent',
		content: 
		{
			label: 'Generator: ',
			options:
			{
				'Perlin Noise' : {
					'Size' : {
						default: '257',
						width: '25px'
					}, 
					'Scale' : {
						default: '2',
						width: '15px'
					}, 
					'Octaves' : {
						default: '12',
						width: '15px'
					}, 
					'Persistence' : {
						default: '0.4',
						width: '15px'
					}, 
					'Lacunarity' : {
						default: '2',
						width: '15px'
					}
				},
				'Midpoint Displacement' : {
					'Size' : {
						type: 'text',
						width: '25px',
						default: '257',
					}, 
					'Spread' : {
						default: '0.8',
					}, 
					'Spread Decay' : {
						default: '0.5'
					}
				},
				'Diamond Square' : {
					'Size' : {
						default: '257',
						width: '25px'
					}, 
					'Spread' : {
						default: '0.8'
					}, 
					'Spread Decay' : {
						default: '0.5'
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
						default: '10000'
					},
					'Inertia' : {
						default: '0.1'
					},
					'Gravity' : {
						default: '-9.81'
					},
					'Min Slope' : {
						default: '0.01'
					},
					'Capacity' : {
						default: '4'
					},
					'Max Steps' : {
						default: '64'
					},
					'Evaporation' : {
						default: '0.02'
					},
					'Erosion' : {
						default: '0.3'
					},
					'Deposition' : {
						default: '0.3'
					},
					'Erosion Radius' : {
						default: '2'
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