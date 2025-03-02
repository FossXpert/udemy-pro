"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.success = exports.catchAsyncError = void 0;
const catchAsyncError = (theFunc) => async (req, res, next) => {
    Promise.resolve(theFunc(req, res, next)).catch(next);
};
exports.catchAsyncError = catchAsyncError;
const success = async (statusCode) => {
    try {
        if (statusCode >= 200 && statusCode < 300) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (error) {
        throw error.message;
    }
};
exports.success = success;
