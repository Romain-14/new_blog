import parseurl from "parseurl";

const adminPath = ["/admin", "/add_post", "/edit_post", "/delete_post"];


export default (req,res,next) => {
    const pathname = parseurl(req).pathname;

    console.log(pathname);
    // if (adminPath.includes(pathname) && req.session.user?.role === 'user' ) {
    //     res.redirect('/');    
    // } else {
        next();
    // } 
 

}
