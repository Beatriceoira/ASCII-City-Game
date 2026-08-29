// ============================================
// LIGHTING.JS — VERSION 4
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
        1 -
        normalized,
        1.25
    );
}


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


    brightness *=
        night
            ? 0.34
            : 1;


    if (
        side === 1
    ) {

        brightness *=
            0.76;
    }


    brightness +=
        localLight *
        0.8;


    const fog =
        clamp(
            distance /
            maxDistance,
            0,
            1
        );


    brightness *=
        1 -
        fog * 0.42;


    return clamp(
        brightness,
        0.02,
        1
    );
}


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


export function brightnessToColor(
    brightness,
    night
) {

    if (
        night
    ) {

        const r =
            Math.floor(
                brightness *
                90
            );


        const g =
            Math.floor(
                brightness *
                145
            );


        const b =
            Math.floor(
                brightness *
                220
            );


        return `
            rgb(
                ${r},
                ${g},
                ${b}
            )
        `.replace(
            /\s/g,
            ""
        );
    }


    const value =
        Math.floor(
            30 +
            brightness *
            225
        );


    return `
        rgb(
            ${value},
            ${value},
            ${value}
        )
    `.replace(
        /\s/g,
        ""
    );
}


export function lightColor(
    brightness
) {

    const r =
        Math.floor(
            150 +
            brightness *
            105
        );


    const g =
        Math.floor(
            100 +
            brightness *
            120
        );


    const b =
        Math.floor(
            20 +
            brightness *
            80
        );


    return `
        rgb(
            ${r},
            ${g},
            ${b}
        )
    `.replace(
        /\s/g,
        ""
    );
}