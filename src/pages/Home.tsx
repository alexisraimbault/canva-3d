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

    return (
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
        </div>
    );
};

export default Home;