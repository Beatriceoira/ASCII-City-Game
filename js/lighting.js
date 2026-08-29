// ============================================
// LIGHTING.JS
// ============================================


// ASCII characters ordered
// approximately from dense → faint

export const ASCII_SHADES =
    "@#8&$%*o!;:,. ";


// ============================================
// DISTANCE BRIGHTNESS
// ============================================

export function getBrightness(
    distance,
    maxDistance
) {

    const normalized =
        distance / maxDistance;


    let brightness =
        1 - normalized;


    // Non-linear falloff

    brightness =
        Math.pow(
            brightness,
            1.5
        );


    return Math.max(
        0,
        Math.min(
            1,
            brightness
        )
    );
}


// ============================================
// ASCII CHARACTER
// ============================================

export function brightnessToASCII(
    brightness
) {

    const index =
        Math.floor(
            brightness *
            (ASCII_SHADES.length - 1)
        );


    return ASCII_SHADES[
        Math.max(
            0,
            Math.min(
                ASCII_SHADES.length - 1,
                index
            )
        )
    ];
}


// ============================================
// FOG
// ============================================

export function applyFog(
    brightness,
    distance,
    maxDistance
) {

    const fog =
        Math.min(
            distance / maxDistance,
            1
        );


    return brightness *
        (1 - fog * 0.55);
}


// ============================================
// WALL BRIGHTNESS
// ============================================

export function calculateWallBrightness(
    distance,
    side,
    maxDistance
) {

    let brightness =
        getBrightness(
            distance,
            maxDistance
        );


    brightness =
        applyFog(
            brightness,
            distance,
            maxDistance
        );


    // Side-facing surfaces are slightly darker.

    if (side === 1) {

        brightness *= 0.75;
    }


    return Math.max(
        0,
        Math.min(
            1,
            brightness
        )
    );
}