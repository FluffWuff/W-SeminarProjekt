

const fragShader = `
precision mediump float;

uniform sampler2D uMainSampler[%count%];
uniform float gray;

varying vec2 outTexCoord;
varying float outTexId;
varying vec4 outTint;
varying vec2 fragCoord;

void main()
{
    vec4 texture;

    %forloop%

    gl_FragColor = texture;
    gl_FragColor.rgb = vec3(1.0, 0.5, 1.0);  /* mix(gl_FragColor.rgb, vec3(0.2126 * gl_FragColor.r + 0.7152 * gl_FragColor.g + 0.0722 * gl_FragColor.b), gray);*/
}
`;

export class GrayScalePipeline extends Phaser.Renderer.WebGL.Pipelines.MultiPipeline
{
_gray: number;

    constructor (game: Phaser.Game)
    {
        super({
            game,
            fragShader,
            //@ts-ignore
            uniforms: [
                'uProjectionMatrix',
                'uMainSampler',
                'gray'
            ]
        });

        this._gray = 0.5;
    }

    onPreRender ()
    {
        this.set1f('gray', this._gray);
    }

    get gray ()
    {
        return this._gray;
    }

    set gray (value)
    {
        this._gray = value;
    }
}
