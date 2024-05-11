import { FC } from "react";
import {
    LoginButton,
} from "@kobbleio/react";
type ILoggedOutDisplayProps = {};

export const LoggedOutDisplay = ({ }: ILoggedOutDisplayProps) => {
    return (
        <div className="flex items-center gap-2">
            <div>{"You need to leg in to access this page"}</div>
            <LoginButton>
                <button className="rounded-full border border-[#236456] bg-[#112220] text-[#33C6AB] py-1 px-3">
                    Login
                </button>
            </LoginButton>
        </div>
    );
}
