export class Father {
    // 这是变量行注释
    name: string;

    // 这是头行注释
    constructor(name: string) {
        this.name = name;
    }

    /**
     * 这个函数头 block 注释
     */
    getName() {
        return "112";
    } // 这是函数尾行注释
}
