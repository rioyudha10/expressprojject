import React, { Component } from 'react';
import 'whatwg-fetch';
import signUp from './signup'
import {
  getFromStorage,
  setInStorage,
} from '../../utils/storage'
import SignUp from './signup';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading : true,
      token : '',
      signUpError : '',
      signInError : '',
      masterError : '',
      signInEmail : '',
      signInPassword : '',
      firstName : '',
      lastName : '',
      emailUser : '',
    };

    this.onChangeSignEmail = this.onChangeSignEmail.bind(this);
    this.onChangeSignPassword = this.onChangeSignPassword.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
    this.onSignOut = this.onSignOut.bind(this);

  }

  componentDidMount() {

    // console.log('didmount')

    const obj = getFromStorage('the_main_app');

    // console.log(JSON.stringify(obj))
   
    if (obj && obj.token) {

      const { token } = obj;

      const { email } = obj;

      //token
      fetch("/api/account/verify?token=" + token + "&email=" + email )
        .then(res => res.json())
        .then(json => {

          console.log(JSON.stringify(json))

          if (json.success) {
            this.setState({
              token : token,
              isLoading : false,
              firstName : json.firstName,
              lastName : json.lastName,
              emailUser : json.email,
            })
          } else {
            this.setState({
              isLoading : false,
            })
          }
        })

    } else {
      this.setState({
        isLoading : false
      })
    }
  }

  onSignIn() {

    console.log('sign IN')

    fetch('/api/account/signin', { 
      method: 'POST' ,
      headers : {
          "Content-Type":"application/json",
      },
      body : JSON.stringify({
          email : this.state.signInEmail,
          password : this.state.signInPassword,
      })
    })
    .then(res => res.json())
    .then(json => {

      console.log(JSON.stringify(json))

        this.setState({
          signUpError : json.message,
          token : json.token,
        
        })

        setInStorage('the_main_app', { token : json.token, email : json.email })
        
    });
  }

  onSignOut() {
    setInStorage('the_main_app', { token : '' })
    this.setState({
      token : '',
    })
  }

  newCounter() {
    // fetch('/api/counters', { method: 'POST' })
    //   .then(res => res.json())
    //   .then(json => {
    //     let data = this.state.counters;
    //     data.push(json);

    //     this.setState({
    //       counters: data
    //     });
    //   });
  }

  

  incrementCounter(index) {
    const id = this.state.counters[index]._id;

    fetch(`/api/counters/${id}/increment`, { method: 'PUT' })
      .then(res => res.json())
      .then(json => {
        this._modifyCounter(index, json);
      });
  }

  decrementCounter(index) {
    const id = this.state.counters[index]._id;

    fetch(`/api/counters/${id}/decrement`, { method: 'PUT' })
      .then(res => res.json())
      .then(json => {
        this._modifyCounter(index, json);
      });
  }

  deleteCounter(index) {
    const id = this.state.counters[index]._id;

    fetch(`/api/counters/${id}`, { method: 'DELETE' })
      .then(_ => {
        this._modifyCounter(index, null);
      });
  }

  _modifyCounter(index, data) {
    let prevData = this.state.counters;

    if (data) {
      prevData[index] = data;
    } else {
      prevData.splice(index, 1);
    }

    this.setState({
      counters: prevData
    });
  }

  onChangeSignPassword(event) {
    this.setState({
      signInPassword : event.target.value
    })
  }

  onChangeSignEmail(event){
    this.setState({
      signInEmail : event.target.value
    })
  }

  render() {

    console.log(this.state.firstName)

    if ( this.state.isLoading ) {
      return (
        <div>
          <p>
            Loading ...
          </p>
        </div>
      )
    }

    if ( !this.state.token ) {
      return (
        <div>
          <div>
            {
              this.state.signInError ? (
                <p>{this.state.signInError}</p>
              ) : null
            }
            <p>Sign In</p>
            <input 
              type = "email" 
              placeholder = "Email" 
              value = { this.state.signInEmail } 
              onChange = {this.onChangeSignEmail}
              />
              <br />
            <input 
              type = "password" 
              placeholder = "password" 
              value = { this.state.signInPassword } 
              onChange = {this.onChangeSignPassword}
              />
            <br />
            <button onClick = {this.onSignIn}>Sign In</button>
          </div>
          <br />
          <br />
          <SignUp />
        </div>
      )
    }

    return (
      <div>
        <p>
          Account
        </p>
        <p>
          Full Name : {this.state.firstName}  {this.state.lastName}
        </p>
        <p>
          {this.state.emailUser}
        </p>
        <br />
        <button onClick = {this.onSignOut} >Sign Out</button>
      </div>
    );
  }
}

export default Home;
