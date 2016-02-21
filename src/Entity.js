
// ENTITY MODULE

var Entity = function (position, vertices, indices, sProgram)
{
    this.position = position;
    this.vertices = vertices;
    this.indices = indices;

    this.shaderProgram = sProgram;

    this.vertexPositionBuffer = null;
    this.vertexIndexBuffer = null;   

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

    this.vertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

    this.vertexIndexBuffer.itemSize = 1;
    this.vertexIndexBuffer.numItems = this.indices.length;

    // bind shader uniforms
    this.shaderProgram.mvMatrixUniform = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
};

Entity.prototype.render = function ()
{
    // bind vertex buffer   
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
    
    // set model-view transform matrix
    mat4.identity(this.mvMatrix);
    mat4.translate(this.mvMatrix, this.position);
    gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);

    gl.drawElements(gl.TRIANGLES, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
};
    