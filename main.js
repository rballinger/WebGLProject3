/**
 * Created by Ryan on 3/23/2015.
 */

require([], function(){
    // detect WebGL
    if( !Detector.webgl ){
        Detector.addGetWebGLMessage();
        throw 'WebGL Not Available'
    }
    // setup webgl renderer full page
    var renderer	= new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    // setup a scene and camera
    var scene	= new THREE.Scene();
    var camera	= new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);

    camera.position.x = 20;
    camera.position.y = 20;
    camera.position.z = 20;

    // declare the rendering loop
    var onRenderFcts= [];

    // handle window resize events
    var winResize	= new THREEx.WindowResize(renderer, camera)

    //////////////////////////////////////////////////////////////////////////////////
    //		default 3 points lightning					//
    //////////////////////////////////////////////////////////////////////////////////

    var ambientLight= new THREE.AmbientLight( 0x020202 )
    scene.add( ambientLight)
    var aboveLight	= new THREE.SpotLight('white', 1.0, 30, 30, 2);
    aboveLight.position.set(0, 5, 1);
    scene.add( aboveLight )
    var backLight	= new THREE.DirectionalLight('white', 0.75)
    backLight.position.set(-0.5, -0.5, -2)
    scene.add( backLight )

    //////////////////////////////////////////////////////////////////////////////////
    //		add an object and make it move					//
    //////////////////////////////////////////////////////////////////////////////////

    var car_cf = new THREE.Matrix4();
    car_cf.makeTranslation(3, 0, 0);

    var tran = new THREE.Vector3();
    var quat = new THREE.Quaternion();
    var rot = new THREE.Quaternion();
    var vscale = new THREE.Vector3();

    // car_cf.multiply(new THREE.Matrix4().makeRotationZ(THREE.Math.degToRad(delta * 72)));
    car_cf.decompose(tran, quat, vscale);

    // add car
    var car = new Car(60);
    var carMat = new THREE.MeshPhongMaterial();
    var carMesh = new THREE.Mesh(car, carMat);
    carMesh.position.copy(tran);
    scene.add(carMesh);



    // add cylinder (actually cone)
    var cone = new THREE.CylinderGeometry(0, 0.5, 2);
    var coneMat = new THREE.MeshPhongMaterial();
    var coneMesh = new THREE.Mesh(cone, coneMat);
    scene.add(coneMesh);

    geometry	= new THREE.BoxGeometry( 1, 1, 1);
    material	= new THREE.MeshPhongMaterial();
    mesh	= new THREE.Mesh( geometry, material );
    scene.add( mesh );

    var groundPlane = new THREE.PlaneBufferGeometry(20, 20, 4, 4);
    var groundMat = new THREE.MeshPhongMaterial({color:0x1d6438, ambient:0x1d6438});
    var ground = new THREE.Mesh (groundPlane, groundMat);
    ground.rotateX(THREE.Math.degToRad(-90));
    scene.add (ground);

    onRenderFcts.push(function(delta, now){
        mesh.rotateX(0.5 * delta);
        mesh.rotateY(2.0 * delta);
        coneMesh.rotateZ(0.5 * delta);
    })

    //////////////////////////////////////////////////////////////////////////////////
    //		Camera Controls							//
    //////////////////////////////////////////////////////////////////////////////////
    var mouse	= {x : 0, y : 0}
    document.addEventListener('mousemove', function(event){
        mouse.x	= (event.clientX / window.innerWidth ) - 0.5
        mouse.y	= (event.clientY / window.innerHeight) - 0.5
    }, false)
    onRenderFcts.push(function(delta, now){
        //camera.position.x += (mouse.x*5 - camera.position.x) * (delta*3)
        //camera.position.y += (mouse.y*5 - camera.position.y) * (delta*3)
        //camera.rotate().x = 5;
        camera.lookAt( scene.position )
    })

    //////////////////////////////////////////////////////////////////////////////////
    //		render the scene						//
    //////////////////////////////////////////////////////////////////////////////////
    onRenderFcts.push(function(){
        renderer.render( scene, camera );
    })

    //////////////////////////////////////////////////////////////////////////////////
    //		Rendering Loop runner						//
    //////////////////////////////////////////////////////////////////////////////////
    var lastTimeMsec= null
    requestAnimationFrame(function animate(nowMsec){
        // keep looping
        requestAnimationFrame( animate );
        // measure time
        lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
        var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
        lastTimeMsec	= nowMsec
        // call each update function
        onRenderFcts.forEach(function(onRenderFct){
            onRenderFct(deltaMsec/1000, nowMsec/1000)
        })
    })
})