#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec3 color = vec3(0.0, 0.0, 0.0);
    
    float gx = sin(gl_FragCoord.y);
    float gy = cos(gl_FragCoord.x);
    if(gx<-0.320) gx = 0.0;
    color = vec3(0, 1.-gy-gx, 0);

    gl_FragColor = vec4(color, gy-gx-0.324);
}