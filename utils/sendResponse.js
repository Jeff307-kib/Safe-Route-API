export default (res, data, statusCode = 200, message = "Success") => {
    return (
        res
            .status(statusCode)
            .json({
                status: message,
                data: data
            })
    )
}