
export class MathUtil {
    static randomRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }
}