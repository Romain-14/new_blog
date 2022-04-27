export const mySession = {
    secret: "super je kiffe les chats",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
    },
};

export default (req,res,next)=>{
    res.locals.session = req.session;
    res.locals.error = null;
    
    if(!req.session.user){
        req.session.user = null;
        req.session.isLogged = false;
    }
    next();
}