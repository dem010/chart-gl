precision mediump float;

uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
  //Если используется gl.POINTS в draw то рисует кружки, а не квадраты
  if(length(gl_PointCoord-vec2(0.5)) > 0.5)
    discard;
}