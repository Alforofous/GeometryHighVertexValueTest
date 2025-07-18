import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.zoomToCursor = true;
delete controls.mouseButtons.LEFT;
controls.mouseButtons.MIDDLE = THREE.MOUSE.PAN;
controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
scene.add(gridHelper);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

const redMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
const redCube = new THREE.Mesh(cubeGeometry, redMaterial);
redCube.position.set(-2, 0.5, 0);
redCube.castShadow = true;
redCube.receiveShadow = true;
scene.add(redCube);

const greenMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
const greenCube = new THREE.Mesh(cubeGeometry, greenMaterial);
greenCube.position.set(0, 0.5, 0);
greenCube.castShadow = true;
greenCube.receiveShadow = true;
scene.add(greenCube);

const blueMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff });
const blueCube = new THREE.Mesh(cubeGeometry, blueMaterial);
blueCube.position.set(2, 0.5, 0);
blueCube.castShadow = true;
blueCube.receiveShadow = true;
scene.add(blueCube);

const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

function animate()
{
	requestAnimationFrame(animate);

	controls.update();
	renderer.render(scene, camera);
}

window.addEventListener('resize', () =>
{
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

animate(); 