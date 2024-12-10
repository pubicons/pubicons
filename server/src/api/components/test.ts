
export class Test {
    static isEmail(text: string) {
        return /\w+@\w+\.\w+/g.test(text);
    }

    static isAlias(text: string) {
        return /^\w+(-\w+)*$/g.test(text);
    }
}