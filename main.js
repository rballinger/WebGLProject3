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

	// determines if call-back will render new scene
	var run = false;

	// on render will allow translate fan once
	var translateFan = true;
	
	// rotational speed of the swivel
	var SWIVEL_SPEED = 0;
	var d_swiv_speed = 0.5;

	// rotational speed of fan blades
	var FAN_SPEED = 94; /* in degrees per second */

	// GLOBALS USED FOR CALL BACK
	// big ufo
	var old_X = 0.0;
	var old_Z = 0.0;
	var ufoSpeed = 50.0;
	var ellipse_angle_change = 1.0;
	var ellipse_angle = 0.0;
	// small ufo one
	var minUfoOneold_X = 0.0;
	var minUfoOneold_Y = 0.0;
	var minUfoOneufoSpeed = 50.0;
	var minUfoOneellipse_angle_change = 1.0;
	var minUfoOneellipse_angle = 0.0;
	// small ufo two
	var minUfoTwoold_Y = 0.0;
	var minUfoTwoold_Z = 0.0;
	var minUfoTwoufoSpeed = 50.0;
	var minUfoTwoellipse_angle_change = 1.0;
	var minUfoTwoellipse_angle = 0.0;

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
	var minUfoOne = new UFO();
	var minUfoTwo = new UFO();
	minUfoOne.scale.set(0.3, 0.3, 0.3);
	minUfoTwo.scale.set(0.3, 0.3, 0.3);

	// ufo coordinate frames
    var ufo_cf = new THREE.Matrix4();
    var minUfoOne_cf = new THREE.Matrix4();
    var minUfoTwo_cf = new THREE.Matrix4();
	minUfoOne_cf.makeTranslation(-8, 0, 0);
	minUfoTwo_cf.makeTranslation(-8, 0, 0);

	// add mini ufos to large ufo group
	ufo.add(minUfoOne);
	ufo.add(minUfoTwo);
	scene.add(ufo);

	ufo_cf.makeTranslation(-46, 45, 0);

	// position ufos
    minUfoOne.position.set (-58, 0, 0);
    minUfoTwo.position.set (0, 0, -46);
    ufo.position.set (-46, 45, 0);

	// Weathervane base
	var vaneBase = new WeatherVaneBase();
	scene.add(vaneBase);

	// Weathervane swivel
	var vaneSwivel = new VaneSwivel();
	vaneBase.add(vaneSwivel);

	vaneBase.translateX (-88);

	// Weathervane swivel frames
    var swivel_cf = new THREE.Matrix4();
	swivel_cf.makeTranslation(-10.5, 42.3, 54.5);

	// Fan for weathervane
	var fan = new Fan();
	fan.translateX(12);
	fan.translateZ(-24);
	fan.rotateY(Math.PI/2);

	// Weathervane swivel frames
    var fan_cf = new THREE.Matrix4();

    fan_cf.makeRotationY(THREE.Math.degToRad(90));

	vaneSwivel.add(fan);
	//fan_cf.makeTranslation(12, 0, 1.5);


    // create cube map for environment mapping of current scene
    var path = "textures/scene_envmap/"
    var images = [path + "neg_x.jpg", path + "pos_x.jpg",
        path + "pos_y.jpg", path + "neg_y.jpg",
        path + "pos_z.jpg", path + "neg_z.jpg"];
    var cubemap = THREE.ImageUtils.loadTextureCube( images );

    // add sphere for environment mapping
    var sphereGeo = new THREE.SphereGeometry(15, 30, 20);
    var sphereMat = new THREE.MeshBasicMaterial({envMap:cubemap});
    var sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    sphereMesh.position.set(-10, 25, 50);
    scene.add(sphereMesh);

    onRenderFcts.push(function(delta, now){
		if(run){
		    // old code
		    //mesh.rotateX(0.5 * delta);
		    //mesh.rotateY(2.0 * delta);
		    //coneMesh.rotateZ(0.5 * delta);

			/// START UFO MOTION ///
		    var ufo_tran = new THREE.Vector3();
		    var ufo_quat = new THREE.Quaternion();
		    var ufo_rot = new THREE.Quaternion();
		    var ufo_vscale = new THREE.Vector3();
			var majAxis = 140.0;
			var minAxis = 100.0;

			var new_X = minAxis*Math.cos(ellipse_angle);
			var new_Z = majAxis*Math.sin(ellipse_angle);

		    if(ellipse_angle == 0.0){
		    	new_X = new_Z = 0.0;
		    }

       		ellipse_angle += ellipse_angle_change*delta;

		    ufo_cf.multiply(new THREE.Matrix4().makeTranslation(new_X - old_X, 0.0, new_Z - old_Z));
		    ufo_cf.decompose (ufo_tran, ufo_quat, ufo_vscale);
		    ufo.position.copy(ufo_tran);
		    ufo.quaternion.copy(ufo_quat);

			old_X = new_X;
			old_Z = new_Z;

			var minUfoOne_tran = new THREE.Vector3();
		    var minUfoOne_quat = new THREE.Quaternion();
		    var minUfoOne_rot = new THREE.Quaternion();
		    var minUfoOne_vscale = new THREE.Vector3();
			var minUfoOnemajAxis = 50.0;
			var minUfoOneminAxis = 10.0;

			var minUfoOnenew_X = minUfoOnemajAxis*Math.cos(minUfoOneellipse_angle);
			var minUfoOnenew_Y = minUfoOneminAxis*Math.sin(minUfoOneellipse_angle);

		    if(minUfoOneellipse_angle == 0.0){
		    	minUfoOnenew_X = minUfoOnenew_Y = 0.0;
		    }

       		minUfoOneellipse_angle += minUfoOneellipse_angle_change*delta;

		    minUfoOne_cf.multiply(new THREE.Matrix4().makeTranslation(minUfoOnenew_X - minUfoOneold_X, minUfoOnenew_Y - minUfoOneold_Y, 0.0));
		    minUfoOne_cf.decompose (minUfoOne_tran, minUfoOne_quat, minUfoOne_vscale);
		    minUfoOne.position.copy(minUfoOne_tran);
		    minUfoOne.quaternion.copy(minUfoOne_quat);

			minUfoOneold_X = minUfoOnenew_X;
			minUfoOneold_Y = minUfoOnenew_Y;

			var minUfoTwo_tran = new THREE.Vector3();
		    var minUfoTwo_quat = new THREE.Quaternion();
		    var minUfoTwo_rot = new THREE.Quaternion();
		    var minUfoTwo_vscale = new THREE.Vector3();
			var minUfoTwomajAxis = 10.0;
			var minUfoTwominAxis = 50.0;

			var minUfoTwonew_Y = minUfoTwomajAxis*Math.cos(minUfoTwoellipse_angle);
			var minUfoTwonew_Z = minUfoTwominAxis*Math.sin(minUfoTwoellipse_angle);

		    if(minUfoTwoellipse_angle == 0.0){
		    	minUfoTwonew_Y = minUfoTwonew_Z = 0.0;
		    }

       		minUfoTwoellipse_angle += minUfoTwoellipse_angle_change*delta;

		    minUfoTwo_cf.multiply(new THREE.Matrix4().makeTranslation(0.0, minUfoTwonew_Y - minUfoTwoold_Y, minUfoTwonew_Z - minUfoTwoold_Z));
		    minUfoTwo_cf.decompose (minUfoTwo_tran, minUfoTwo_quat, minUfoTwo_vscale);
		    minUfoTwo.position.copy(minUfoTwo_tran);
		    minUfoTwo.quaternion.copy(minUfoTwo_quat);

			minUfoTwoold_Y = minUfoTwonew_Y;
			minUfoTwoold_Z = minUfoTwonew_Z;

			/// END UFO MOTION ///


			/// START FAN MOTION ///
			/// swivel
			
		    var swivel_tran = new THREE.Vector3();
		    var swivel_quat = new THREE.Quaternion();
		    var swivel_rot = new THREE.Quaternion();
		    var swivel_vscale = new THREE.Vector3();

		    if(SWIVEL_SPEED >= 4){
		    	d_swiv_speed = -1.5;
		    }else if( SWIVEL_SPEED <= -4){
		    	d_swiv_speed = 1.5;
		    }

		    SWIVEL_SPEED += d_swiv_speed*delta;

		    var swivel_angle = SWIVEL_SPEED;

		    swivel_cf.multiply(new THREE.Matrix4().makeRotationY(THREE.Math.degToRad(swivel_angle)));
		    swivel_cf.decompose(swivel_tran, swivel_quat, swivel_vscale);
		    vaneSwivel.position.copy(swivel_tran);
		    vaneSwivel.quaternion.copy(swivel_quat);

			// fan

			var fan_tran = new THREE.Vector3();
			var fan_quat = new THREE.Quaternion();
			var fan_rot = new THREE.Quaternion();
			var fan_vscale = new THREE.Vector3();
			fan_angle = FAN_SPEED * delta;

			fan_cf.multiply(new THREE.Matrix4().makeRotationZ(THREE.Math.degToRad(fan_angle)));
		    fan_cf.decompose(fan_tran, fan_quat, fan_vscale);
		    fan.position.copy(fan_tran);
		    fan.quaternion.copy(fan_quat);

			// do only once (Can't do out side of render?!?!?!?!?!?!?!?!?!)
			if(translateFan){
				fan_cf.multiply(new THREE.Matrix4().makeTranslation(0,0,12));
				fan_cf.decompose(fan_tran, fan_quat, fan_vscale);
				fan.position.copy(fan_tran);
				fan.quaternion.copy(fan_quat);
				translateFan = !translateFan;
			}
		}

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
            case 85:    // 'u' to select ufo
                selected_obj = ufo;
                break;
            case 70:    // 'f' to select minUfo1
                selected_obj = minUfoOne;
                break;
            case 79:    // 'o' to select minUfo2
                selected_obj = minUfoTwo;
                break;
            case 67:    // 'c' to select camera
                selected_obj = camera;
                break;
			// swivel rotation speed
            case 90:	// 'z' to speed up weathervane swivel
            	if(d_swiv_speed <= 0){
            		SWIVEL_SPEED += 1;
            	}else{
            		SWIVEL_SPEED -= 1;
            	}
            	break;
			// fan rotation speed
            case 66:	// 'b' to speed up weathervane fan
            	FAN_SPEED++;
				break;
            case 71:	// 'g' to slow down weathervane fan
            	FAN_SPEED--;
				if(FAN_SPEED <= 0){
					FAN_SPEED = 0;
				}
				break;
            /**** hold shift to rotate objects *****/
            case 16:    // hold shift to rotate objects
                shift = true;
                break;
			/**** STOP/START ANIMATION ******/
            case 32:
                run = !run;
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
