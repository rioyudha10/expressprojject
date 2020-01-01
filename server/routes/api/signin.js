const User = require('../../models/User')
const UserSession = require('../../models/UserSession')
var jwt = require('jsonwebtoken');
var config = require('../../config')

module.exports = (app) => {
    // app.get('/api/counters', (req, res, next) => {
    //   Counter.find()
    //     .exec()
    //     .then((counter) => res.json(counter))
    //     .catch((err) => next(err));
    // });
  
    // app.post('/api/counters', function (req, res, next) {
    //   const counter = new Counter();
  
    //   counter.save()
    //     .then(() => res.json(counter))
    //     .catch((err) => next(err));
    // });

    app.post('/api/account/signup', (req, res, next) => {
        const { body } = req;
        const  {
            firstName,
            lastName,
            password
        } = body;
        let {
            email,
        } = body;

        if ( !firstName ) {
            return res.send({
                success : false,
                message : 'Error : First name cannot be blank.'
            })
        }
        if ( !lastName ) {
            return res.send({
                success : false,
                message : 'Error : Last name cannot be blank.'
            })
        }
        if ( !email ) {
            return res.send({
                success : false,
                message : 'Error : Email cannot be blank.'
            })
        }
        if ( !password ) {
            return res.send({
                success : false,
                message : 'Error : Passowrd cannot be blank.'
            })
        }

        console.log('here');

        email = email.toLowerCase();

        //Step :
        // 1. Verify email doesn't exist
        // 2. Save

        User.find({
            email : email,
        }, (err, previousUsers) => {
            if (err) {
                return res.send({
                    success : false,
                    message : 'Error : Server Error'
                });
            } else if (previousUsers.length > 0) {
                return res.send({
                    success : false,
                    message : 'Account already exist'
                })
            }
        })

        //Save the new users

        const newUser = new User();

        newUser.email = email;
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.password = newUser.generateHash(password);
        newUser.save((err, user) => {
            if (err) {
                return res.send({
                    success : false,
                    message : 'Error : Server Error'
                });
            }
            return res.send({
                success : true,
                message : 'Signed UP'
            });
        })



    });

    app.post('/api/account/signin', (req, res, next) => {
        const { body } = req;
        const  {
            password
        } = body;
        let {
            email,
        } = body;

        if ( !email ) {
            return res.send({
                success : false,
                message : 'Error : Email cannot be blank.'
            })
        }
        if ( !password ) {
            return res.send({
                success : false,
                message : 'Error : Passowrd cannot be blank.'
            })
        }

        email = email.toLowerCase();

        User.find({
            email : email,
        }, ( err, users ) => {
            if (err) {
                return res.send({
                    success : false,
                    message : 'Error : Server Error'
                });
            }

            if (users.length != 1 ) {
                return res.send({
                    success : false,
                    message : 'Error : Invalid'
                });
            }

            const user = users[0];
            if (!user.validPassword(password)) {
                return res.send({
                    success : false,
                    message : 'Error : Invalid'
                });
            }

            var token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });

            const userSession = new UserSession();
            userSession.userId = user._id;
            userSession.save((err, doc) => {
                if (err) {
                    return res.send({
                        success : false,
                        message : 'Error : Server Error'
                    });
                }

                return res.send({
                    success : true,
                    message : 'Valid sign in',
                    email : email,
                    token : token
                });

            })


        })

        

    });

    app.get('/api/account/verify', (req, res, next) => {

        // var token = req.headers['x-access-token'];
        const { query } = req;
        const { token, email } = query;


       

        if (!token) {
            return res.send({
                success : false,
                message : 'Error : Token cannot be blank.',
            });
        };
        
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                return res.send({
                    success : false,
                    message : 'Error : Failed autheticated token',
                });
            };

            User.find({
                email : email,
            }, (err, previousUsers) => {

                if (err) {
                    return res.send({
                        success : false,
                        message : 'Error : Server Error'
                    });
                }

                if (previousUsers.length > 0) {
                    previousUsers.map((item) => {
                        return res.send({
                            success : true,
                            message : 'User Data',
                            email : item.email,
                            firstName : item.firstName,
                            lastName : item.lastName,
                        });
    
        
                    })
                } else {
                    return res.send({
                        success : false,
                        message : 'Error : Data Empty',
                    });
                }
            })
            
            
        });

        // const { query } = req;
        // const { token } = query;

        // UserSession.find({
        //     _id : token,
        //     isDeleted : false
        // }, (err, sessions) => {

        //     if (err) {
        //         return res.send({
        //             success : false,
        //             message : "Error : Server Error"
        //         })
        //     }

        //     if (sessions.length != 1) {
        //         return res.send({
        //             success : false,
        //             message : "Error : Invalid"
        //         })
        //     } else {
                // return res.send({
                //     success : true,
                //     message : "Good"
                // })
        //     }


           
        // })

    })

}