
/** The class manages all locally based storage functions as `JSON` object. */
export class Storage {
    static set<T = any>(key: string, value: T) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static get<T = any>(key: string): T {
        const value = localStorage.getItem(key);
        if (value == null) {
            return null;
        }

        return JSON.parse(value);
    }
}