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
    camera.position.set(50, 15, 50);
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
    scene.add( ambientLight);
    var aboveLight	= new THREE.SpotLight('white', 1.0, 30, 60, 2);
    aboveLight.position.set(0, 5, 0);
    scene.add( aboveLight );
    var backLight	= new THREE.DirectionalLight('white', 1.0);
    backLight.position.set(0, 10, 20);
    scene.add( backLight );
    var backLight2	= new THREE.DirectionalLight('white', 1.0);
    backLight2.position.set(20, 10, 20);
    scene.add( backLight2 );
    var backLight3	= new THREE.DirectionalLight('white', 1.0);
    backLight3.position.set(20, 10, 0);
    scene.add( backLight3 );

    //////////////////////////////////////////////////////////////////////////////////
    //		add an object and make it move					//
    //////////////////////////////////////////////////////////////////////////////////

    var tran = new THREE.Vector3();
    var quat = new THREE.Quaternion();
    var rot = new THREE.Quaternion();
    var vscale = new THREE.Vector3();

    var car_cf = new THREE.Matrix4();
    car_cf.makeTranslation(1, 1, 0);
    // car_cf.multiply(new THREE.Matrix4().makeRotationZ(THREE.Math.degToRad(delta * 72)));
    car_cf.decompose(tran, quat, vscale);

    // add car
    var car = new Car();
    var carMat = new THREE.MeshPhongMaterial();
    var carMesh = new THREE.Mesh(car, carMat);
    // set car to car_cf
    carMesh.position.copy(tran);
    carMesh.quaternion.copy(quat);
    scene.add(carMesh);

    // add cylinder (actually cone)
    //var cone = new THREE.CylinderGeometry(0, 0.5, 2);
    //var coneMat = new THREE.MeshPhongMaterial();
    //var coneMesh = new THREE.Mesh(cone, coneMat);
    //coneMesh.position.set(0, 0, 1.5);
    //scene.add(coneMesh);

    //var geometry = new THREE.BoxGeometry( 1, 1, 1);
    //var material = new THREE.MeshPhongMaterial();
    //var mesh = new THREE.Mesh( geometry, material );
    //mesh.position.set(0, 0, 3);
    //scene.add( mesh );

    /*var groundPlane = new THREE.PlaneBufferGeometry(20, 20, 4, 4);
    var groundMat = new THREE.MeshPhongMaterial({color:0x1d6438, ambient:0x1d6438});
    var ground = new THREE.Mesh (groundPlane, groundMat);
    //ground.rotateX(THREE.Math.degToRad(-90));
    scene.add (ground);*/

    // ground 
    var groundPlane = new THREE.PlaneBufferGeometry(100, 100, 4, 4);
    /* texture won't work on our Ground for some reason */
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

	var tire = new Wheel();

    tire.translateZ(10);
	tire.translateY(15);
	tire.rotateX(Math.PI/2);
	scene.add(tire);

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
    var shift = false;  // if shift is being held or not
    var selected_obj = camera;
    document.addEventListener('keydown', function(event){
        switch(event.which){
            /**** to select objects ******/
            case 84:    // 't' to select car
                selected_obj = carMesh;
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
        }
    }, false);

    document.addEventListener('keyup', function(event){
        switch(event.which) {
            case 16:
                shift = false;
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
