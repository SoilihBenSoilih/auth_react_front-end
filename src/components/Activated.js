import { Link } from "react-router-dom";



const Activated = () => {

    return (
        <section>
            <h1>Activated</h1>
            <br />
            <p>You account is now active.</p>
            <div className="flexGrow">
                <Link to="/login">Login</Link>
            </div>
        </section>
    )
}

export default Activated
