import {
    LoginButton,
    // LogoutButton,
    // PricingLink,
    // ProfileLink,
    SignedIn,
    SignedOut,
    // useAuth,
    // useKobble
} from "@kobbleio/react";
import { useNavigate } from "react-router-dom";
// import { Button } from 'primereact/button';

import { Project } from "./Project";
import { HomepageBlob1 } from "../components/HomepageBlob1";
import { HomepageBlob2 } from "../components/HomepageBlob2";
import { HomepageShape } from "../components/HomepageShape";

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
    const isProject = !['www', 'canva-3d', '3d-pages', 'localhost'].includes(hostname)
    // console.log({ hostname, isProject })

    const navigate = useNavigate()

    const goToDashboard = () => {
        navigate(`/listing`)
    }

    const renderBlob1 = () => {
        return (
            <div className="homepage__blob-1-container">
                <HomepageBlob1 />
            </div>
        )
    }

    const renderBlob2 = () => {
        return (
            <div className="homepage__blob-2-container">
                <HomepageBlob2 />
            </div>
        )
    }

    const renderShape = () => {
        return (
            <div className="homepage__shape-container">
                <HomepageShape />
            </div>
        )
    }

    return isProject ? (
        <Project
            projectNameProps={hostname}
        />
    ) :
        (
            <div className="homepage__wrapper">
                <div className="homepage__inner">
                    <img
                        className="homepage__logo"
                        alt="3D Pages Logo"
                        src={"Logo_V2_bw_flat_white.png"}
                        width={`140px`}
                    />
                    <div className="homepage__hero">
                        <div className="homepage__hero-left">
                            <h1 className="homepage__title-1">
                                {'Create Futuristic Websites'}
                            </h1>
                            <h2 className="homepage__subtitle-1">
                                {'Experience the future of web design with intuitive tools and stunning 3D elements'}
                            </h2>
                            <SignedOut>
                                <LoginButton>
                                    <button
                                        className="homepage__cta"
                                    >
                                        {'Get started'}
                                    </button>
                                </LoginButton>
                            </SignedOut>
                            <SignedIn>
                                <button
                                    className="homepage__cta"
                                    onClick={goToDashboard}
                                >
                                    {'Dashboard'}
                                </button>
                            </SignedIn>
                        </div>
                        <div className="homepage__hero-right">
                            {renderBlob1()}
                        </div>
                    </div>
                </div>
                <div className="homepage__inner">
                    <div className="homepage__cards">
                        <div className="homepage__card__container">
                            <div className="homepage__card__title">
                                {'Intuitive Design Tools'}
                            </div>
                            <div className="homepage__card__content">
                                {'Easily drag and drop elements to create stunning pages'}
                            </div>
                            {renderShape()}
                        </div>
                        <div className="homepage__card__container">
                            <div className="homepage__card__title">
                                {'Advanced 3D Elements'}
                            </div>
                            <div className="homepage__card__content">
                                {'Integrate cutting-edge 3D models seamlessly'}
                            </div>
                            {renderShape()}
                        </div>
                        <div className="homepage__card__container">
                            <div className="homepage__card__title">
                                {'Responsive Layouts'}
                            </div>
                            <div className="homepage__card__content">
                                {'Ensure your site looks great on any device'}
                            </div>
                            {renderShape()}
                        </div>
                    </div>
                    {renderBlob2()}
                </div>
                <div className="homepage__footer__wrapper">
                    <div className="homepage__footer__inner">
                        <div className="homepage__footer__text">{"Made with "}</div>
                        <i className="homepage__footer__icon pi pi-sparkles"></i>
                        <div className="homepage__footer__text">{"By Alexis Raimbault"}</div>
                    </div>
                </div>
            </div>
        );
};

export default Home;