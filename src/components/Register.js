import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axiosPrivate from '../api/axios';
import { validatePassword } from "../utils/password"
import { Link } from "react-router-dom";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGISTER_URL = '/api/auth/register';
const ACTIVATION_URL = '/api/auth/verify_email';
const SEND_EMAIL_URL = '/api/email/send';

const ROLES = {
    'User': 2001,
    'Editor': 1984,
    'Admin': 5150
};

const Register = () => {
    const emailRef = useRef();
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const pwdRef = useRef();
    const confirmPwdRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [selectedRoles, setSelectedRoles] = useState([]);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        emailRef.current.focus();
    }, [])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => {
        try {
            validatePassword(pwd);
            setValidPwd(true);
        } catch (error) {
            setValidPwd(false);
        }
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd, matchPwd])

    const handleRoleChange = (role) => {
        if (selectedRoles.includes(role)) {
            setSelectedRoles(selectedRoles.filter(r => r !== role));
        } else {
            setSelectedRoles([...selectedRoles, role]);
        }
    }



    const handleSubmit = async (e) => {
        e.preventDefault();
        const v1 = EMAIL_REGEX.test(email);
        if (!v1 || !validPwd || !validMatch || !firstName || !lastName || selectedRoles.length === 0) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {

            const roles = selectedRoles.map(role => ROLES[role]);
            let response = await axiosPrivate.post(REGISTER_URL, {
                email: email,
                firstName: firstName,
                lastName: lastName,
                password: pwd,
                roles: JSON.stringify(roles)
            });
            response = await axiosPrivate.post(ACTIVATION_URL, {
                email: email
            });
            const uid64 = response.data.uid64;
            const baseUrl = window.location.origin;
            await axiosPrivate.post(SEND_EMAIL_URL, {
                'to': email,
                'subject': "Activation de votre compte AuthComplete",
                'msg': `Cliquez sur le lien qui suit pour activer votre compte: ${baseUrl}/verify_email?uid64=${uid64}`
            });
            setSuccess(true);
            setEmail('');
            setFirstName('');
            setLastName('');
            setPwd('');
            setMatchPwd('');
            setSelectedRoles([]);

        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response) {
                const firstKey = Object.keys(err.response.data)[0];
                const firstErrorMessage = `${firstKey}: ${err.response.data[firstKey]}`;
                setErrMsg(firstErrorMessage);
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>Check your emails to verify your account</p>
                    <p>
                        <Link to="/login">Sign In</Link>
                    </p>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit}>

                        <label htmlFor="firstname">First Name:</label>
                        <input
                            type="text"
                            id="firstname"
                            ref={firstNameRef}
                            autoComplete="given-name"
                            onChange={(e) => setFirstName(e.target.value)}
                            value={firstName}
                            required
                        />

                        <label htmlFor="lastname">Last Name:</label>
                        <input
                            type="text"
                            id="lastname"
                            ref={lastNameRef}
                            autoComplete="family-name"
                            onChange={(e) => setLastName(e.target.value)}
                            value={lastName}
                            required
                        />

                        <label htmlFor="email">
                            Email:
                            <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="email"
                            id="email"
                            ref={emailRef}
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                            aria-invalid={validEmail ? "false" : "true"}
                            aria-describedby="emailnote"
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                        />
                        <p id="emailnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Please enter a valid email address.
                        </p>

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

                        <fieldset>
                            <legend>Select Roles:</legend>
                            {Object.entries(ROLES).map(([role, roleId]) => (
                                <div key={roleId}>
                                    <input
                                        type="checkbox"
                                        id={role}
                                        name={role}
                                        checked={selectedRoles.includes(role)}
                                        onChange={() => handleRoleChange(role)}
                                    />
                                    <label htmlFor={role}>{role}</label>
                                </div>
                            ))}
                        </fieldset>

                        <button disabled={!validEmail || !validPwd || !validMatch || !firstName || !lastName || selectedRoles.length === 0}>Sign Up</button>
                    </form>
                    <p>
                        Already registered?<br />
                        <Link to="/">Sign In</Link>
                    </p>
                </section>
            )}
        </>
    )
}

export default Register;
