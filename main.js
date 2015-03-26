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
    camera.position.set(75, 50, 75);// 150 100 125
    camera.lookAt(scene.position);

    // declare the rendering loop
    var onRenderFcts= [];

    // handle window resize events
    var winResize	= new THREEx.WindowResize(renderer, camera);

    //////////////////////////////////////////////////////////////////////////////////
    //		default 3 points lightning					//
    //////////////////////////////////////////////////////////////////////////////////

    var ambientLight= new THREE.AmbientLight( 0x020202 );
    ambientLight.position.set(0, 20, 0);
    //scene.add( ambientLight);
    var aboveLight	= new THREE.SpotLight('white', 1.0, 30, 60, 2);
    aboveLight.position.set(0, 20, 0);
    scene.add( aboveLight );
    var helper = new THREE.SpotLightHelper(aboveLight);
    //scene.add(helper);
    var backLight	= new THREE.DirectionalLight('white', 1.0);
    backLight.position.set(0, 10, 20);
    //scene.add( backLight );
    var backLight2	= new THREE.DirectionalLight('white', 1.0);
    backLight2.position.set(-20, 10, 20);
    scene.add( backLight2 );
    var backLight3	= new THREE.DirectionalLight('white', 1.0);
    backLight3.position.set(20, 10, 0);
    //scene.add( backLight3 );

    var lightR	= new THREE.SpotLight('white', 1.0, 30, 60, 2);
    lightR.position.set(30, 20, -30);
    lightR.target.position.set(10, 10, 10);
    console.log(lightR.target.position);
    scene.add(lightR);
    var helper2 = new THREE.SpotLightHelper(lightR);
    scene.add(helper2);

    var helper3 = new THREE.DirectionalLightHelper(backLight2, 20);
    scene.add(helper3);

    //////////////////////////////////////////////////////////////////////////////////
    //		add an object and make it move					//
    //////////////////////////////////////////////////////////////////////////////////

    var tran = new THREE.Vector3();
    var quat = new THREE.Quaternion();
    var rot = new THREE.Quaternion();
    var vscale = new THREE.Vector3();

    var car_cf = new THREE.Matrix4();
    car_cf.makeTranslation(20, 0, -20);
    car_cf.multiply(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(-90)));
    car_cf.decompose(tran, quat, vscale);

    // add car
    var car = new Car();
    // set car to car_cf
    car.position.copy(tran);
    car.quaternion.copy(quat);
    scene.add(car);

    // ground 
    var groundPlane = new THREE.PlaneBufferGeometry(250, 250, 5, 5);
    //var groundPlane = new Ground();
    var asphaltTex = THREE.ImageUtils.loadTexture("textures/asphalt.jpg");
    asphaltTex.repeat.set(20, 20);
    asphaltTex.wrapS = THREE.MirroredRepeatWrapping;
    asphaltTex.wrapT = THREE.RepeatWrapping;
	var groundMat = new THREE.MeshPhongMaterial({color:0x696969,ambient:0x1d6438, map:asphaltTex});
	var ground = new THREE.Mesh(groundPlane, groundMat);
    ground.rotateX(THREE.Math.degToRad(-90));
    scene.add(ground);

	// street light with curb
	var streetLight = new StreetLight();
	scene.add(streetLight);

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

    var speed = 1.0;
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
                    selected_obj.rotateY(THREE.Math.degToRad(speed * 5));
                else
                    selected_obj.position.z += speed;
                break;
            case 68:    // 'd' moves along normal -z-axis, rotates on -y-axis
                if(shift)
                    selected_obj.rotateY(THREE.Math.degToRad(-speed * 5));
                else
                    selected_obj.position.z -= speed;
                break;
            case 69:    // 'e' moves along normal +x-axis, rotates on -z-axis
                if(shift)
                    selected_obj.rotateZ(THREE.Math.degToRad(-speed * 5));
                else
                    selected_obj.position.x += speed;
                break;
            case 81:    // 'q' moves along normal -x-axis, rotates on +z-axis
                if(shift)
                    selected_obj.rotateZ(THREE.Math.degToRad(speed * 5));
                else
                    selected_obj.position.x -= speed;
                break;
            case 87:    // 'w' moves along normal +y-axis, rotates on +x-axis
                if(shift)
                    selected_obj.rotateX(THREE.Math.degToRad(speed * 5));
                else
                    selected_obj.position.y += speed;
                break;
            case 83:    // 's' moves along normal -y-axis, rotates on -x-axis
                if(shift)
                    selected_obj.rotateX(THREE.Math.degToRad(-speed * 5));
                else
                    selected_obj.position.y -= speed;
                break;
            /***** other stuff ******/
            case 73:    // 'i' "drive" car forward when it's selected
                if(selected_obj == car) {
                    carSpeed += 0.1;
                    car.rotateTires(carSpeed);
                    car.position.z += carSpeed;
                }
                break;
            case 75:    // 'k' to drive car backward when it's selected
                if(selected_obj == car) {
                    carSpeed += 0.1;
                    car.rotateTires(-carSpeed);
                    car.position.z -= carSpeed;
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
        //camera.position.x += (mouse.x*5 - camera.position.x) * (delta*3)
        //camera.position.y += (mouse.y*5 - camera.position.y) * (delta*3)
        //camera.rotate().x = 5;
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
