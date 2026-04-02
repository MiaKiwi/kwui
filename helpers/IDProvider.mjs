export default class IDProvider {
    static random() {
        return Math.random().toString(16).slice(2);
    }
}