import * as THREE from 'three';
import * as ORE from 'ore-three';

import windVert from './shaders/wind.vs';
import windFrag from './shaders/wind.fs';

export class Wind extends THREE.Mesh {

	private animator: ORE.Animator;
	private commonUniforms: ORE.Uniforms;
	private animatorId: string;

	constructor( parentUniforms?: ORE.Uniforms ) {

		let num = 20;
		let range = new THREE.Vector3( 50, 10, 10 );

		let animatorId = Math.floor( Math.random() * 10000 ).toString();

		let offsetPosArray: number[] = [];
		let numArray: number[] = [];

		for ( let i = 0; i < num; i ++ ) {

			offsetPosArray.push(
				Math.random() * range.x,
				Math.random() * range.y,
				Math.random() * range.z,
			);

			numArray.push( i );

		}

		let originGeo = new THREE.PlaneGeometry( 5.0, 0.01, 10.0, 1.0 );

		let geo = new THREE.InstancedBufferGeometry();
		geo.setAttribute( 'position', originGeo.getAttribute( 'position' ) );
		geo.setAttribute( 'uv', originGeo.getAttribute( 'uv' ) );
		geo.setAttribute( 'normal', originGeo.getAttribute( 'normal' ) );
		geo.setIndex( originGeo.getIndex() );

		geo.setAttribute( 'offsetPos', new THREE.InstancedBufferAttribute( new Float32Array( offsetPosArray ), 3 ) );
		geo.setAttribute( 'num', new THREE.InstancedBufferAttribute( new Float32Array( numArray ), 1 ) );

		let uni = ORE.UniformsLib.mergeUniforms( parentUniforms, {
			range: {
				value: range
			},
			total: {
				value: num
			},
			noiseTex: window.gManager.assetManager.getTex( 'noise' )
		} );

		/*-------------------------------
			Animator
		-------------------------------*/

		let animator = window.gManager.animator;

		uni.uVisibility = animator.add( {
			name: 'windVisibility' + animatorId,
			initValue: 1,
			userData: {
				pane: {}
			}
		} );

		let mat = new THREE.ShaderMaterial( {
			vertexShader: windVert,
			fragmentShader: windFrag,
			uniforms: uni,
			side: THREE.DoubleSide,
			depthTest: false,
			blending: THREE.AdditiveBlending
		} );

		super( geo, mat );

		this.commonUniforms = uni;
		this.animator = animator;
		this.animatorId = animatorId;

		/*-------------------------------
			Dispose
		-------------------------------*/

		const onDispose = () => {

			geo.dispose();
			mat.dispose();

			this.removeEventListener( 'dispose', onDispose );

		};

		this.addEventListener( 'dispose', onDispose );

	}

	public switchVisibility( visible: boolean, duration: number = 1 ) {

		if ( visible ) this.visible = true;

		this.animator.animate( 'windVisibility' + this.animatorId, visible ? 1 : 0, duration, () => {

			if ( ! visible ) this.visible = false;

		} );

	}

	public dispose() {

		this.dispatchEvent( { type: 'dispose' } );

	}

}
