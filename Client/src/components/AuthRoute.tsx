import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import { useNavigate } from 'react-router-dom';

/* eslint-disable */
export interface IAuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = (props) => {
    const { children } = props;
    const auth = getAuth();
    // const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const AuthCheck = onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoading(false);
            } else {
                console.log('unauthorized');
                // navigate('/');
            }
        });

        return () => AuthCheck();
    }, [auth]);

    if (loading) return <p>loading ...</p>;

    return <>{children}</>;
};

export default AuthRoute;
