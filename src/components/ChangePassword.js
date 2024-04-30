import { useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axiosPrivate from '../api/axios';
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {validatePassword } from "../utils/password"
const CHANGE_PASSWORD_URL = '/api/auth/password_reset_confirm';



const ChangePassword = () => {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const uid64 = queryParams.get('uid64');
    const changeUrl = `${CHANGE_PASSWORD_URL}/${uid64}`

    const pwdRef = useRef();
    const confirmPwdRef = useRef();

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [success, setSuccess] = useState(false);

    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        try {
            validatePassword(pwd);
            setValidPwd(true);
        } catch (error) {
            setValidPwd(false);
        }
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();


        try {

            const response = await axiosPrivate.post(changeUrl, { password: pwd });
            if (response?.status === 200){
                setSuccess(true)
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
                        <p>Password changed successfully</p>
                        <p>
                            <Link to="/login">Sign In</Link>
                        </p>
                    </section>
                    :
                    <section>
                        <h1>Reset Password</h1>
                        <form onSubmit={handleSubmit}>

                            <label htmlFor="password">
                                Password:
                                <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                            </label>
                            <input
                                type="password"
                                id="password"
                                ref={pwdRef}
                                autoComplete="new-password"
                                onChange={(e) => setPwd(e.target.value)}
                                value={pwd}
                                required
                                aria-invalid={validPwd ? "false" : "true"}
                                aria-describedby="pwdnote"
                                onFocus={() => setPwdFocus(true)}
                                onBlur={() => setPwdFocus(false)}
                            />
                            <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                at least 8 characters.<br />
                                Must include at least one uppercase letter, one lowercase letter, one digit, and one special character.<br />

                            </p>

                            <label htmlFor="confirm_pwd">
                                Confirm Password:
                                <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                            </label>
                            <input
                                type="password"
                                id="confirm_pwd"
                                ref={confirmPwdRef}
                                autoComplete="new-password"
                                onChange={(e) => setMatchPwd(e.target.value)}
                                value={matchPwd}
                                required
                                aria-invalid={validMatch ? "false" : "true"}
                                aria-describedby="confirmnote"
                                onFocus={() => setMatchFocus(true)}
                                onBlur={() => setMatchFocus(false)}
                            />
                            <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                Must match the first password input field.
                            </p>

                            <button>Reset Password</button>
                        </form>
                    </section>
            }
        </>
    );
};

export default ChangePassword
