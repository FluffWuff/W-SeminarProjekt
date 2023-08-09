const fragShader = `
precision mediump float;
uniform sampler2D uMainSampler;
varying vec2 outTexCoord;
void main() {
    vec3 color = vec3(0.0, 0.0, 0.0);
    
    float gx = sin(outTexCoord.x);
    float gy = cos(outTexCoord.y);
    if(gx<-0.408) gx = 0.0;
    color = vec3(0, 1.-gy-gx, 0);;

    if(gx == 0.0) {
        gl_FragColor = texture2D(uMainSampler, outTexCoord);
    } else {
        gl_FragColor = vec4(color, 1.0);
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