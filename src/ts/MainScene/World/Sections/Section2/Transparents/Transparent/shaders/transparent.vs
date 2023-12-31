uniform float uSectionViewing;
uniform float uVisibility;
attribute vec4 tangent;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPos;
varying vec3 vWorldPos;

#pragma glslify: rotate = require('./rotate.glsl' )

/*-------------------------------
	ShadowMap
-------------------------------*/

#include <shadowmap_pars_vertex>

void main( void ) {

	/*-------------------------------
		Position
	-------------------------------*/

	vec3 pos = position;
	mat2 rot = rotate( ( 1.0 - uSectionViewing ) * 5.0 );
	pos.xy *= rot;
	pos *= uVisibility;

	vec4 worldPos = modelMatrix * vec4( pos, 1.0 );
	vec4 mvPosition = viewMatrix * worldPos;
	
	gl_Position = projectionMatrix * mvPosition;

	/*-------------------------------
		Normal / Tangent
	-------------------------------*/

	vec3 transformedNormal = normalMatrix * normal;
	transformedNormal.xy *= rot;
	vec3 normal = normalize( transformedNormal );

	/*-------------------------------
		Varying
	-------------------------------*/
	
	vUv = uv;
	vNormal = normal;
	vViewPos = -mvPosition.xyz;
	vWorldPos = worldPos.xyz;
	
}