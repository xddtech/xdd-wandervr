/// <reference path="./typings/_reference-three.d.ts" />

var appClock = new THREE.Clock();
var appContainer;
var appCamera, appScene, appRaycaster, appRenderer;

var appRoom;
var isMouseDownBall = false;

var appINTERSECTED;
var appCrosshair;


class BallShow {

    init() {
        appContainer = document.createElement( 'div' );
        document.body.appendChild( appContainer );
        this.addAppInfo();

        appScene = new THREE.Scene();
        appScene.background = new THREE.Color( 0x505050 );

        appCamera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 10 );
        appScene.add( appCamera );
        this.addCrosshair();

        appScene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );
        var light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 ).normalize();
        appScene.add( light );

        appRaycaster = new THREE.Raycaster();
        
        appRenderer = new THREE.WebGLRenderer( { antialias: true } );
        appRenderer.setPixelRatio( window.devicePixelRatio );
        appRenderer.setSize( window.innerWidth, window.innerHeight );
        appRenderer.vr.enabled = true;
        appContainer.appendChild( appRenderer.domElement );
        
        appRenderer.domElement.addEventListener( 'mousedown', onMouseDownBall, false );
        appRenderer.domElement.addEventListener( 'mouseup', onMouseUpBall, false );
        appRenderer.domElement.addEventListener( 'touchstart', onMouseDownBall, false );
        appRenderer.domElement.addEventListener( 'touchend', onMouseUpBall, false );
        
        window.addEventListener( 'resize', onWindowResizeBall, false );
        window.addEventListener( 'vrdisplaypointerrestricted', onPointerRestrictedBall, false );
        window.addEventListener( 'vrdisplaypointerunrestricted', onPointerUnrestrictedBall, false );
        document.body.appendChild( WEBVR.createButton( appRenderer ) );
    }

    addAppInfo() {
        var info = document.createElement( 'div' );
        info.style.position = 'absolute';
        info.style.top = '10px';
        info.style.width = '100%';
        info.style.textAlign = 'center';
        info.innerHTML = 'Wonder Balls';
        appContainer.appendChild( info );
    }

    addCrosshair() {
        appCrosshair = new THREE.Mesh(
            new THREE.RingGeometry( 0.02, 0.04, 32 ),
            new THREE.MeshBasicMaterial( {
                color: 0xffffff,
                opacity: 0.5,
                transparent: true
            } )
        );
        appCrosshair.position.z = - 2;
        appCamera.add( appCrosshair );
    }

    start() {
        animateBall();
    }
}

function onMouseDownBall() {
    isMouseDownBall = true;
}

function onMouseUpBall() {
    isMouseDownBall = false;
}

function onPointerRestrictedBall() {
    var pointerLockElement = appRenderer.domElement;
    if ( pointerLockElement && typeof(pointerLockElement.requestPointerLock) === 'function' ) {
        pointerLockElement.requestPointerLock();
    }
}

function onPointerUnrestrictedBall() {
    var currentPointerLockElement = document.pointerLockElement;
    var expectedPointerLockElement = appRenderer.domElement;
    if ( currentPointerLockElement && currentPointerLockElement === expectedPointerLockElement && typeof(document.exitPointerLock) === 'function' ) {
        document.exitPointerLock();
    }
}

function onWindowResizeBall() {
    appCamera.aspect = window.innerWidth / window.innerHeight;
    appCamera.updateProjectionMatrix();
    appRenderer.setSize( window.innerWidth, window.innerHeight );
}

function animateBall() {
    appRenderer.animate( renderBall );
}

function renderBall() {
    var delta = appClock.getDelta() * 60;

    appRenderer.render( appScene, appCamera );
}

var ballShow = new BallShow();
ballShow.init();
ballShow.start();