const fragShader = `
#define SHADER_NAME HUE_ROTATE_FS
precision mediump float;
uniform sampler2D uMainSampler;
varying vec2 outTexCoord;
void main() {
    vec3 color = vec3(0.0, 0.0, 0.0);
    
    float gx = sin(outTexCoord.x*1920.);
    float gy = cos(outTexCoord.y*1080.);
    if(gx<0.967) { 
        gl_FragColor = texture2D(uMainSampler, outTexCoord);
    } else {
        color = vec3(0, 0.6-gy-gx, 0.12);;
        gl_FragColor = vec4(color, .2);
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
                'uMainSampler'
            ],
            fragShader: fragShader
        })
    }

    onPreRender(): void {

    }

}