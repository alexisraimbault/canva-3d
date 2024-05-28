import {
    LoginButton,
    LogoutButton,
    PricingLink,
    ProfileLink,
    SignedIn,
    SignedOut,
    // useAuth,
    // useKobble
} from "@kobbleio/react";
import { Button } from 'primereact/button';

import { Project } from "./Project";

const Home = () => {
    // const { user } = useAuth();
    // const { kobble } = useKobble();

    // const [actionResult, setActionResult] = useState<any>(null);

    // const getAccessToken = async () => {
    //     const token = await kobble?.getAccessToken();
    //     setActionResult(token);
    // };

    // const getIdToken = async () => {
    //     const token = await kobble?.getIdToken();
    //     setActionResult(token);
    // };

    // const getUser = async () => {
    //     const user = await kobble?.getUser();
    //     setActionResult(user);
    // };

    const hostname = window.location.hostname.split(".com")[0].split(".")[0]
    const isProject = !['www', 'canva-3d', 'localhost'].includes(hostname)
    console.log({ hostname, isProject })

    return isProject ? (
        <Project
            projectNameProps={hostname}
        />
    ) :
        (
            <div className="homepage__wrapper fullpage-wrapper">
                <SignedOut>
                    <div className="homepage__btns-container">
                        <LoginButton>
                            <Button
                                label='Login'
                            />
                        </LoginButton>
                    </div>
                </SignedOut>
                <SignedIn>
                    <div className="homepage__btns-container">
                        <LogoutButton>
                            <Button
                                label='Logout'
                            />
                        </LogoutButton>
                        <ProfileLink>

                            <Button
                                label='Profile'
                            />
                        </ProfileLink>
                        <PricingLink>
                            <Button
                                label='Pricing'
                            />
                        </PricingLink>
                    </div>
                </SignedIn>
                {/* <a href="https://fr.freepik.com/vecteurs-libre/collection-formes-geometriques-glitch_4057925.htm#fromView=search&page=4&position=18&uuid=117043cb-8f60-418b-8a72-0be82c67a523">Image de freepik</a> */}
            </div>
        );
};

export default Home;