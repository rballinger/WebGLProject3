/**
 * Created by Ryan on 3/23/2015.
 */

/* Note: when viewed in browser to the user the coordinate system is:
 *                   +y |
 *                      |___ +x
 *                  +z /
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
    camera.position.set(225, 100, 120);
    camera.lookAt(scene.position);

    // declare the rendering loop
    var onRenderFcts= [];

    // handle window resize events
    var winResize	= new THREEx.WindowResize(renderer, camera);

    //////////////////////////////////////////////////////////////////////////////////
    //		lighting					//
    //////////////////////////////////////////////////////////////////////////////////

    var ambientLight= new THREE.AmbientLight( 0x343434 );
    ambientLight.position.set(0, 20, 0);
    scene.add( ambientLight);
    var backLight	= new THREE.DirectionalLight('white', 2.0);
    backLight.position.set(100, 50, -150);
    scene.add( backLight );
    var helper2 = new THREE.DirectionalLightHelper(backLight, 20);
    scene.add(helper2);

    //////////////////////////////////////////////////////////////////////////////////
    //		add an object and make it move					//
    //////////////////////////////////////////////////////////////////////////////////

    var tran = new THREE.Vector3();
    var quat = new THREE.Quaternion();
    var vscale = new THREE.Vector3();

    var car_cf = new THREE.Matrix4();
    car_cf.makeTranslation(75, 0, 35);
    car_cf.multiply(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(-90)));
    car_cf.multiply(new THREE.Matrix4().makeRotationZ(THREE.Math.degToRad(-90)));
    car_cf.decompose(tran, quat, vscale);

    // add car
    var car = new Car();
    // set car to car_cf
    car.position.copy(tran);
    car.quaternion.copy(quat);
    scene.add(car);

    // headlight coord frames
    var lightR_cf;
    var lightL_cf;
    // add headlights
    var lightR = new THREE.SpotLight('white', 10, 100, Math.PI/6, 1);
    lightR.target.position.set(-1000, 0, 0);
    lightR.target.updateMatrixWorld();
    var lightL = new THREE.SpotLight('white', 10, 100, Math.PI/6, 1);
    lightL.target.position.set(-1000, 0, 0);
    lightL.target.updateMatrixWorld();
    scene.add(lightR);
    scene.add(lightL);

    // ground 
    var groundPlane = new THREE.PlaneBufferGeometry(250, 250, 5, 5);
    //var groundPlane = new Ground();
    var asphaltTex = THREE.ImageUtils.loadTexture("textures/asphalt.jpg");
    asphaltTex.repeat.set(20, 20);
    asphaltTex.wrapS = THREE.MirroredRepeatWrapping;
    asphaltTex.wrapT = THREE.RepeatWrapping;
	var groundMat = new THREE.MeshPhongMaterial({color:0x696969, map:asphaltTex});
	var ground = new THREE.Mesh(groundPlane, groundMat);
    ground.rotateX(THREE.Math.degToRad(-90));
    scene.add(ground);

	// street light with curb
	var streetLight = new StreetLight();
    streetLight.rotateY(THREE.Math.degToRad(90));
    console.log(streetLight.position);
    streetLight.position.set(0, 8, 10);
	scene.add(streetLight);
    // spotlight for streetlight
    var streetLamp	= new THREE.SpotLight('white', 10, 40, Math.PI/4);
    streetLamp.position.set(8, 22, 16);
    streetLamp.target.position.set(8, 0, 16);
    streetLamp.target.updateMatrixWorld();
    scene.add( streetLamp );
    var helper = new THREE.SpotLightHelper(streetLamp);
    scene.add(helper);

	// UFO
	var ufo = new UFO();
	scene.add(ufo);

	// Weather vane base
	var vaneBase = new WeatherVaneBase();
	scene.add(vaneBase);

    onRenderFcts.push(function(delta, now){
        // old code
        //mesh.rotateX(0.5 * delta);
        //mesh.rotateY(2.0 * delta);
        //coneMesh.rotateZ(0.5 * delta);
    });

    //////////////////////////////////////////////////////////////////////////////////
    //		Camera Controls							//
    //////////////////////////////////////////////////////////////////////////////////
    var mouse	= {x : 0, y : 0};
    document.addEventListener('mousemove', function(event){
        mouse.x	= (event.clientX / window.innerWidth ) - 0.5;
        mouse.y	= (event.clientY / window.innerHeight) - 0.5;
    }, false);

    var speed = 5.0;
    var carSpeed = 0;
    var shift = false;  // if shift is being held or not
    var selected_obj = camera;
    document.addEventListener('keydown', function(event){
        switch(event.which){
            /**** to select objects ******/
            case 84:    // 't' to select car
                selected_obj = car;
                break;
            case 67:    // 'c' to select camera
                selected_obj = camera;
                break;
            /**** hold shift to rotate objects *****/
            case 16:    // hold shift to rotate objects
                shift = true;
                break;
            /**** for moving/rotating selected object ******/
            case 65:    // 'a' moves along normal +z-axis, rotates on +y-axis
                if(shift)
                    selected_obj.rotateY(THREE.Math.degToRad(speed));
                else
                    selected_obj.position.z += speed;
                break;
            case 68:    // 'd' moves along normal -z-axis, rotates on -y-axis
                if(shift)
                    selected_obj.rotateY(THREE.Math.degToRad(-speed));
                else
                    selected_obj.position.z -= speed;
                break;
            case 69:    // 'e' moves along normal +x-axis, rotates on -z-axis
                if(shift)
                    selected_obj.rotateZ(THREE.Math.degToRad(-speed));
                else
                    selected_obj.position.x += speed;
                break;
            case 81:    // 'q' moves along normal -x-axis, rotates on +z-axis
                if(shift)
                    selected_obj.rotateZ(THREE.Math.degToRad(speed));
                else
                    selected_obj.position.x -= speed;
                break;
            case 87:    // 'w' moves along normal +y-axis, rotates on +x-axis
                if(shift)
                    selected_obj.rotateX(THREE.Math.degToRad(speed));
                else
                    selected_obj.position.y += speed;
                break;
            case 83:    // 's' moves along normal -y-axis, rotates on -x-axis
                if(shift)
                    selected_obj.rotateX(THREE.Math.degToRad(-speed));
                else
                    selected_obj.position.y -= speed;
                break;
            /***** other stuff ******/
            case 73:    // 'i' "drive" car forward when it's selected
                if(selected_obj == car) {
                    carSpeed += 0.1;
                    car_cf.multiply(new THREE.Matrix4().makeTranslation(0, -carSpeed, 0));
                    car.rotateTires(carSpeed);
                }
                break;
            case 75:    // 'k' to drive car backward when it's selected
                if(selected_obj == car) {
                    carSpeed += 0.1;
                    car_cf.multiply(new THREE.Matrix4().makeTranslation(0, carSpeed, 0));
                    car.rotateTires(-carSpeed);
                }
                break;
        }
    }, false);

    document.addEventListener('keyup', function(event){
        switch(event.which) {
            case 16:    // release shift to go back to translating instead of rotating
                shift = false;
                break;
            case 73:    // release drive forward key to stop car
                carSpeed = 0;
                break;
            case 75:    // release drive backward key to stop car
                carSpeed = 0;
                break;
        }
    }, false);

    onRenderFcts.push(function(delta, now){
        car_cf.decompose(tran, quat, vscale);
        car.position.copy(tran);
        car.quaternion.copy(quat);

        lightR_cf = new THREE.Matrix4().copy(car_cf);
        lightR_cf.multiply(new THREE.Matrix4().makeTranslation(0.5, 0, car.offGround + car.chassisHeight - 0.5));
        lightR_cf.decompose(tran, quat, vscale);
        lightR.position.copy(tran);
        lightR.quaternion.copy(quat);

        lightL_cf = new THREE.Matrix4().copy(lightR_cf);
        lightL_cf.multiply(new THREE.Matrix4().makeTranslation(car.chassisWidth - 1, 0, 0))
        lightL_cf.decompose(tran, quat, vscale);
        lightL.position.copy(tran);
        lightL.quaternion.copy(quat);
    });

    //////////////////////////////////////////////////////////////////////////////////
    //		render the scene						//
    //////////////////////////////////////////////////////////////////////////////////
    onRenderFcts.push(function(){
        renderer.render( scene, camera );



    });

    //////////////////////////////////////////////////////////////////////////////////
    //		Rendering Loop runner						//
    //////////////////////////////////////////////////////////////////////////////////
    var lastTimeMsec= null;
    requestAnimationFrame(function animate(nowMsec){
        // keep looping
        requestAnimationFrame( animate );
        // measure time
        lastTimeMsec	= lastTimeMsec || nowMsec-1000/60;
        var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec);
        lastTimeMsec	= nowMsec;
        // call each update function
        onRenderFcts.forEach(function(onRenderFct){
            onRenderFct(deltaMsec/1000, nowMsec/1000)
        })
    })
})
