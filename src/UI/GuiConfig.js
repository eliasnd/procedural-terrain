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
					'Size' : {width: '25px'}, 
					'Spread' : {
						default: '0.8'
					}, 
					'Spread Decay' : {
						default: '0.5'
					}
				},
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
				}
			}
		}
	},
	{
		name: 'Eroders',
		content: {}
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