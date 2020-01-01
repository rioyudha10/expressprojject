// import React, { Component } from 'react';


// class SignUp extends Component {

//     constructor(props) {
//         super(props);
    
//         this.state = {
//             signUpirstName : '',
//             signUpLastName : '',
//             signUpEmail : '',
//             signUpPassword : '',
//             signUpError : '',
//         };

//         this.onChangeSignEmail = this.onChangeSignEmail.bind(this);
//         this.onChangeSignPassword = this.onChangeSignPassword.bind(this);
//         this.onChangeSignFirstName = this.onChangeSignFirstName.bind(this);
//         this.onChangeSignLastName = this.onChangeSignLastName.bind(this);
//         this.onSignUp = this.onSignUp.bind(this);

//     };

    // onSignUp() {
    //     fetch('/api/account/signup', { 
    //         method: 'POST' ,
    //         headers : {
    //             "Content-Type":"application/json",
    //         },
    //         body : JSON.stringify({
    //             firstName : this.state.signUpFirstName,
    //             lastName : this.state.signUpLastName,
    //             email : this.state.signUpEmail,
    //             password : this.state.signUpPassword,
    //         })
    //     })
    //     .then(res => res.json())
    //     .then(json => {
    //         this.setState({
    //             signUpError : json.message,
    //         })
    //     });
    // }

//     onChangeSignPassword(event){
//         this.setState({
//           signUpPassword : event.target.value
//         })
//     }
    
//     onChangeSignEmail(event){
//         this.setState({
//           signUpEmail : event.target.value
//         })
//     }

//     onChangeSignFirstName(event){
//         this.setState({
//           signUpFirstName : event.target.value
//         })
//     }

//     onChangeSignLastName(event){
//         this.setState({
//           signUpLastName : event.target.value
//         })
//     }

//     render () {
//         return (
//             <div>
//             {
//               this.state.signUpError ? (
//                 <p>{this.state.signUpError}</p>
//               ) : null
//             }
//             <p>Sign Up</p>
//                 <input type = "email" placeholder = "Email"  value = { this.state.signUpEmail }  onChange = {this.onChangeSignEmail} /><br />
//                 <input type = "password" placeholder = "Password"  value = { this.state.signUpPassword }  onChange = {this.onChangeSignPassword} /><br />
//                 <input type = "text" placeholder = "Frst Name"  value = { this.state.signUpFirstName }  onChange = {this.onChangeSignFirstName} /><br />
//                 <input type = "text" placeholder = "Last Name"  value = { this.state.signUpLastName }  onChange = {this.onChangeSignLastName}  /><br />
//                 <button onClick = {this.onSignUp}>Sign Up</button>
//             </div>
//         )
//     }
// }

// export default SignUp;

import React, {useState} from 'react';
const Signup = () => {

    const [firstNameState, setFirstName] = useState('')
    const [lastNameState, setLastName] = useState('')
    const [emailState, setEmail] = useState('')
    const [passwordState, setPassowrd] = useState('')
    const [messageState, setMessage] = useState('')

    const handleFirstNameChange = (e) => setFirstName(e.target.value)
    const handleLastNameChange = (e) => setLastName(e.target.value)
    const handleEmailChange = (e) => setEmail(e.target.value)
    const handlePasswordChange = (e) => setPassowrd(e.target.value)

    const signup = () => {

        console.log('Sign Up')
        fetch('/api/account/signup', { 
            method: 'POST' ,
            headers : {
                "Content-Type":"application/json",
            },
            body : JSON.stringify({
                firstName : firstNameState,
                lastName : lastNameState,
                email : emailState,
                password : passwordState,
            })
        })
        .then(res => res.json())
        .then(json => {

            console.log(JSON.stringify(json))

            setMessage(json.message)
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassowrd('');

            alert(
                `
                    ${json.message}
                `
            )

            // this.setState({
            //     signUpError : json.message,
            // })
        });

       
    }

    return (
        <div>
            {/* {
                messageState ? (
                <p>{messageState}</p>
              ) : null
            } */}
            <p>
                Sign Up
            </p>
            <input 
                type="text" 
                name="firstName" 
                placeholder = "First Name" 
                value = {firstNameState}
                onChange={handleFirstNameChange}
            />
            <br />
            <input 
                type="text" 
                name="lastName" 
                placeholder = "Last Name" 
                value = {lastNameState}
                onChange={handleLastNameChange}
            />
            <br />
            <input 
                type="email" 
                name="email" 
                placeholder = "Email" 
                value = {emailState}
                onChange={handleEmailChange}
            />
            <br />
            <input 
                type="password" 
                name="password" 
                value = {passwordState}
                onChange={handlePasswordChange}
                placeholder = "Password"
            />
            <br />
            <button 
                onClick = {signup}
            >
                Sign Up
            </button>
        </div>
        
    )
}
export default Signup;