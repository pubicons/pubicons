
export class Util {
    static yyyyMmDdOf(isoStr: string) {
        return new Date(isoStr).toISOString().split('T')[0];
    }
}