module.exports = async (err, req, res, next) => {
    console.error("Error stack:", err.stack);
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);

    res.status(err.statusCode || 500).json({
        message: err.message
    });

};
