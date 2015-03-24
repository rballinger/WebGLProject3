/**
 * Created by Ryan on 3/24/2015.
 */

var Car = function () {
    var CHASSIS_LEN = 10;
    var CHASSIS_WIDTH = 4;
    var CHASSIS_HEIGHT = 1.5;
    var OFF_GROUND = 0.625;
    var SUBDIV = 20;
    var ROOF = 2;
    var SECTION_LEN = CHASSIS_LEN / SUBDIV;
    var vertexArrSize = 3 * SUBDIV * 2;

    var geometry = new THREE.BufferGeometry();
    var vertexArr = new Float32Array(vertexArrSize);
    var normalArr = new Float32Array(vertexArrSize);
    var indexArr = new Uint32Array(vertexArrSize - 6);  // (vertexArrSize / 3) * 3 - 6

    // top chassis start
    var sectionHeight = CHASSIS_HEIGHT + OFF_GROUND;
    var v1 = new THREE.Vector3();
    var v2 = new THREE.Vector3();
    var n1 = new THREE.Vector3();
    n1.x = 0;
    n1.y = 0;
    n1.z = 1;

    for(var i = 0; i < vertexArrSize; i=i+2){
        vertexArr[3* i] = 0;
        vertexArr[3 * i + 1] = i * SECTION_LEN / 2;
        vertexArr[3 * i + 2] = sectionHeight;
        vertexArr[3 * (i + 1)] = CHASSIS_WIDTH;
        vertexArr[3 * (i + 1) + 1] = i * SECTION_LEN / 2;
        vertexArr[3 * (i + 1) + 2] = sectionHeight;
        normalArr[3* i] = n1.x;
        normalArr[3 * i + 1] = n1.y;
        normalArr[3 * i + 2] = n1.z;
        normalArr[3 * (i + 1)] = n1.x;
        normalArr[3 * (i + 1) + 1] = n1.y;
        normalArr[3 * (i + 1) + 2] = n1.z;
    }

    var currIndex = 0;
    for(var i = 1; i < SUBDIV * 2 - 2; i=i+2){
        // first triangle of quad
        indexArr[currIndex] = i - 1;
        currIndex++;
        indexArr[currIndex] = i;
        currIndex++;
        indexArr[currIndex] = i + 1;
        currIndex++
        // second triangle of quad
        indexArr[currIndex] = i + 2;
        currIndex++;
        indexArr[currIndex] = i + 1;
        currIndex++;
        indexArr[currIndex] = i;
        currIndex++;
    }

    geometry.addAttribute('position', new THREE.BufferAttribute(vertexArr, 3));
    geometry.addAttribute('normal', new THREE.BufferAttribute(normalArr, 3));
    geometry.addAttribute('index', new THREE.BufferAttribute(indexArr, 1));

    geometry.computeBoundingSphere();
    return geometry;

    //var geometry2 = new THREE.BufferGeometry();
    //var Ndiv = 40;
    //
    //var vertexArr2 = new Float32Array(3 * (Ndiv + 1));
    //var angle = 0;
    //var dAngle = 2 * Math.PI / Ndiv;
    //for (var k = 0; k < Ndiv; k++) {
    //    vertexArr2[3 * k] = 0.5 * Math.cos(angle);
    //    vertexArr2[3 * k + 1] = 0.5 * Math.sin(angle);
    //    vertexArr2[3 * k + 2] = 0.0;
    //    angle += dAngle;
    //}
    //vertexArr2[3 * Ndiv] = 0;
    ///* tip of the cone at (0,0,1) */
    //vertexArr2[3 * Ndiv + 1] = 0;
    //vertexArr2[3 * Ndiv + 2] = 1;
    //geometry2.addAttribute('position', new THREE.BufferAttribute(vertexArr2, 3));
    //
    ///* similar to glNormalPointer */
    //var normalArr2 = new Float32Array(vertexArr2.length);
    //angle = 0;
    //var norm = new THREE.Vector3();
    //for (var k = 0; k < Ndiv; k++) {
    //    norm.x = Math.cos(angle);
    //    norm.y = Math.sin(angle);
    //    norm.z = 1;
    //    norm.normalize();
    //    normalArr2[3 * k] = norm.x;
    //    normalArr2[3 * k + 1] = norm.y;
    //    normalArr2[3 * k + 2] = norm.z;
    //    angle += dAngle;
    //}
    //normalArr2[3 * Ndiv] = 0;
    //normalArr2[3 * Ndiv + 1] = 0;
    //normalArr2[3 * Ndiv + 2] = 1;
    //geometry2.addAttribute('normal', new THREE.BufferAttribute(normalArr2, 3));

    /* similar to glColorPointer */
    //var colorArr = new Float32Array(vertexArr2.length);
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

    //var indexArr2 = new Uint32Array(Ndiv * 3);
    //for (var k = 0; k < Ndiv; k++) {
    //    indexArr2[3 * k] = Ndiv;
    //    indexArr2[3 * k + 1] = k;
    //    indexArr2[3 * k + 2] = (k + 1) % Ndiv;
    //}
    //geometry2.addAttribute('index', new THREE.BufferAttribute(indexArr2, 1));
    //
    ////geometry2.computeBoundingSphere();
    //return geometry2;
}

/* Inherit from THREE.Object3D */
Car.prototype = Object.create (THREE.Object3D.prototype);
Car.prototype.constructor = Car;