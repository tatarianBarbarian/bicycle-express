export class Handler {
    constructor(handler) {
        this.handler = handler;
        this.nextHandler = null;
    }

    setNext(handler) {
        this.nextHandler = handler;
    }

    handle(req, res) {
        function next(name) {
            if (this.nextHandler) {
                this.nextHandler.handle(req, res);
            }
            else {
                return null;
            }
        }
        
        this.handler(req, res, next.bind(this));
    }
}
