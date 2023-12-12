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
    new THREE.PlaneGeometry( 20, 20 ),
    new THREE.MeshBasicMaterial( {
        side : THREE.DoubleSide,
        visible : false
    } )
);
planeMesh.rotateX( Math.PI / 2 );
planeMesh.name = 'ground';
scene.add( planeMesh );

//grid helper
const gridHelper = new THREE.GridHelper( 20, 20 );
scene.add( gridHelper );

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


// variables for event listener

let mousePosition = new THREE.Vector2();
let raycaster = new THREE.Raycaster();
let intersects;

//window event listener for sub-plane geometry 
window.addEventListener( 'mousemove', function ( e ) {
	mousePosition.x = ( e.clientX / window.innerWidth ) * 2 - 1;
	mousePosition.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
	raycaster.setFromCamera( mousePosition, camera );
	intersects = raycaster.intersectObjects( scene.children );
	intersects.forEach( intersect => {
		if ( intersect.object.name = 'ground' ) {
			const highlightPos = new THREE.Vector3().copy( intersect.point ).floor().addScalar( 0.5 );
			highlightMesh.position.set( highlightPos.x, 0 , highlightPos.z );
		};
	});
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