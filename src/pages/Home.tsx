import { LoginButton, SignedIn, SignedOut } from "@kobbleio/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, push } from "firebase/database";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import { Project } from "./Project";
import { BlobPerlin } from "../components/BlobPerlin";
import { BlobPlanet } from "../components/BlobPlanet";
import { BlobNetwork } from "../components/BlobNetwork";
import { BlobPerlinMorph } from "../components/BlobPerlinMorph";
import { HomepageShape } from "../components/HomepageShape";
import { GradientButton } from "../components/GradientButton";

import { responsiveTextSize } from "../utils.js/functions";
import { database } from "../utils.js/firebase";

const Home = () => {
  const hostname = window.location.hostname.split(".com")[0].split(".")[0];
  const isProject = !["www", "canva-3d", "3d-pages", "localhost"].includes(
    hostname
  );

  const [isEmailGatherPopupVisible, setIsEmailGatherPopupVisible] =
    useState(false);
  const [emailGatherPopupInputText, setEmailGatherPopupInputText] =
    useState("");
  const [isEmailRegistered, setIsEmailRegistered] = useState(false);

  useEffect(() => {
    setIsEmailRegistered(false);
  }, [emailGatherPopupInputText]);

  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate(`/dashboard`);
  };

  const renderBlob1 = () => {
    return (
      <div className="homepage__blob-1-container">
        <BlobPerlin interaction="timer" />
      </div>
    );
  };

  const renderBlob2 = () => {
    return (
      <div className="homepage__blob-2-container">
        <BlobNetwork interaction="scroll" />
      </div>
    );
  };

  const renderShape = (n: number) => {
    return (
      <div className="homepage__shape-container">
        {n === 1 && <HomepageShape />}
        {n === 2 && <BlobPlanet interaction="timer" />}
        {n === 3 && <BlobPerlinMorph interaction="timer" />}
      </div>
    );
  };

  const togglePopup = () => {
    setIsEmailGatherPopupVisible(true);
  };

  const onAddEmail = async () => {
    if (!emailGatherPopupInputText || emailGatherPopupInputText.length <= 0) {
      return;
    }

    if (isEmailRegistered) {
      return;
    }

    const projectEmailRef = ref(database, `emails/homepage/list`);
    const emailData = {
      email: emailGatherPopupInputText,
      createdAt: Date.now(),
    };
    await push(projectEmailRef, emailData);
    setIsEmailRegistered(true);
  };

  const displayPopup = false;

  const defaultPopupTexts = {
    title: "Early access",
  };

  return isProject ? (
    <Project projectNameProps={hostname} />
  ) : (
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
              {"Build Captivating Websites"}
            </h1>
            <h2 className="homepage__subtitle-1">
              {
                "Integrate 3D elements for memorable user experiences and stand out from the competition"
              }
            </h2>
            {/* <SignedOut>
                                {!displayPopup ? (
                                    <LoginButton>
                                        <button
                                            className="homepage__cta"
                                        >
                                            {'Get started'}
                                        </button>
                                    </LoginButton>
                                ) : (
                                    <button
                                        className="homepage__cta"
                                        onClick={togglePopup}
                                    >
                                        {'Get started'}
                                    </button>
                                )}
                            </SignedOut> */}
            {/* <SignedIn> */}
            <button className="homepage__cta" onClick={goToDashboard}>
              {"Dashboard"}
            </button>
            {/* </SignedIn> */}
          </div>
          <div className="homepage__hero-right">{renderBlob1()}</div>
        </div>
      </div>
      <div className="homepage__inner homepage__inner-2">
        <div className="homepage__cards">
          <div className="homepage__card__container">
            <div className="homepage__card__title">{"Fast Loading Speeds"}</div>
            <div className="homepage__card__content">
              {
                "Our platform optimizes your website's performance, ensuring quick and smooth access to all your content."
              }
            </div>
            {renderShape(1)}
          </div>
          <div className="homepage__card__container">
            <div className="homepage__card__title">
              {"Advanced 3D Elements"}
            </div>
            <div className="homepage__card__content">
              {
                "Easily integrate advanced 3D models and animations into your website to create immersive and memorable user experiences that stand out from the competition."
              }
            </div>
            {renderShape(2)}
          </div>
          <div className="homepage__card__container">
            <div className="homepage__card__title">{"Responsive Design"}</div>
            <div className="homepage__card__content">
              {
                "Our responsive design tools automatically adjust your site's layout and elements to provide an optimal viewing experience on desktops, tablets, and smartphones."
              }
            </div>
            {renderShape(3)}
          </div>
        </div>
        {renderBlob2()}
      </div>
      <div className="homepage__footer__wrapper">
        <div className="homepage__footer__inner">
          <div className="homepage__footer__text">{"Made with "}</div>
          <i className="homepage__footer__icon pi pi-sparkles"></i>
          <div className="homepage__footer__text">{"By Alexis"}</div>
        </div>
      </div>
      <Dialog
        header={null}
        visible={isEmailGatherPopupVisible}
        style={{ width: "600px" }}
        onHide={() => setIsEmailGatherPopupVisible(false)}
      >
        <div className="homepage__email-popup-content">
          <div className="homepage__email-popup-inner">
            <div className="homepage__email-popup-title">
              {defaultPopupTexts.title}
            </div>
            <div className="homepage__email-popup-text">
              {"Enter your email to receive a private access link"}
            </div>
            <InputText
              value={emailGatherPopupInputText || ""}
              onChange={(e) => setEmailGatherPopupInputText(e.target.value)}
              placeholder="Email"
              className="homepage__email-popup-input"
            />
            {isEmailRegistered && (
              <div className="homepage__email-popup-confirm">
                {"Your email is registered, we will contact you shortly !"}
              </div>
            )}
            <GradientButton
              className="homepage__email-popup-btn"
              label={"Register"}
              onClick={onAddEmail}
              isBold
              fontSize={responsiveTextSize(1.5)}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Home;
