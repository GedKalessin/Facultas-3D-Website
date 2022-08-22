uniform float uSectionVisibility;
varying vec2 vUv;

void main( void ) {

	vec3 pos = position;
	pos *= uSectionVisibility;

	vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
	gl_Position = projectionMatrix * mvPosition;


	vUv = uv;

}