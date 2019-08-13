const slopeColorShader = {

	vShader: [

		'attribute float gradient;',
		'varying float grad;',
		'varying float height;',
		'varying vec3 vNormal;',

		'void main()',
		'{',
			'vNormal = normal;',
			'grad = gradient;',
			'height = position[1];',

			'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
		'}'

	].join('\n'),

	fShader: [

		'uniform vec4 flatColor;',
		'uniform vec4 steepColor;',
		'uniform float heightThreshold;',
		'uniform float slopeThreshold;',
		'uniform float smoothFactor;',
		'varying float grad;',
		'varying float height;',
		'varying vec3 vNormal;',

		'void main()',
		'{',
			'vec3 light = vec3(0.5, 0.4, 1.0);',
			'light = normalize(light);',
			'float dProd = max(0.0, dot(light, vNormal));',

			'vec4 color = (height < heightThreshold) ? flatColor + (steepColor-flatColor) * clamp((grad-slopeThreshold)/smoothFactor, 0.0, 1.0) : flatColor + (steepColor-flatColor) * clamp((grad-slopeThreshold)/smoothFactor, 0.0, 1.0);',

			'gl_FragColor = color * vec4(dProd, dProd, dProd, 1.0);',
		'}'

	].join('\n')

};

export default slopeColorShader