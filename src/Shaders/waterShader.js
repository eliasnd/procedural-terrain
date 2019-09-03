const waterShader = {

	vShader: [

		'uniform sampler2D heightmap;',
		'varying vec3 vNormal;',

		'void main()',
		'{',
			'float height = texture2D(heightmap, uv).y;',
			'vec3 newPos = vec3(position.x, height, position.z);',
			'vNormal = normal;',

			'gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);',
		'}'

	].join('\n'),

	fShader: [

		'uniform vec4 waterColor;',
		'varying vec3 vNormal;',

		'void main()',
		'{',
			'vec3 light = vec3(0.5, 0.4, 1.0);',
			'light = normalize(light);',
			'float dProd = max(0.0, dot(light, vNormal));',

			'gl_FragColor = waterColor * vec4(dProd, dProd, dProd, 0.7);',
		'}'

	].join('\n')
};

export default waterShader;