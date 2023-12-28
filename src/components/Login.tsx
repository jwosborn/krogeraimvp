import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";

type LoginProps = {
    user: string,
    setUser: (value: string) => void,
    isLogin: boolean,
    setIsLogin: (value: boolean) => void
};

const checkCredentials = (user: string, setIsLogin: (value: boolean) => void, setError: (value: boolean) => void) => {
    if (user.toLowerCase() === 'meaghan') {
        setError(false)
        setIsLogin(true);
    } else {
        setError(true)
    }
};

export const Login = ({ user, setUser, isLogin, setIsLogin }: LoginProps) => {
    const [isError, setError] = useState(false);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            checkCredentials(user, setIsLogin, setError)
        }
    }

    return (
        <Dialog className="h-10rem w-15rem" visible={!isLogin} onHide={() => alert('Correct user must be entered to proceed!')}>
            <span className="p-float-label mt-4">
                <InputText id="in" value={user} onChange={(e) => setUser(e.currentTarget.value)} onKeyDown={handleKeyPress} />
                <label htmlFor="in">Enter User</label>
            </span>
            {isError && <Message className='mt-2' severity="error" text="Invalid Credentials" />}
        </Dialog>
    );
};
