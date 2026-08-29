// ============================================
// LIGHTING.JS
// ============================================

export const ASCII_SHADES =
    "@#8&$%*o!;:,. ";


export function clamp(
    value,
    min,
    max
) {

    return Math.max(
        min,
        Math.min(
            max,
            value
        )
    );
}


// ============================================
// DISTANCE BRIGHTNESS
// ============================================

export function distanceBrightness(
    distance,
    maxDistance
) {

    const normalized =
        clamp(
            distance /
            maxDistance,
            0,
            1
        );


    let brightness =
        1 -
        normalized;


    // Gives nearby objects
    // significantly more contrast.

    brightness =
        Math.pow(
            brightness,
            1.35
        );


    return brightness;
}


// ============================================
// FOG
// ============================================

export function fogFactor(
    distance,
    maxDistance
) {

    return clamp(
        distance /
        maxDistance,
        0,
        1
    );
}


// ============================================
// FINAL BRIGHTNESS
// ============================================

export function calculateBrightness(
    distance,
    maxDistance,
    side = 0
) {

    let brightness =
        distanceBrightness(
            distance,
            maxDistance
        );


    const fog =
        fogFactor(
            distance,
            maxDistance
        );


    brightness *=
        1 -
        fog * 0.45;


    // One wall orientation
    // is slightly darker.

    if (
        side === 1
    ) {

        brightness *= 0.78;
    }


    return clamp(
        brightness,
        0.03,
        1
    );
}


// ============================================
// BRIGHTNESS → ASCII
// ============================================

export function brightnessToASCII(
    brightness
) {

    const index =
        Math.floor(
            brightness *
            (
                ASCII_SHADES.length -
                1
            )
        );


    return ASCII_SHADES[
        clamp(
            index,
            0,
            ASCII_SHADES.length - 1
        )
    ];
}


// ============================================
// RGB GRAYSCALE
// ============================================

export function brightnessToColor(
    brightness
) {

    const value =
        Math.floor(
            25 +
            brightness *
            230
        );


    return `rgb(${value}, ${value}, ${value})`;
}