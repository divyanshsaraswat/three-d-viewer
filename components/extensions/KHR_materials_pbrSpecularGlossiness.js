/**
 * KHR_materials_pbrSpecularGlossiness extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_pbrSpecularGlossiness
 */
import * as THREE from 'three';

class KHRMaterialsPbrSpecularGlossinessExtension {
	constructor( parser ) {

		this.name = 'KHR_materials_pbrSpecularGlossiness';
		this.parser = parser;

	}

	getMaterialType( materialIndex ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return THREE.MeshPhysicalMaterial;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const pending = [];

		const extension = materialDef.extensions[ this.name ];

		materialParams.color = new THREE.Color( 1.0, 1.0, 1.0 );
		materialParams.opacity = 1.0;

		const diffuseFactor = extension.diffuseFactor;

		if ( diffuseFactor !== undefined ) {

			materialParams.color.fromArray( diffuseFactor );
			materialParams.opacity = diffuseFactor[ 3 ];

		}

		if ( extension.diffuseTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'map', extension.diffuseTexture ) );

		}

		materialParams.emissive = new THREE.Color( 0.0, 0.0, 0.0 );
		materialParams.glossiness = extension.glossinessFactor !== undefined ? extension.glossinessFactor : 1.0;
		materialParams.specular = new THREE.Color( 1.0, 1.0, 1.0 );

		const specularFactor = extension.specularGlossinessTexture;

		if ( specularFactor !== undefined ) {

			materialParams.specular.fromArray( specularFactor );
			materialParams.glossiness = specularFactor[ 3 ];

		}

		if ( extension.specularGlossinessTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'specularMap', extension.specularGlossinessTexture ) );
			pending.push( parser.assignTexture( materialParams, 'glossinessMap', extension.specularGlossinessTexture ) );

		}

		return Promise.all( pending );

	}
}

export { KHRMaterialsPbrSpecularGlossinessExtension };