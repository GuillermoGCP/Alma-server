const manageError = (error, req, res, next) => {
    res.status(error.httpStatus || 500).send({ error: error.message || error })
}

export default manageError
