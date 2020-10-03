module.exports.hasRole = function hasRole(roles) {
    return (req, res, next) => {
        const { role } = res.locals;
        if (!role) return res.status(403).send();
        if (roles.includes(role)) {
            return next();
        } else {
            return res.status(403).send();
        }
    };
}
module.exports.isAuthorized = function isAuthorized(opts) {
    return (req, res, next) => {
        const { role, uid } = res.locals;
        const { id } = req.params;
        if (opts.allowSameUser && id && uid === id) return next();
        if (!role) return res.status(403).send();
        if (opts.hasRole.includes(role)) return next();
        return res.status(403).send();
    };
}