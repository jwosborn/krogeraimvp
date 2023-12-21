import React from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

type LoginProps = {
    user: string,
    setUser: (value: string) => void,
    isLogin: boolean,
    setIsLogin: (value: boolean) => void
};

const checkCredentials = (user: string, setIsLogin: (value: boolean) => void) => {
    if (user.toLowerCase() === 'meaghan') {
        setIsLogin(true);
    }
};

export const Login = ({ user, setUser, isLogin, setIsLogin }: LoginProps) => {
    React.useEffect(() => {
        checkCredentials(user, setIsLogin);
    }, [user, setIsLogin]);

    return (
        <Dialog className="h-10rem w-15rem" visible={!isLogin} onHide={() => alert('Correct user must be entered to proceed!')}>
            <span className="p-float-label mt-4">
                <InputText id="in" value={user} onChange={(e) => setUser(e.currentTarget.value)} />
                <label htmlFor="in">Enter User</label>
            </span>
        </Dialog>
    );
};
