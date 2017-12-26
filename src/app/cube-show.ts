/// <reference path="../typings/_reference-three.d.ts" />
//import {Scene, Clock, Raycaster, WebGLRenderer, PerspectiveCamera, Mesh, RingGeometry, MeshBasicMaterial} from '../../node_modules/@types/three/index';
//import {AxisHelper, BoxGeometry, HemisphereLight, DirectionalLight, MeshLambertMaterial, Vector3} from '../../node_modules/@types/three/index';


export class CubeShow {

    static appScene: THREE.Scene;
    static appRender: THREE.WebGLRenderer;
    static appCamera: THREE.PerspectiveCamera;
    static showClock: THREE.Clock;
    
    static raycaster: THREE.Raycaster;
    static isMouseDown = false;
    static INTERSECTED: any;
    static crosshair: THREE.Raycaster;
    static room: THREE.Mesh;
 
    constructor(showElement: HTMLElement) {
        showElement.innerHTML = 'Hi';
        this.init(showElement);
    }

    init(showElement: HTMLElement) {
        CubeShow.showClock = new THREE.Clock();
        var appScene = new THREE.Scene();
        CubeShow.appScene = appScene;

        this.addCameraAndControls();

        CubeShow.raycaster = new THREE.Raycaster();
        var appRender = new THREE.WebGLRenderer( { antialias: true } );
        CubeShow.appRender = appRender;
        appRender.setPixelRatio( window.devicePixelRatio );
        CubeShow.onWindowResize();
        appRender.vr.enabled = true;
        showElement.appendChild( appRender.domElement );
        showElement.appendChild( WEBVR.createButton( appRender ) );

        window.addEventListener("resize", CubeShow.onWindowResize, false);
        
        appRender.domElement.addEventListener( 'mousedown', CubeShow.onMouseDown, false );
        appRender.domElement.addEventListener( 'mouseup', CubeShow.onMouseUp, false );
        appRender.domElement.addEventListener( 'touchstart', CubeShow.onMouseDown, false );
        appRender.domElement.addEventListener( 'touchend', CubeShow.onMouseUp, false );
              
        window.addEventListener( 'vrdisplaypointerrestricted', CubeShow.onPointerRestricted, false );
        window.addEventListener( 'vrdisplaypointerunrestricted', CubeShow.onPointerUnrestricted, false );
        
        this.addShowObjects();
        
        var info = document.createElement( 'div' );
        info.style.position = 'absolute';
        info.style.top = '50px';
        info.style.width = '100%';
        info.style.textAlign = 'center';
        info.innerHTML = '<a href="http://threejs.org" target="_blank" rel="noopener">three.js - cube vr</a>';
        showElement.appendChild( info );
        
        CubeShow.animate();
    }

    start() {

    }

    static onWindowResize() {
        var height = window.innerHeight;
        CubeShow.appRender.setSize(window.innerWidth, height);
        CubeShow.appCamera.aspect = window.innerWidth / height;
        CubeShow.appCamera.updateProjectionMatrix();
    }

    addCameraAndControls(): void {
        var fov = 70;
        var aspect = this.getCameraAspect();
        var near = 0.1;
        var far = 10;
        var appCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        CubeShow.appCamera = appCamera;
  
        CubeShow.appScene.add( appCamera );
  
        var crosshair = new THREE.Mesh(
           new THREE.RingGeometry( 0.02, 0.04, 32 ),
           new THREE.MeshBasicMaterial( {
              color: 0xffffff,
              opacity: 0.5,
              transparent: true
           } )
        );
        crosshair.position.z = - 2;
        appCamera.add( crosshair );
    }

     getCameraAspect(): number {
        var height = window.innerHeight;
        return window.innerWidth / height;
    }

    addShowObjects(): void {
        var axisHelper = new THREE.AxisHelper(200);
        //CubeShow.appScene.add(axisHelper);
  
        var room = new THREE.Mesh(
            new THREE.BoxGeometry( 6, 6, 6, 8, 8, 8 ),
            new THREE.MeshBasicMaterial( { color: 0x404040, wireframe: true } )
        );
        CubeShow.room = room;
        //room.position.y = 3;
        CubeShow.appScene.add( room );
        CubeShow.appScene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );
        var light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 ).normalize();
        CubeShow.appScene.add( light );
  
        var geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
        for ( var i = 0; i < 200; i ++ ) {
          var object = new THREE.Mesh(
            geometry,
            new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } )
          );
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
          room.add( object );
        }
    }
  
    static onMouseDown() {
       CubeShow.isMouseDown = true;
    }
  
    static onMouseUp() {
       CubeShow.isMouseDown = false;
    }
  
    static onPointerRestricted() {
       var pointerLockElement = CubeShow.appRender.domElement;
       if ( pointerLockElement && typeof(pointerLockElement.requestPointerLock) === 'function' ) {
          pointerLockElement.requestPointerLock();
       }
    }
  
    static onPointerUnrestricted() {
       var currentPointerLockElement = document.pointerLockElement;
       var expectedPointerLockElement = CubeShow.appRender.domElement;
       if ( currentPointerLockElement && currentPointerLockElement === expectedPointerLockElement && typeof(document.exitPointerLock) === 'function' ) {
          document.exitPointerLock();
       }
    }

    static animate() {
        requestAnimationFrame( CubeShow.animate );
    
        var delta = CubeShow.showClock.getDelta() * 60;
        var room = CubeShow.room;
        if ( CubeShow.isMouseDown === true ) {
           var cube = room.children[ 0 ];
           room.remove( cube );
           cube.position.set( 0, 0, - 0.75 );
           cube.position.applyQuaternion( CubeShow.appCamera.quaternion );
           cube.userData.velocity.x = ( Math.random() - 0.5 ) * 0.02 * delta;
           cube.userData.velocity.y = ( Math.random() - 0.5 ) * 0.02 * delta;
           cube.userData.velocity.z = ( Math.random() * 0.01 - 0.05 ) * delta;
           cube.userData.velocity.applyQuaternion( CubeShow.appCamera.quaternion );
           room.add( cube );
        }
        // find intersections
        CubeShow.raycaster.setFromCamera( { x: 0, y: 0 }, CubeShow.appCamera );
        var intersects = CubeShow.raycaster.intersectObjects( room.children );
        if ( intersects.length > 0 ) {
           if ( CubeShow.INTERSECTED != intersects[ 0 ].object ) {
              if ( CubeShow.INTERSECTED ) {
                 CubeShow.INTERSECTED.material.emissive.setHex( CubeShow.INTERSECTED.currentHex );
              }
              CubeShow.INTERSECTED = intersects[ 0 ].object;
              CubeShow.INTERSECTED.currentHex = CubeShow.INTERSECTED.material.emissive.getHex();
              CubeShow.INTERSECTED.material.emissive.setHex( 0xff0000 );
           }
         } else {
           if ( CubeShow.INTERSECTED ) CubeShow.INTERSECTED.material.emissive.setHex( CubeShow.INTERSECTED.currentHex );
           CubeShow.INTERSECTED = undefined;
         }
         // Keep cubes inside room
         for ( var i = 0; i < room.children.length; i ++ ) {
             var cube = room.children[ i ];
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
    
        if (CubeShow.appRender != null) {
            try {
                CubeShow.appRender.render(CubeShow.appScene, CubeShow.appCamera);
            } catch(error) {
                console.error("CubeShow render error " + error);
            }
        } else {
            console.error("CubeShow appRender is null");
        }
    }
}