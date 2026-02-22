class ApiResponse {
    static success(res, data, message= 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }

    static created(res, data, message = 'Resource created successfully') {
        return this.success(res, data, message, 201);
    }

    static noContent(res, message = 'Resource deleted successfully') {
        return res.status(200).json({
            success: true,
            message
        });
    }
}

export default ApiResponse;