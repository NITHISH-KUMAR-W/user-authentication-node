const getUserInfo = async (req, res) => {
    res.json({ user: req.user });
};

module.exports = { getUserInfo };
