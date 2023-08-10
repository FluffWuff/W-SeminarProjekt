const fragShader = `
#define SHADER_NAME HUE_ROTATE_FS
precision mediump float;
uniform sampler2D uMainSampler;
uniform float uTime;
uniform float uSpeed;
varying vec2 outTexCoord;
void main() {
    vec3 color = vec3(0.0, 0.0, 0.0);
    
    float gx = sin(outTexCoord.x*1920.0);
    float gy = cos(outTexCoord.y*1080.0 + uTime*.05);
    if(gy<0.967 && gx < 0.967) { 
        gl_FragColor = texture2D(uMainSampler, outTexCoord);
    } else {
        color = vec3(0, 0.4-gy-gx, 0.12);;
        gl_FragColor = vec4(color, 0.002);
    }
}
`;

export class GameDefaultShaderPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {

    constructor(game: Phaser.Game) {
        super({
            game: game,
            name: "GameDefaultShaderPipeline",
            //@ts-ignore
            uniforms: [
                'uMainSampler',
                'uTime'
            ],
            fragShader: fragShader
        })
    }

    onPreRender(): void {
        this.setTime('uTime');
        this.set1f('uSpeed',1);
    }

}