import { useEffect, useState } from "react";
import {
  //   SignedIn,
  //   SignedOut,
  //   useAuth,
  //   LogoutButton,
  PricingLink,
  useAccessControl,
} from "@kobbleio/react";
import { ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";

import { GradientButton } from "../components/GradientButton";
import { Card } from "../components/Card";
// import { LoggedOutDisplay } from "../components/LoggedOutDisplay";

import { database } from "../utils.js/firebase";
import { ProjectV2Type } from "../utils.js/types";
import { ExecOptionsWithStringEncoding } from "child_process";

type IListingProps = {};
type projectListingType = { [key: string]: ProjectV2Type };
type emailsListingType = {
  [key: string]: {
    list: {
      [key: string]: {
        reatedAt: number;
        email: ExecOptionsWithStringEncoding;
      };
    };
  };
};

export const Listing = ({}: IListingProps) => {
  // const { user } = useAuth();
  const user = { id: "Y4Cj9KpABrOZkJAOr7AwQXJAN2L2" };
  const { quotas } = useAccessControl();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<projectListingType>({});
  const [emailsData, setEmailsData] = useState<emailsListingType>({});

  const projectKeys = projects ? Object.keys(projects) : [];
  const usedQuotas = projectKeys?.length || 0;
  const quotasTotal = quotas[0]?.limit || 1;
  const canCreate = usedQuotas < quotasTotal;

  useEffect(() => {
    fetchProjects();
    fetchProjectEmails();
  }, [user]);

  const fetchProjects = async () => {
    setProjects({});

    if (!user) {
      return;
    }

    const userId = user?.id;
    const userProjectsRef = ref(database, `users/${userId}/projects`);
    const snapshot = await get(userProjectsRef);
    const snapshotData = snapshot.val();
    setProjects(snapshotData);
  };

  const fetchProjectEmails = async () => {
    setProjects({});

    if (!user) {
      return;
    }

    const userId = user?.id;
    const userProjectsEmailsRef = ref(database, `emails/${userId}`);
    const snapshot = await get(userProjectsEmailsRef);
    const snapshotData = snapshot.val();
    setEmailsData(snapshotData || {});
  };

  const onAddProject = () => {
    navigate(`/editor`);
  };

  const onEditProject = (key: string) => {
    navigate(`/editor/${key}`);
  };

  return (
    <div className="listing__wrapper fullpage-wrapper">
      {/* <SignedOut>
                <LoggedOutDisplay />
            </SignedOut>
            <SignedIn> */}
      <>
        <div className="listing__top-wrapper">
          <div className="custom__title">{"My Projects"}</div>
          {/* <div className="listing__user-display__wrapper">
                            {user?.pictureUrl && user?.pictureUrl?.length > 0 && (
                                <img
                                    width={36}
                                    src={user.pictureUrl}
                                    className="listing__user-display__profile-pic"
                                />
                            )}
                            <div className="listing__user-display__texts">
                                {user?.name && user?.name?.length > 0 && (
                                    <div className="listing__user-display__name">
                                        {user?.name}
                                    </div>
                                )}
                                {user?.email && user?.email?.length > 0 && (
                                    <div className="listing__user-display__email">
                                        {user?.email}
                                    </div>
                                )}
                            </div>
                            <LogoutButton>
                                <a className="listing__user-display__logout-btn">
                                    {'Logout'}
                                </a>
                            </LogoutButton>
                        </div> */}
        </div>
        <div className="listing__projects-container">
          {projects &&
            projectKeys.map((key) => {
              const projectData = projects[key];
              const nbBlocks = projectData?.items?.length || 0;
              const emails = Object.keys(emailsData).includes(key)
                ? emailsData[key]?.list
                : {};

              return (
                <Card
                  key={`lp-${key}`}
                  className="listing__card-container"
                  onClick={() => onEditProject(key)}
                >
                  <div>{`${projectData.name || "Unnamed"}`}</div>
                  <div>
                    {`${projectData.published ? "Published" : "Draft"}`}
                  </div>
                  <div>{`${nbBlocks} Blocks`}</div>
                  <div>{`${Object.keys(emails).length} Emails`}</div>
                </Card>
              );
            })}
        </div>
        <div className="listing__quotas-display">
          {`${usedQuotas}/${quotasTotal} Quotas Used`}
        </div>
        {canCreate && (
          <GradientButton
            fontSize={1.5}
            onClick={onAddProject}
            label="New Project"
          />
        )}
        {!canCreate && (
          <PricingLink>
            <a className="listing__pricing-btn">{"Upgrade"}</a>
          </PricingLink>
        )}
      </>
      {/* </SignedIn> */}
    </div>
  );
};
