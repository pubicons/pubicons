
export class Test {
    static isEmail(text: string) {
        return /\w+@\w+\.\w+/g.test(text);
    }

    static isAlias(text: string) {
        return /^[a-z0-9_]+(-[a-z0-9_]+)*$/g.test(text);
    }

    static isArray(values: any[], type: "string" | "number") {
        return Array.isArray(values)
            && values.filter(value => typeof value === type && Number.isFinite(value)).length
            == values.length
    }
}