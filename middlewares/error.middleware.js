export default function (err, req, res, next) {
    console.error(err);

    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || "Internal Server Error";

    res.statusCode(statusCode).json({
        status: "Failed",
        message: errorMessage
    });
}