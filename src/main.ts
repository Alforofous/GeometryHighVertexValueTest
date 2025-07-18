import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import GUI from 'lil-gui';

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let gui: GUI;
let textMesh: THREE.Mesh;
let groundPlane: THREE.Mesh;
let ambientLight: THREE.AmbientLight;
let directionalLight: THREE.DirectionalLight;
let gridHelper: THREE.GridHelper;

let offset = new THREE.Vector3(0, 0, 0);

let cameraRelativePosition = new THREE.Vector3(20, 20, 20);

let controlsTargetRelative = new THREE.Vector3(0, 0, 0);

let font: any = undefined;

const guiParams = {
	offset: offset.x
};

function updateOffset(newOffset: THREE.Vector3): void
{
	offset.copy(newOffset);

	camera.position.copy(cameraRelativePosition).add(offset);
	controls.target.copy(controlsTargetRelative).add(offset);

	groundPlane.position.copy(offset);
	gridHelper.position.copy(offset);
	ambientLight.position.copy(offset);
	directionalLight.position.set(10, 10, 5);

	recreateText();
}

function loadFont(): void
{
	const loader = new FontLoader();
	loader.load('fonts/helvetiker_regular.typeface.json', function (response)
	{
		font = response;
		recreateText();
	});
}

function recreateText(): void
{
	if (textMesh)
	{
		scene.remove(textMesh);
		textMesh.geometry.dispose();
		if (Array.isArray(textMesh.material))
		{
			textMesh.material.forEach(material => material.dispose());
		} else
		{
			textMesh.material.dispose();
		}
	}

	if (!font) return;

	const textGeometry = new TextGeometry('THREEJS', {
		font: font,
		size: 3,
		height: 0.5,
		curveSegments: 12,
		bevelEnabled: false
	});
	textGeometry.center();
	textGeometry.rotateX(-Math.PI / 2);

	textGeometry.translate(offset.x, offset.y, offset.z);

	const textMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
	textMesh = new THREE.Mesh(textGeometry, textMaterial);
	textMesh.position.set(0, 0.1, 0);
	textMesh.castShadow = true;

	scene.add(textMesh);
}

function createScene(): THREE.Scene
{
	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x1a1a1a);
	return scene;
}

function createCamera(): THREE.PerspectiveCamera
{
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.copy(cameraRelativePosition).add(offset);
	return camera;
}

function createRenderer(): THREE.WebGLRenderer
{
	const renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	document.body.appendChild(renderer.domElement);
	return renderer;
}

function setupOrbitControls(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer): OrbitControls
{
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.target.copy(controlsTargetRelative).add(offset);
	controls.zoomToCursor = true;
	delete controls.mouseButtons.LEFT;
	controls.mouseButtons.MIDDLE = THREE.MOUSE.PAN;
	controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
	controls.enableDamping = true;
	controls.dampingFactor = 0.05;
	return controls;
}

function createGridHelper(): THREE.GridHelper
{
	const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
	gridHelper.position.copy(offset);
	return gridHelper;
}

function createGroundPlane(): THREE.Mesh
{
	const planeGeometry = new THREE.PlaneGeometry(20, 20);
	const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x676767, side: THREE.DoubleSide });
	const plane = new THREE.Mesh(planeGeometry, planeMaterial);
	plane.rotation.x = -Math.PI / 2;
	plane.receiveShadow = true;
	plane.position.copy(offset);
	return plane;
}

function createLights(): { ambient: THREE.AmbientLight; directional: THREE.DirectionalLight }
{
	const ambientLight = new THREE.AmbientLight(0x676767, 0.6);
	ambientLight.position.copy(offset);

	const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
	directionalLight.position.set(10, 10, 5).add(offset);

	return { ambient: ambientLight, directional: directionalLight };
}

function setupGUI(): void
{
	gui = new GUI();
	gui.title('Geometry Offset Test');

	const offsetFolder = gui.addFolder('Offset Controls');

	offsetFolder.add(guiParams, 'offset', 0, 5000000, 50000)
		.name('X Offset')
		.onChange((value: number) =>
		{
			guiParams.offset = value;
			updateOffset(new THREE.Vector3(value, 0, 0));
		});
	offsetFolder.open();
}

function setupEventListeners(): void
{
	window.addEventListener('resize', () =>
	{
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	});
}

function animate(): void
{
	requestAnimationFrame(animate);
	controls.update();

	cameraRelativePosition.copy(camera.position).sub(offset);
	controlsTargetRelative.copy(controls.target).sub(offset);

	renderer.render(scene, camera);
}

function initializeScene(): void
{
	scene = createScene();
	camera = createCamera();
	renderer = createRenderer();
	controls = setupOrbitControls(camera, renderer);

	gridHelper = createGridHelper();
	scene.add(gridHelper);

	groundPlane = createGroundPlane();
	scene.add(groundPlane);

	const lights = createLights();
	ambientLight = lights.ambient;
	directionalLight = lights.directional;
	scene.add(ambientLight);
	scene.add(directionalLight);

	loadFont();

	setupGUI();
	setupEventListeners();
	animate();
}

initializeScene(); 