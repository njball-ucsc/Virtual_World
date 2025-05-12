class Cube {
    constructor() {
        this.type = 'cube';
        //this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        //this.size = 10;
        //this.segments = 10;
        this.matrix = new Matrix4();
        this.textureIndex = null;
        this.textureWeight = 1.0;
        this.textureRepeat = false;
        this.repeatCount = 1;
    }

    render() {
        //var xy = this.position;
        var rgba = this.color;
        //var rad = this.size;

        // Pass the color
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the texture weight
        gl.uniform1f(u_texColorWeight, this.textureWeight);

        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Set up texture coordinates
        const texCoords = new Float32Array([
            // Front face
            0, 0,  this.repeatCount, 0,  this.repeatCount, this.repeatCount,
            0, 0,  0, this.repeatCount,  this.repeatCount, this.repeatCount,
            // Back face 
            0, 0,  this.repeatCount, 0,  this.repeatCount, this.repeatCount,
            0, 0,  0, this.repeatCount,  this.repeatCount, this.repeatCount,
            // Left face
            0, 0,  this.repeatCount, 0,  this.repeatCount, this.repeatCount,
            0, 0,  0, this.repeatCount,  this.repeatCount, this.repeatCount,
            // Right face
            0, 0,  this.repeatCount, 0,  this.repeatCount, this.repeatCount,
            0, 0,  0, this.repeatCount,  this.repeatCount, this.repeatCount,
            // Bottom face
            0, 0,  this.repeatCount, 0,  this.repeatCount, this.repeatCount,
            0, 0,  0, this.repeatCount,  this.repeatCount, this.repeatCount,
            // Top face
            0, 0,  this.repeatCount, 0,  this.repeatCount, this.repeatCount,
            0, 0,  0, this.repeatCount,  this.repeatCount, this.repeatCount
        ]);

        // Create and bind texture coordinate buffer
        const texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_TexCoord);

        // If texture is set, use it
        if (!(this.textureIndex === null)) {
            gl.uniform1i(u_TextureIndex, this.textureIndex);
            gl.uniform1f(u_texColorWeight, 1.0);

            // Set texture parameters for repeating and filtering
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,
                this.textureRepeat ? gl.REPEAT : gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,
                this.textureRepeat ? gl.REPEAT : gl.CLAMP_TO_EDGE);

        } else {
            gl.uniform1f(u_texColorWeight, 0.0);
        }

        drawSquare3D( [0.0,0.0,0.0, 1.0,0.0,0.0, 1.0,1.0,0.0,  0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0] )

        drawSquare3D( [0.0,0.0,1.0, 0.0,0.0,0.0, 0.0,1.0,0.0,  0.0,0.0,1.0, 0.0,1.0,1.0, 0.0,1.0,0.0] )

        drawSquare3D( [1.0,0.0,0.0, 1.0,0.0,1.0, 1.0,1.0,1.0,  1.0,0.0,0.0, 1.0,1.0,0.0, 1.0,1.0,1.0] )
        
        drawSquare3D( [1.0,0.0,1.0, 0.0,0.0,1.0, 0.0,1.0,1.0,  1.0,0.0,1.0, 1.0,1.0,1.0, 0.0,1.0,1.0] )
        
        drawSquare3D( [0.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,1.0,  0.0,0.0,0.0, 0.0,0.0,1.0, 1.0,0.0,1.0])

        drawSquare3D( [0.0,1.0,0.0, 1.0,1.0,0.0, 1.0,1.0,1.0,  0.0,1.0,0.0, 0.0,1.0,1.0, 1.0,1.0,1.0] )  
    }
}