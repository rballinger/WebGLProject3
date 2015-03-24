/**
 * Created by Ryan on 3/24/2015.
 */

var Car = function () {
    var CHASSIS_LEN = 20;
    var CHASSIS_WIDTH = 8;
    var CHASSIS_HEIGHT = 3;
    var OFF_GROUND = 1.25;
    var SUBDIV = 40;
    var ROOF = 2;
    var SECTION_LEN = CHASSIS_LEN / SUBDIV;
    var geometry = new THREE.BufferGeometry();
    var Ndiv = 40;

    var vertexArr2 = new Float32Array();

    var vertexArr = new Float32Array(3 * (Ndiv + 1));
    var angle = 0;
    var dAngle = 2 * Math.PI / Ndiv;
    for (var k = 0; k < Ndiv; k++) {
        vertexArr[3 * k] = 0.5 * Math.cos(angle);
        vertexArr[3 * k + 1] = 0.5 * Math.sin(angle);
        vertexArr[3 * k + 2] = 0.0;
        angle += dAngle;
    }
    vertexArr[3 * Ndiv] = 0;
    /* tip of the cone at (0,0,1) */
    vertexArr[3 * Ndiv + 1] = 0;
    vertexArr[3 * Ndiv + 2] = 1;
    geometry.addAttribute('position', new THREE.BufferAttribute(vertexArr, 3));

    /* similar to glNormalPointer */
    var normalArr = new Float32Array(vertexArr.length);
    angle = 0;
    var norm = new THREE.Vector3();
    for (var k = 0; k < Ndiv; k++) {
        norm.x = Math.cos(angle);
        norm.y = Math.sin(angle);
        norm.z = 1;
        norm.normalize();
        normalArr[3 * k] = norm.x;
        normalArr[3 * k + 1] = norm.y;
        normalArr[3 * k + 2] = norm.z;
        angle += dAngle;
    }
    normalArr[3 * Ndiv] = 0;
    normalArr[3 * Ndiv + 1] = 0;
    normalArr[3 * Ndiv + 2] = 1;
    geometry.addAttribute('normal', new THREE.BufferAttribute(normalArr, 3));

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

    var indexArr = new Uint32Array(Ndiv * 3);
    for (var k = 0; k < Ndiv; k++) {
        indexArr[3 * k] = Ndiv;
        indexArr[3 * k + 1] = k;
        indexArr[3 * k + 2] = (k + 1) % Ndiv;
    }
    geometry.addAttribute('index', new THREE.BufferAttribute(indexArr, 1));

    geometry.computeBoundingSphere();
    return geometry;
}

/* Inherit from THREE.Object3D */
Car.prototype = Object.create (THREE.Object3D.prototype);
Car.prototype.constructor = Car;