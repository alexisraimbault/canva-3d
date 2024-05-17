import {
    LoginButton,
} from "@kobbleio/react";
import { Button } from 'primereact/button';

type ILoggedOutDisplayProps = {};

export const LoggedOutDisplay = ({ }: ILoggedOutDisplayProps) => {
    return (
        <div className="logged-out__wrapper">
            <div>{"You need to log in to access this page"}</div>
            <LoginButton>
                <Button
                    label='Login'
                />
            </LoginButton>
        </div>
    );
}
