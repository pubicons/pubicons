
export enum APIException {
    INVALID_REQUEST_FORMAT = "invalid_request_format",
    INVALID_REQUEST_METHOD = "invalid_request_method",
    MISSING_REQUEST_FORMAT = "missing_request_format"
}

export enum APILength {
    alias = 64,
    email = 255,
    displayName = 32
}