const jwt = require('express-jwt');
const {secret} = require('config.json');

module.exports = authorize;

function authorize(roles = []){
 // roles param can be a single role string (e.g. Role.User or 'User')
 // or an array of roles (e.g. [Role.Admin, Role.User]  or ['Admin', 'User'])
 if (typeof roles === 'string') {
    roles = [roles];
 }
 
 return [
    // authenticate JWT and attach user to request object (req.user)
    jwt ({ secret, algorithms: ['HS256']}),

    //authorize based on user role
    async (req, res, next) => {
        const account = await db.Account.findByPk(req.user.id);

        if (!account || (roles.length && !roles.includes(account.role))) {
            //account no longer exists or role not authorize
            return res.status(401).json ({ message: 'Unauthorized' });
        }
        
        // authentication  and authorization successful
        req.user.role = account.role;
        const RefreshToken = await account.getRefreshTokens ();
        req.user.ownstoken = token => !!refreshToken.find(x => x.token === token);
        next();
    }
 ];

 }
