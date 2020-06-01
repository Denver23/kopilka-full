class ResponseMessageError extends Error {
    response: Object;
    constructor(response: Object) {
        super("Server response has errors!");
        this.name = "ResponseMessageError";
        this.response = response;
    }
}

export default ResponseMessageError;