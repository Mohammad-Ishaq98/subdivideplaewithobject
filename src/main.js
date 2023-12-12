import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


//orbit controls
const orbit = new OrbitControls( camera, renderer.domElement );
orbit.update(); 

// camre position 
camera.position.set( 10, 15, -22 );

// plane mesh

const planeMesh = new THREE.Mesh( 
	new THREE.PlaneGeometry( 20 , 20 ),
	new THREE.MeshBasicMaterial( {
		side : THREE.DoubleSide,
		visible : false
	} ),
 );
planeMesh.rotateX( -Math.PI / 2 );
scene.add( planeMesh );
planeMesh.name = 'ground';
// grid helper

const girdHelper = new THREE.GridHelper( 20, 20 );
scene.add( girdHelper );

// highlight sqaure

const highlightMesh = new THREE.Mesh( 
	new THREE.PlaneGeometry( 1 , 1 ),
	new THREE.MeshBasicMaterial( {
		side : THREE.DoubleSide,
	} ),
 );
highlightMesh.position.set( 0.5 , 0, 0.5 );
highlightMesh.rotateX( -Math.PI / 2 );
scene.add( highlightMesh );

const mousePosition = new THREE.Vector2();//main
const raycaster = new THREE.Raycaster();//main
let intersects;//main

window.addEventListener( 'mousemove', function ( e ) {
	mousePosition.x = ( e.clientX / window.innerWidth ) * 2 - 1;////// main
	mousePosition.y = - ( e.clientY / window.innerHeight ) * 2 + 1;////// main
	raycaster.setFromCamera( mousePosition, camera );////// main
	intersects = raycaster.intersectObjects( scene.children );////// main
	intersects.forEach( function ( intersect ) {////// main
		if ( intersect.object.name === 'ground' ) {////// main
			const highlightPos = new THREE.Vector3().copy( intersect.point ).floor().addScalar( 0.5 );
			highlightMesh.position.set( highlightPos.x, 0 , highlightPos.z );

			const objectExist = objects.find( function ( object ) {
				return ( object.position.x === highlightMesh.position.x )
				&& ( object.position.z === highlightMesh.position.z )
			} );

			if( !objectExist ) highlightMesh.material.color.setHex( 0xFFFFFF );
			else highlightMesh.material.color.setHex( 0xFF0000 );
		}
	} ) ;
} );

// sphere mesh 
const sphereMesh = new THREE.Mesh(
	new THREE.SphereGeometry( 0.4, 4 , 2 ),
	new THREE.MeshBasicMaterial( {
		wireframe : true,
		color : 0xFFEA00
	} ) 
);

const objects = [];

window.addEventListener( 'mousedown', function () {
	const objectExist = objects.find( function ( object ) {//main
		return ( object.position.x === highlightMesh.position.x )//main
		&& ( object.position.z === highlightMesh.position.z )//main
	} );//main
	if ( !objectExist ) {//main
		intersects.forEach( function ( intersect ) {//main
			if ( intersect.object.name === 'ground' ) {//main
				const sphereClone = sphereMesh.clone();
				sphereClone.position.copy( highlightMesh.position );
				scene.add( sphereClone );
				objects.push( sphereClone );
				
			}
		} );
	}
	console.log( scene.children.length );
} );

function animate() {
	renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );

animate();

//window resize
window.addEventListener( 'resize', function () {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
} );