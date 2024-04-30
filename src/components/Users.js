import { useState, useEffect } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Link, useNavigate, useLocation } from 'react-router-dom';


export const Users = () => {
    const [users, setUsers] = useState();
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        let isMounted = true
        let controller = new AbortController()

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get('/api/auth/list', {
                     signal: controller.signal 
                    })
                isMounted && setUsers(response.data);
                    
            } catch (error) {
                navigate('/login', {state: {from: location},  replace:true});
            }
        }

        getUsers()
        return () => {
            isMounted = false
            controller.abort()
        }
    }, [])

    return (
        <article>
            <h2>Users List</h2>
            {
                users?.length
                    ? (
                        <ul>
                            {users.map((user, i) => <li key={i}>{user?.email}</li>)}
                        </ul>
                    ) : <p> No users to display </p>
            }
        </article>
    )
}
