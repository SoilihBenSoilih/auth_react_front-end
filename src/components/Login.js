import { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import axiosPrivate from '../api/axios';
const LOGIN_URL = '/api/auth/login';


const Login = () => {
    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [email, setUser] = useState('');
    const [password, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [email, password])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosPrivate.post(LOGIN_URL,
                JSON.stringify({ email: email, password: password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            //console.log(JSON.stringify(response));
            const accessToken = response?.data?.access;
            const user = response?.data?.user;
            const refreshToken = response?.data?.refresh;
            const roles = JSON.parse(user.roles)

            setAuth({ email: email, pwd: password, roles, accessToken, user: user, refreshToken: refreshToken });
            setUser('');
            setPwd('');
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response) {
                const firstKey = Object.keys(err.response.data)[0];
                const firstErrorMessage = `${firstKey}: ${err.response.data[firstKey]}`;
                setErrMsg(firstErrorMessage);
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (

        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input
                    type="text"
                    id="email"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    value={email}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={password}
                    required
                />
                <button>Sign In</button>
            </form>
            <div id='links-accounts'>
                <p>
                    New Account?<br />
                    <Link to="/register">Sign Up</Link>
                </p>
                <p>
                    Change password?<br />
                    <Link to="/reset_password">New Password</Link>
                </p>
            </div>
        </section>

    )
}

export default Login
