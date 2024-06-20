import {
    LoginButton,
} from "@kobbleio/react";

import { GradientButton } from "./GradientButton";

type ILoggedOutDisplayProps = {};

export const LoggedOutDisplay = ({ }: ILoggedOutDisplayProps) => {
    return (
        <div className="logged-out__wrapper">
            <div className="logged-out__text">{"You need to log in to access this page"}</div>
            <LoginButton>
                <GradientButton
                    label='Login'
                    className="logged-out__btn"
                />
            </LoginButton>
        </div>
    );
}
