attribute vec2 a_position;
uniform mat4 u_matrix;

void main() {
  gl_Position = vec4((u_matrix * vec4(a_position, 1, 1)).xy, 0, 1);
  //размер точки если gl.POINT
  gl_PointSize = 3.5;
}