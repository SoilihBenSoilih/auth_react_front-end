import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import axiosPrivate from '../api/axios';
const RESET_PASSWORD_URL = '/api/auth/password_reset';


const ResetPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState('');
    const [uid64, setUid64] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosPrivate.post(RESET_PASSWORD_URL, { email: email });
            if (response?.status === 200) {
                setSuccess(true);
                setUid64(response.data.uid64)
            }

        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response) {
                const firstKey = Object.keys(err.response.data)[0];
                const firstErrorMessage = `${firstKey}: ${err.response.data[firstKey]}`;
                setErrMsg(firstErrorMessage);
            } else {
                setErrMsg('Password Reset Failed');
            }
        }
    };

    return (
        <>
            {
                success ?
                    <section>
                        <h1>Success!</h1>
                        <p>Change your password by clicking: <Link to={`/change_password?uid64=${uid64}`}><a>change password</a></Link></p>
                        <p>
                            <Link to="/login">Sign In</Link>
                        </p>
                    </section>
                    :
                    <section>
                        <h1>Reset Password</h1>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="email">Email:</label>
                            <input
                                type="text"
                                id="email"
                                autoComplete="off"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                required
                            />
                            <button>Reset Password</button>
                        </form>
                        {errMsg && <p className="errmsg">{errMsg}</p>}
                        <div className="flexGrow">
                            <Link to="/login">Login</Link>
                        </div>
                    </section>
            }
        </>

    );
};

export default ResetPassword
