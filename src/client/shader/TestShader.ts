const fragShader = `
#define SHADER_NAME HUE_ROTATE_FS
precision mediump float;
uniform sampler2D uMainSampler;
uniform float uTime;
uniform float uSpeed;
varying vec2 outTexCoord;
void main()
{
    float c = cos(outTexCoord.x*100.0 + uTime*10.0);
    if(c > 0.9){
        gl_FragColor = texture2D(uMainSampler, outTexCoord);
    } else {
        gl_FragColor = vec4(0.0, 1.0, 0.2, 1.0);
    }
}
`;

export class TestPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {

    constructor (game: Phaser.Game){
        super({
            game: game,
            name: "Testpipeline",
            //@ts-ignore
            uniforms: [
                'uMainSampler',
                'uTime',
                'uSpeed'
            ],
            fragShader:fragShader
        })
    }

    onPreRender(): void {
        this.setTime('uTime');
        this.set1f('uSpeed', 1);
    }
    
}