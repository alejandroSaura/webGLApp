
// MAIN APP MODULE

var gl;
var shaderProgram;

// common uniforms
var pMatrix = mat4.create();

// geometry definition
cubeVertices = [
         0.0, 0.0, 0.0,
         1.0, 0.0, 0.0,
         1.0, 1.0, 0.0,
         0.0, 1.0, 0.0,
         0.0, 0.0, 1.0,
         1.0, 0.0, 1.0,
         1.0, 1.0, 1.0,
         0.0, 1.0, 1.0
];
cubeIndices = [
        0, 1, 3,
        1, 2, 3,

        4, 7, 5,
        5, 7, 6,

        5, 6, 2,
        1, 5, 2,

        4, 0, 3,
        4, 3, 7,

        2, 6, 7,
        2, 7, 3,

        1, 0, 4,
        1, 4, 5
];

// scene elements
var entities = [];

function initGL(canvas)
{
    try
    {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e)
    {
    }
    if (!gl)
    {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

function webGLStart()
{
    var canvas = document.getElementById("myCanvas");
    initGL(canvas);
    initShaders();    

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    createScene();
    drawScene();

    // enter game loop
    window.requestAnimationFrame(gameLoop);
}

function createScene()
{
    var entity = new Entity([1.5, 0.0, -7.0], cubeVertices, cubeIndices, shaderProgram);
    entities.push(entity);
}

var updateInterval = 1000.0 / 60.0;
var lastTime = 0;
function gameLoop()
{
    // control the time elapsed to update each 1/60 seconds...
    var time = new Date().getTime();
    if (time - lastTime > updateInterval)
    {
        var deltaTime = time - lastTime;
        Update(deltaTime);
        lastTime = time;
    }    

    drawScene(); // but draw each frame
    window.requestAnimationFrame(gameLoop); // ask to be called again
}

function Update(deltaTime)
{
    console.log("update is being called");
    //TO-DO: move things and do networking
}

function drawScene()
{
    // clear viewport
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // set camera    
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);   
    
    // render all entities on the scene
    for (i = 0; i < entities.length; i++)
    {
        entities[i].render();
    }    
}


function getShader(gl, id)
{
    var shaderScript = document.getElementById(id);
    if (!shaderScript)
    {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k)
    {
        if (k.nodeType == 3)
        {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment")
    {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex")
    {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}


function initShaders()
{
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
    {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}