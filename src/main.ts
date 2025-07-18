import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import GUI from 'lil-gui';

let offset = new THREE.Vector3(0, 0, 0);

let cameraRelativePosition = new THREE.Vector3(20, 20, 20);

let controlsTargetRelative = new THREE.Vector3(0, 0, 0);

let font: any = undefined;

const guiParams = {
	offset: offset.x
};

const textMeshes: THREE.Mesh[] = [];

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.copy(cameraRelativePosition).add(offset);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.copy(controlsTargetRelative).add(offset);
controls.zoomToCursor = true;
delete controls.mouseButtons.LEFT;
controls.mouseButtons.MIDDLE = THREE.MOUSE.PAN;
controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);

const groundPlane = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x676767, side: THREE.DoubleSide });
const groundPlaneMesh = new THREE.Mesh(groundPlane, planeMaterial);
groundPlaneMesh.rotation.x = -Math.PI / 2;
groundPlaneMesh.receiveShadow = true;

scene.add(gridHelper);
scene.add(groundPlaneMesh);

function updateOffset(newOffset: THREE.Vector3): void
{
	offset.copy(newOffset);

	camera.position.copy(cameraRelativePosition).add(offset);
	controls.target.copy(controlsTargetRelative).add(offset);
	gridHelper.position.copy(offset);
	groundPlaneMesh.position.copy(offset);

	recreateTexts();
}

function loadFont(): void
{
	const loader = new FontLoader();
	loader.load('fonts/helvetiker_regular.typeface.json', function (response)
	{
		font = response;
		recreateTexts();
	});
}

function recreateTexts(): void
{
	if (textMeshes.length > 0)
	{
		textMeshes.forEach(textMesh =>
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
		});
	}

	if (!font) return;

	const createTextMesh = (text: string, color: THREE.ColorRepresentation) =>
	{
		const textGeometry = new TextGeometry(text, {
			font: font,
			size: 1.5,
			height: 0.5,
			curveSegments: 12,
			bevelEnabled: true,
			bevelThickness: 0.1,
			bevelSize: 0.1,
			bevelOffset: 0,
			bevelSegments: 1
		});
		textGeometry.center();
		textGeometry.rotateX(-Math.PI / 2);

		const textMaterial = new THREE.MeshLambertMaterial({ color: color });
		const textMesh = new THREE.Mesh(textGeometry, textMaterial);
		textMesh.castShadow = true;

		return textMesh;
	}

	const zOffset = 5;
	const mesh1 = createTextMesh('GeometryOffset', 0x2f73ff);
	mesh1.position.set(0, 0.1, zOffset);
	mesh1.geometry.translate(offset.x, offset.y, offset.z);

	const mesh2 = createTextMesh('PositionOffset', 0xf9c32f);
	mesh2.position.set(0, 0.1, -zOffset).add(offset);

	scene.add(mesh1);
	scene.add(mesh2);
}

function createLights(): { ambient: THREE.AmbientLight; directional: THREE.DirectionalLight }
{
	const ambientLight = new THREE.AmbientLight(0x676767, 0.3);

	const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
	directionalLight.position.set(-20, 20, 20);

	return { ambient: ambientLight, directional: directionalLight };
}

function setupGUI(): void
{
	const gui = new GUI();
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
	const lights = createLights();
	scene.add(lights.ambient);
	scene.add(lights.directional);

	loadFont();

	setupGUI();
	setupEventListeners();
	animate();
}

initializeScene(); 