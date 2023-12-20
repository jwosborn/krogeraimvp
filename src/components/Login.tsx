import React from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

type LoginProps = {
    user: string,
    setUser: (value: string) => void
  }
  
  export const Login = ({ user, setUser }: LoginProps) => (
    <Dialog className="h-10rem w-15rem" visible={user.toLowerCase() !== 'meaghan'} onHide={() => alert('Correct user must be entered to proceed!')}>
        <span className="p-float-label mt-4">
            <InputText id="in" value={user} onChange={(e) => setUser(e.currentTarget.value)} />
            <label htmlFor="in">Enter User</label>
        </span>
    </Dialog>
    )