
export const homePage =  (req, res, next) => {
    res.render('layout', {template: "home"});
}

export const pageNotFound = (req, res, next) => {
    res.render('layout', {template: 'pageNotFound'});
}