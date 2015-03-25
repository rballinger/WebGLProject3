/**
 * Created by Ryan on 3/24/2015.
 */

var Car = function () {
    var CHASSIS_LEN = 10;
    var CHASSIS_WIDTH = 4;
    var CHASSIS_HEIGHT = 1.5;
    var OFF_GROUND = 0.625;
    var SUBDIV = 20;
    var ROOF = 1;
    var SECTION_LEN = CHASSIS_LEN / SUBDIV;
    var vertexArrSize = 3 * SUBDIV * 2 * 2;

    var geometry = new THREE.BufferGeometry();
    var vertexArr = new Float32Array(vertexArrSize);
    var normalArr = new Float32Array(vertexArrSize);
    var indexArr = new Uint32Array((vertexArrSize - 12) * 2 + 24);  // (vertexArrSize / 3) * 3 - 12

    // top chassis start
    var topPoints = SUBDIV * 2;
    var sectionHeight = CHASSIS_HEIGHT + OFF_GROUND;
    var roofStart = topPoints * 0.3;
    if(roofStart % 2 != 0){
        roofStart += 1;
    }
    var roofEnd = topPoints * 0.75;
    if(roofEnd % 2 != 0){
        roofEnd += 1;
    }
    var n1 = new THREE.Vector3();
    n1.x = 0;
    n1.y = 0;
    n1.z = 1;
    for(var i = 0; i < topPoints; i=i+2){
        if(i >= roofStart && i < roofStart + 4){
            sectionHeight = CHASSIS_HEIGHT + OFF_GROUND + (i - roofStart) * 0.5;
            n1.y = -0.707;
            n1.z = 0.707;
        }else if(i >= roofStart + 4 && i < roofEnd){
            sectionHeight = CHASSIS_HEIGHT + OFF_GROUND + ROOF;
            n1.y = 0;
            n1.z = 1;
        }else{
            sectionHeight = CHASSIS_HEIGHT + OFF_GROUND;
            n1.y = 0;
            n1.z = 1;
        }
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
    for(var i = 1; i < topPoints - 2; i=i+2){
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

    // bottom chassis
    n1.x = 0;
    n1.y = 0;
    n1.z = -1;
    n1.normalize();
    for(var i = topPoints; i < topPoints * 2; i=i+2){
        vertexArr[3 * i] = 0;
        vertexArr[3 * i + 1] = (i - topPoints) * SECTION_LEN / 2;
        vertexArr[3 * i + 2] = OFF_GROUND;
        vertexArr[3 * (i + 1)] = CHASSIS_WIDTH;
        vertexArr[3 * (i + 1) + 1] = (i - topPoints) * SECTION_LEN / 2;
        vertexArr[3 * (i + 1) + 2] = OFF_GROUND;
        normalArr[3* i] = n1.x;
        normalArr[3 * i + 1] = n1.y;
        normalArr[3 * i + 2] = n1.z;
        normalArr[3 * (i + 1)] = n1.x;
        normalArr[3 * (i + 1) + 1] = n1.y;
        normalArr[3 * (i + 1) + 2] = n1.z;
    }

    for(var i = topPoints + 1; i < topPoints * 2 - 2; i=i+2){
        // first triangle of quad
        indexArr[currIndex] = i + 1;
        currIndex++;
        indexArr[currIndex] = i;
        currIndex++;
        indexArr[currIndex] = i - 1;
        currIndex++
        // second triangle of quad
        indexArr[currIndex] = i;
        currIndex++;
        indexArr[currIndex] = i + 1;
        currIndex++;
        indexArr[currIndex] = i + 2;
        currIndex++;
    }

    // sides
    // first long side
    for(var i = 0; i < topPoints - 2; i=i+2){
        // first triangle of quad
        indexArr[currIndex] = i + topPoints + 2;
        currIndex++;
        indexArr[currIndex] = i + topPoints;
        currIndex++;
        indexArr[currIndex] = i;
        currIndex++
        // second triangle of quad
        indexArr[currIndex] = i + 2;
        currIndex++;
        indexArr[currIndex] = i + topPoints + 2;
        currIndex++;
        indexArr[currIndex] = i;
        currIndex++;
    }
    // second long side
    for(var i = 1; i < topPoints - 2; i=i+2){
        // first triangle of quad
        indexArr[currIndex] = i;
        currIndex++;
        indexArr[currIndex] = i + topPoints;
        currIndex++;
        indexArr[currIndex] = i + topPoints + 2;
        currIndex++
        // second triangle of quad
        indexArr[currIndex] = i;
        currIndex++;
        indexArr[currIndex] = i + topPoints + 2;
        currIndex++;
        indexArr[currIndex] = i + 2;
        currIndex++;
    }
    // first short side
    indexArr[currIndex] = 0;
    currIndex++;
    indexArr[currIndex] = topPoints;
    currIndex++;
    indexArr[currIndex] = topPoints + 1;
    currIndex++;
    indexArr[currIndex] = 0;
    currIndex++;
    indexArr[currIndex] = topPoints + 1;
    currIndex++;
    indexArr[currIndex] = 1;
    currIndex++;
    // second short side
    indexArr[currIndex] = topPoints - 1;
    currIndex++;
    indexArr[currIndex] = topPoints * 2 - 2;
    currIndex++;
    indexArr[currIndex] = topPoints - 2;
    currIndex++;
    indexArr[currIndex] = topPoints - 1;
    currIndex++;
    indexArr[currIndex] = topPoints * 2 - 1;
    currIndex++;
    indexArr[currIndex] = topPoints * 2 - 2;
    currIndex++;

    geometry.addAttribute('position', new THREE.BufferAttribute(vertexArr, 3));
    geometry.addAttribute('normal', new THREE.BufferAttribute(normalArr, 3));
    geometry.addAttribute('index', new THREE.BufferAttribute(indexArr, 1));

    geometry.computeBoundingSphere();
    return geometry;
}

/* Inherit from THREE.Object3D */
Car.prototype = Object.create (THREE.Object3D.prototype);
Car.prototype.constructor = Car;