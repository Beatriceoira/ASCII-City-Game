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
// DISTANCE
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


    return Math.pow(
        1 - normalized,
        1.35
    );
}


// ============================================
// LIGHT SOURCE
// ============================================

export function pointLight(
    distance,
    radius
) {

    if (
        distance >= radius
    ) {

        return 0;
    }


    return Math.pow(
        1 -
        distance / radius,
        2
    );
}


// ============================================
// DAY/NIGHT
// ============================================

export function getWorldLight(
    night
) {

    return night
        ? 0.32
        : 1.0;
}


// ============================================
// FINAL LIGHT
// ============================================

export function calculateBrightness(
    distance,
    maxDistance,
    side = 0,
    night = false,
    localLight = 0
) {

    let brightness =
        distanceBrightness(
            distance,
            maxDistance
        );


    const worldLight =
        getWorldLight(
            night
        );


    brightness *=
        worldLight;


    // Fog.

    const fog =
        clamp(
            distance /
            maxDistance,
            0,
            1
        );


    brightness *=
        1 -
        fog * 0.5;


    // Wall orientation.

    if (
        side === 1
    ) {

        brightness *=
            0.78;
    }


    // Local lights.

    brightness +=
        localLight *
        0.7;


    return clamp(
        brightness,
        0.025,
        1
    );
}


// ============================================
// ASCII
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
// COLOR
// ============================================

export function brightnessToColor(
    brightness,
    night = false
) {

    if (
        night
    ) {

        const r =
            Math.floor(
                brightness * 100
            );


        const g =
            Math.floor(
                brightness * 150
            );


        const b =
            Math.floor(
                brightness * 220
            );


        return `rgb(${r},${g},${b})`;
    }


    const value =
        Math.floor(
            30 +
            brightness *
            225
        );


    return `rgb(${value},${value},${value})`;
}


// ============================================
// LIGHT COLOR
// ============================================

export function lightColor(
    brightness
) {

    const r =
        Math.floor(
            150 +
            brightness * 105
        );


    const g =
        Math.floor(
            100 +
            brightness * 120
        );


    const b =
        Math.floor(
            25 +
            brightness * 70
        );


    return `rgb(${r},${g},${b})`;
}