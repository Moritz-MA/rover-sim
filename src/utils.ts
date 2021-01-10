export const clamp = (num: number, min: number, max: number) => {
    return num <= min ? min : num >= max ? max : num;
}

export const harmonicMean = (values: number[]) => {
    return values.length / values.reduce((accumulator, currentValue) => accumulator + (1 / currentValue), 0)
}
