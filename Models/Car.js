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
}

/* Inherit from THREE.Object3D */
Car.prototype = Object.create (THREE.Object3D.prototype);
Car.prototype.constructor = Car;