import { useState } from 'react';
import { Link } from 'react-router-dom';

import axiosPrivate from '../api/axios';
const RESET_PASSWORD_URL = '/api/auth/password_reset';
const SEND_EMAIL_URL = '/api/email/send';



const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosPrivate.post(RESET_PASSWORD_URL, { email: email });
            const uid64 = response.data.uid64
            const baseUrl = window.location.origin;
            let msg = `Click the following link to change your password: ${baseUrl}/change_password?uid64=${uid64}`
            await axiosPrivate.post(SEND_EMAIL_URL, {
                'to': email,
                'subject': "Change your password",
                'msg': msg
            });
            setSuccess(true);

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
                        <p>Check your email to reset password</p>
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
