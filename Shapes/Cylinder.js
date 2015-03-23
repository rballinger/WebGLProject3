/**
 * Created by Ryan on 3/23/2015.
 */

var Cylinder = function (topRad, botRad, height, faces) {
    var geometry = new THREE.BufferGeometry();
    var N_POINTS = faces * 2;
    var vertexArr = new Float32Array(3 * (2 * N_POINTS + 1));
    var delta = 2 * Math.PI / N_POINTS;

    /* points in top ring */

    var angle = 0.0;
    for(k = 0; k < N_POINTS; k++){
        // x, y, z
        vertexArr[3 * k] = topRad * Math.cos(angle);
        vertexArr[3 * k + 1] = topRad * Math.sin(angle);
        vertexArr[3 * k + 2] = height / 2;
        angle += delta;
    }

    /* points in bottom ring */
    angle = 0.0;
    for(k = 0; k < N_POINTS; k++){
        // x, y, z
        vertexArr[3 * 2 * k] = botRad * Math.cos(angle);
        vertexArr[3 * 2 * k + 1] = botRad * Math.sin(angle);
        vertexArr[3 * 2 * k + 2] = -height / 2;
        angle += delta;
    }

    // top center point
    vertexArr[3 * 2 * N_POINTS] = 0.0;
    vertexArr[3 * 2 * N_POINTS + 1] = 0.0;
    vertexArr[3 * 2 * N_POINTS + 2] = height / 2;

    // add vertex array
    geometry.addAttribute('position', new THREE.BufferAttribute(vertexArr, 3));

    // create normal array
    var normalArr = new Float32Array(vertexArr.length);

    // normal for top and bottom ring points
    var norm = new THREE.Vector3();
    for(var n = 1; n <= 2; n++){
        angle = 0.0;
        for(k = 0; k < N_POINTS; k++){
            var xTop = topRad * Math.cos(angle);
            var yTop = topRad * Math.sin(angle);
            var xBot = botRad * Math.cos(angle);
            var yBot = botRad * Math.sin(angle);
            norm.x = xTop - xBot;
            norm.y = yTop - yBot;
            norm.z = height;
            norm.normalize();
            normalArr[3 * n * k] = norm.x;
            normalArr[3 * n * k + 1] = norm.y;
            normalArr[3 * n * k + 2] = norm.z;
            angle += delta;
        }
    }
    // normal for top center point
    normalArr[3 * 2 * N_POINTS] = 0.0;
    normalArr[3 * 2 * N_POINTS] = 0.0;
    normalArr[3 * 2 * N_POINTS] = 1.0;

    // add normal array
    geometry.addAttribute('normal', new THREE.BufferAttribute(normalArr, 3));

    // create index array
    var indexArr = new Uint32Array(2 * N_POINTS + 2);

    // fill in sides
    var i = 0;
    for(k = 0; k < N_POINTS; k++){
        indexArr[i] = k;
        indexArr[i + 1] = k + N_POINTS;
        i += 2;
    }
    // close wall
    indexArr[2 * N_POINTS] = 0;
    indexArr[2 * N_POINTS + 1] = N_POINTS;

    // first index of tri-fan
    indexArr[2 * N_POINTS + 2] = N_POINTS * 2;
    // index of rest of tri-fan
    for(var k = 0; k < N_POINTS; k++){
        indexArr[2 * N_POINTS + 2 + k] = k;
    }
    // close arc of tri-fan
    indexArr[2 * N_POINTS + 2 + N_POINTS] = 0;

    // add index array
    geometry.addAttribute('index', new THREE.BufferAttribute(indexArr, 1));


    /* start of old code */
    /* similar to glColorPointer */
    //var colorArr = new Float32Array(vertexArr.length);
    //var color = new THREE.Color;
    //for (var k = 0; k < Ndiv + 1; k++) {
    //    color.r = baseColor.r + Math.random() * 0.3;
    //    color.g = baseColor.g + Math.random() * 0.3;
    //    color.b = baseColor.b + Math.random() * 0.3;
    //    colorArr[3 * k] = color.r;
    //    colorArr[3 * k + 1] = color.g;
    //    colorArr[3 * k + 2] = color.b;
    //}
    //geometry.addAttribute('color', new THREE.BufferAttribute(colorArr, 3));

    //var indexArr = new Uint32Array(Ndiv * 3);
    //for (var k = 0; k < Ndiv; k++) {
    //    indexArr[3 * k] = Ndiv;
    //    indexArr[3 * k + 1] = k;
    //    indexArr[3 * k + 2] = (k + 1) % Ndiv;
    //}
    //geometry.addAttribute('index', new THREE.BufferAttribute(indexArr, 1));

    geometry.computeBoundingSphere();
    return geometry;
};