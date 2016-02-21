var Entity = function (position, vertices, sProgram) 
{
    this.position = position;
    this.vertexPositionBuffer = null;
    this.shaderProgram = sProgram;
    this.vertices = vertices;

    // shader uniforms
    this.mvMatrix = mat4.create();

    // functions
    this.init();
};

Entity.prototype.init = function() 
{    
    this.vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

    this.vertexPositionBuffer.itemSize = 3; 
    this.vertexPositionBuffer.numItems = this.vertices.length / 3;

    // bind shader uniforms
    this.shaderProgram.mvMatrixUniform = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
};

Entity.prototype.render = function ()
{
    // bind vertex buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // set model-view transform matrix
    mat4.identity(this.mvMatrix);
    mat4.translate(this.mvMatrix, this.position);
    gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertexPositionBuffer.numItems);
};
    