exports.testAdmin = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Admin API is working"
    });
};