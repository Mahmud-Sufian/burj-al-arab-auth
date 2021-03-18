import React, { useContext, useState } from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import './Login.css';
import { userContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';
firebase.initializeApp(firebaseConfig);
// if (firebase.app.length === 0) {
//    
// }

const Login = () => {
    const [userLoggedIn, setUserLoggedIn] = useContext(userContext);
    const history = useHistory();
    const location = useLocation();
    const { from } = location.state || { from: { pathname: "/" } };

    const [newUser, setNewUser] = useState(false);
    const [user, setUser] = useState({
        isSignIn: false,
        name: "",
        email: "",
        password: "",
        error: "",
        success: false
    });


    const handleSignIn = (e) => {
        let isFormValid = true;
        if (e.target.name === 'email') {
            const isEmailValid = /\S+@\S+\.\S+/.test(e.target.value);
            isFormValid = isEmailValid;
        }
        if (e.target.name === 'password') {
            const isPasswordLength = e.target.value.length > 6;
            const isPasswordHasNumber = /\d{1}/.test(e.target.value);
            isFormValid = isPasswordLength && isPasswordHasNumber;
        }
        if (isFormValid) {
            const newUser = { ...user };
            newUser[e.target.name] = e.target.value;
            setUser(newUser);
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (newUser && user.email && user.password) {
            firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
                .then(res => {
                    const newUser = { ...user };
                    newUser.success = true;
                    newUser.error = "";
                    setUser(newUser);
                    updateUserName(user.name);
                })
                .catch((error) => {
                    const newUser = { ...user };
                    newUser.success = false;
                    newUser.error = error.message;
                    setUser(newUser);
                });

        }

        if (!newUser && user.email && user.password) {
            firebase.auth().signInWithEmailAndPassword(user.email, user.password)
                .then(res => {
                    const newUser = { ...user };
                    newUser.success = true;
                    newUser.error = "";
                    newUser.name = res.user.displayName;
                    setUserLoggedIn(newUser);
                    history.replace(from);
                    setUser(newUser);
                    // console.log('sign in user', res.user.displayName)

                })
                .catch((error) => {
                    const newUser = { ...user };
                    newUser.success = false;
                    newUser.error = error.message;
                    setUser(newUser);
                });
        }

        // if (!user.email || user.password) {
        //     const newUser = { ...user };
        //     newUser.error = <p>Email or Password is Invalid.. please Try again</p>
        //     setUser(newUser);
        // }
    }

    const updateUserName = (name) => {
        var user = firebase.auth().currentUser;

        user.updateProfile({
            displayName: name
        }).then(function () {
            // Update successful.
        }).catch(function (error) {
            // An error happened.
        });
    }

    return (
        <div> 
            <form onSubmit={handleSubmit}>
                <input type="checkbox" name="newUser" onChange={() => setNewUser(!newUser)} />
                <label htmlFor="newUser">Creat Account</label>
                {newUser && <input type="text" name="name" onBlur={handleSignIn} placeholder="Your Name" required />}
                <input type="text" name="email" onBlur={handleSignIn} placeholder="Your Email" required />
                <input type="password" name="password" onBlur={handleSignIn} placeholder="Your Password" required />
                <input type="submit" value={newUser ? 'Sign up' : 'Sign In'} />
            </form>

            <p style={{ color: 'red', textAlign: 'center' }}>{user.error}</p>
            {
                user.success && <p style={{ color: 'green', textAlign: 'center' }}>User {newUser ? 'Created' : 'Logged In'} Successfully</p>
            }


        </div>
    );
};

export default Login;