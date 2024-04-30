import React from 'react';
import axiosPrivate from '../api/axios';
import { Link, useLocation } from 'react-router-dom';

const ACTIVATION_URL = '/api/auth/email_confirm';

const VerifyEmail = () => {
    const location = useLocation();

    const handleActivation = async () => {
        const queryParams = new URLSearchParams(location.search);
        const uid64 = queryParams.get('uid64');
        await axiosPrivate.get(`${ACTIVATION_URL}/${uid64}`);
    };

    return (
        <section>
            <h1>Activation!</h1>
            <p>
                Click here to confirm your email{' '}
                <Link to="/activated" onClick={handleActivation}>
                    confirm email
                </Link>
            </p>
            <p>
                <br></br>
                <Link to="/login">Sign In</Link>
            </p>
        </section>
    );
};

export default VerifyEmail;
