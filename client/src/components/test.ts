
export class Test {
    static isEmail(text: string) {
        return /\w+@\w+\.\w+/g.test(text);
    }

    static isAlias(text: string) {
        return /^[a-z0-9_]+(-[a-z0-9_]+)*$/g.test(text);
    }
}