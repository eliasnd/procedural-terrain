const slopeColorShader = {

	vShader: [

		'attribute float gradient;',
		'varying float grad;',
		'varying vec3 vNormal;',

		'void main()',
		'{',
			'vNormal = normal;',
			'grad = gradient;',

			'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
		'}'

	].join('\n'),

	fShader: [

		'varying float grad;',
		'varying vec3 vNormal;',

		'void main()',
		'{',
			'vec3 light = vec3(0.5, 0.4, 1.0);',
			'light = normalize(light);',
			'float dProd = max(0.0, dot(light, vNormal));',
			'vec4 color = grad > 0.006 ? vec4(0.5, 0.5, 0.5, 1.0) : vec4(0, 1.0, 0, 1.0);',
			'gl_FragColor = color * vec4(dProd, dProd, dProd, 1.0);',
		'}'

	].join('\n')

};

export default slopeColorShader