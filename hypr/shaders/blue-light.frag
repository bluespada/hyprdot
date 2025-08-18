#version 320 es 
precision mediump float;

out vec4 FragColor;           // Warna output fragmen
uniform sampler2D screenTexture;  // Tekstur layar (tampilan)

#define STRENGTH 0.00095  // Mengurangi kekuatan distorsi

void main()
{
    // Ambil warna dari layar menggunakan koordinat fragmen (x, y) langsung
    vec4 color = texture(screenTexture, vec2(gl_FragCoord.x / 1366.0, gl_FragCoord.y / 768.0)); 

    // Mengurangi komponen biru untuk mengurangi cahaya biru
    float redBoost = 1.0;  // Komponen merah tetap
    float greenBoost = 1.0;  // Komponen hijau tetap
    float blueReduction = 1.0;  // Mengurangi komponen biru

    // Terapkan pengurangan biru
    color.r *= redBoost;
    color.g *= greenBoost;
    color.b *= blueReduction;

    // Efek distorsi chroma (distorsi warna)
    vec2 center = vec2(0.5, 0.5);  // Pusat layar
    vec2 offset = (vec2(gl_FragCoord.x / 1366.0, gl_FragCoord.y / 768.0) - center) * STRENGTH;

    // Menggunakan sqrt untuk distorsi yang lebih lembut
    float rSquared = dot(offset, offset);
    float distortion = 1.0 + 0.5 * sqrt(rSquared);  // Distorsi lebih halus
    vec2 distortedOffset = offset * distortion;

    // Distorsi warna untuk merah dan biru
    vec2 redOffset = vec2(distortedOffset.x, distortedOffset.y);
    vec2 blueOffset = vec2(distortedOffset.x, distortedOffset.y);

    // Ambil warna dari layar dengan offset yang terdistorsi
    vec4 redColor = texture(screenTexture, vec2(gl_FragCoord.x / 1366.0, gl_FragCoord.y / 768.0) + redOffset);
    vec4 blueColor = texture(screenTexture, vec2(gl_FragCoord.x / 1366.0, gl_FragCoord.y / 768.0) + blueOffset);

    // Gabungkan warna yang sudah terdistorsi
    FragColor = vec4(redColor.r, color.g, blueColor.b, 0.9);
}

// vim: set ft=glsl:
