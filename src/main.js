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

// plane mesh
const planeMehs = new THREE.Mesh(
	new THREE.PlaneGeometry( 20, 20 ),
	new THREE.MeshBasicMaterial({
		side : THREE.DoubleSide,
		visible : false
	})
);
planeMehs.rotateX( -Math.PI / 2 );
scene.add( planeMehs );
planeMehs.name = 'ground';


//high light

const highlightSqureMesh = new THREE.Mesh( 
	new THREE.PlaneGeometry( 1, 1 ),
	new THREE.MeshBasicMaterial( {
		side : THREE.DoubleSide
	} )
 );
highlightSqureMesh.rotateX( -Math.PI / 2 );
highlightSqureMesh.position.set( 0.5, 0, 0.5 )
scene.add( highlightSqureMesh );

//grid
const grid = new THREE.GridHelper( 20, 20 );
scene.add(grid);

camera.position.set( 10, 15, -22 );

const mousePosition = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let intersects;

window.addEventListener( 'mousemove', function (e) {
	mousePosition.x = ( e.clientX / window.innerWidth ) * 2 - 1;
	mousePosition.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
	raycaster.setFromCamera( mousePosition, camera );
	intersects = raycaster.intersectObjects( scene.children );
	intersects.forEach( function (intersect) {
		if ( intersect.object.name === 'ground' ) {
			const highlightPos = new THREE.Vector3().copy( intersect.point ).floor().addScalar( 0.5 );
			highlightSqureMesh.position.set( highlightPos.x , 0 , highlightPos.z );
		}
	});
} );

function animate() {
	renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );

animate();