/// <reference path="./typings/_reference-three.d.ts" />

var appClock = new THREE.Clock();
var appContainer;
var appCamera, appScene, appRaycaster, appRenderer;

var appRoom;
var isMouseDownBall = false;

var appINTERSECTED;
var appCrosshair;
var ballPickTime;
var pickSound;
var dogSound;


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

        this.addAppObjects();

        appScene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );
        var light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 ).normalize();
        appScene.add( light );

        var listener = new THREE.AudioListener();
        appCamera.add( listener );
        pickSound = new THREE.Audio( listener );
        var audioLoader = new THREE.AudioLoader();
        audioLoader.load( '/assets/ping_pong.mp3', function( buffer ) {
            pickSound.setBuffer( buffer );
            pickSound.setLoop( false );
            pickSound.setVolume( 0.5 );
        });

        var dogListener = new THREE.AudioListener();
        appCamera.add( dogListener );
        dogSound = new THREE.Audio( dogListener );
        var dogAudioLoader = new THREE.AudioLoader();
        dogAudioLoader.load( '/assets/dog.ogg', function( buffer ) {
            dogSound.setBuffer( buffer );
            dogSound.setLoop( false );
            dogSound.setVolume( 0.5 );
            dogSound.play();
        });

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
        document.body.appendChild( WEBVR.createButton( appRenderer) );
    }

    addAppObjects() {
        appRoom = new THREE.Mesh(
            new THREE.BoxGeometry( 6, 6, 6, 8, 8, 8 ),
            new THREE.MeshBasicMaterial( { color: 0x404040, wireframe: true } )
        );
        appScene.add( appRoom );

        var loader = new THREE.TextureLoader();
        var texture = loader.load("/assets/textures/lake-water-1.png");
        texture.wrapS = THREE.MirroredRepeatWrapping;
        texture.wrapT = THREE.MirroredRepeatWrapping;
        texture.repeat.set(1, 1);
        texture.flipY = false;
        var skyParam = {
          //color: 0xeeeeee,
          shininess: 1,
          specular: 0xffffff, 
          map: texture
        };
        var skyGeometry = new THREE.PlaneGeometry(6, 6, 8, 8);
        var skyMaterial = new THREE.MeshPhongMaterial( skyParam );
        var skyMesh = new THREE.Mesh(skyGeometry, skyMaterial );
        skyMesh.position.z = -3.1;
        appScene.add(skyMesh);

        var loader2 = new THREE.TextureLoader();
        var texture2 = loader.load("/assets/textures/sand.png");
        texture2.wrapS = THREE.MirroredRepeatWrapping;
        texture2.wrapT = THREE.MirroredRepeatWrapping;
        texture2.repeat.set(1, 1);
        texture2.flipY = false;
        var grdParam = {
          //color: 0xeeeeee,
          shininess: 1,
          specular: 0xffffff, 
          map: texture2
        };
        var grdGeometry = new THREE.PlaneGeometry(6, 6, 8, 8);
        var grdMaterial = new THREE.MeshPhongMaterial( grdParam );
        var grdMesh = new THREE.Mesh(grdGeometry, grdMaterial );
        grdMesh.rotation.x = -0.5 * Math.PI;
        grdMesh.position.y = -3.1;
        appScene.add(grdMesh);

        /*
        var geometry = new THREE.BoxGeometry( 0.15, 0.15, 0.15 );
        for ( var i = 0; i < 200; i ++ ) {
            var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
            object.position.x = Math.random() * 4 - 2;
            object.position.y = Math.random() * 4 - 2;
            object.position.z = Math.random() * 4 - 2;
        
            object.rotation.x = Math.random() * 2 * Math.PI;
            object.rotation.y = Math.random() * 2 * Math.PI;
            object.rotation.z = Math.random() * 2 * Math.PI;
        
            object.scale.x = Math.random() + 0.5;
            object.scale.y = Math.random() + 0.5;
            object.scale.z = Math.random() + 0.5;
        
            object.userData.velocity = new THREE.Vector3();
            object.userData.velocity.x = Math.random() * 0.01 - 0.005;
            object.userData.velocity.y = Math.random() * 0.01 - 0.005;
            object.userData.velocity.z = Math.random() * 0.01 - 0.005;
        
            appRoom.add( object );
        }
        */

        var ballGeom = new THREE.SphereGeometry(0.2, 20, 20 );
        for ( var i = 0; i < 20; i ++ ) {
            var object = new THREE.Mesh( ballGeom, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
            object.position.x = Math.random() * 4 - 2;
            object.position.y = Math.random() * 4 - 2;
            object.position.z = Math.random() * 4 - 2;
        
            object.rotation.x = Math.random() * 2 * Math.PI;
            object.rotation.y = Math.random() * 2 * Math.PI;
            object.rotation.z = Math.random() * 2 * Math.PI;
        
            object.userData.velocity = new THREE.Vector3();
            object.userData.velocity.x = Math.random() * 0.01 - 0.005;
            object.userData.velocity.y = Math.random() * 0.01 - 0.005;
            object.userData.velocity.z = Math.random() * 0.01 - 0.005;
        
            appRoom.add( object );
        }
    }

    addAppInfo() {
        var info = document.createElement( 'div' );
        info.style.position = 'absolute';
        info.style.top = '10px';
        info.style.width = '100%';
        info.style.textAlign = 'center';
        info.innerHTML = 'Wander Balls';
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

    if ( isMouseDownBall === true ) {
        var cube = appRoom.children[ 0 ];
        appRoom.remove( cube );
        
        cube.position.set( 0, 0, - 0.75 );
        cube.position.applyQuaternion( appCamera.quaternion );
        cube.userData.velocity.x = ( Math.random() - 0.5 ) * 0.02 * delta;
        cube.userData.velocity.y = ( Math.random() - 0.5 ) * 0.02 * delta;
        cube.userData.velocity.z = ( Math.random() * 0.01 - 0.05 ) * delta;
        cube.userData.velocity.applyQuaternion( appCamera.quaternion );
        appRoom.add( cube );
    }

    // find intersections
    appRaycaster.setFromCamera( { x: 0, y: 0 }, appCamera );
    var intersects = appRaycaster.intersectObjects( appRoom.children );
    if ( intersects.length > 0 ) {
        if ( appINTERSECTED != intersects[ 0 ].object ) {
            if ( appINTERSECTED ) appINTERSECTED.material.emissive.setHex( appINTERSECTED.currentHex );
            appINTERSECTED = intersects[ 0 ].object;
            appINTERSECTED.currentHex = appINTERSECTED.material.emissive.getHex();
            appINTERSECTED.material.emissive.setHex( 0xff0000 );
            ballPickTime = 0;
            pickSound.setVolume(0.5);
            pickSound.play();
            
            appINTERSECTED.userData.velocity.x = 2 * appINTERSECTED.userData.velocity.x + 0.0001;
            appINTERSECTED.userData.velocity.y = 2 * appINTERSECTED.userData.velocity.y + 0.0001;
            appINTERSECTED.userData.velocity.z = 2 * appINTERSECTED.userData.velocity.z + 0.0001;
        } else {
            ballPickTime += appClock.getDelta();
            if (ballPickTime > 2) {
                appINTERSECTED.userData.velocity.x = 2 * appINTERSECTED.userData.velocity.x + 0.0001;
                appINTERSECTED.userData.velocity.y = 2 * appINTERSECTED.userData.velocity.y + 0.0001;
                appINTERSECTED.userData.velocity.z = 2 * appINTERSECTED.userData.velocity.z + 0.0001;
                pickSound.setVolume(2);
                pickSound.play();
            }
        }
    } else {
        if ( appINTERSECTED ) appINTERSECTED.material.emissive.setHex( appINTERSECTED.currentHex );
        appINTERSECTED = undefined;
    }

    // Keep cubes inside room
    for ( var i = 0; i < appRoom.children.length; i ++ ) {
        var cube = appRoom.children[ i ];
        cube.userData.velocity.multiplyScalar( 1 - ( 0.001 * delta ) );
        cube.position.add( cube.userData.velocity );
        if ( cube.position.x < - 3 || cube.position.x > 3 ) {
            cube.position.x = THREE.Math.clamp( cube.position.x, - 3, 3 );
            cube.userData.velocity.x = - cube.userData.velocity.x;
        }
        if ( cube.position.y < - 3 || cube.position.y > 3 ) {
            cube.position.y = THREE.Math.clamp( cube.position.y, - 3, 3 );
            cube.userData.velocity.y = - cube.userData.velocity.y;
        }
        if ( cube.position.z < - 3 || cube.position.z > 3 ) {
            cube.position.z = THREE.Math.clamp( cube.position.z, - 3, 3 );
            cube.userData.velocity.z = - cube.userData.velocity.z;
        }
        cube.rotation.x += cube.userData.velocity.x * 2 * delta;
        cube.rotation.y += cube.userData.velocity.y * 2 * delta;
        cube.rotation.z += cube.userData.velocity.z * 2 * delta;
    }

    appRenderer.render( appScene, appCamera );
}

var ballShow = new BallShow();
ballShow.init();
ballShow.start();