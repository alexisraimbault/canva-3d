import { useEffect, useState } from "react";
import {
    SignedIn,
    SignedOut,
    useAuth,
} from "@kobbleio/react";
import { ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { Button } from 'primereact/button';

import { Card } from "../components/Card";
import { LoggedOutDisplay } from "../components/LoggedOutDisplay";

import { database } from '../utils.js/firebase';
import { ProjectV2Type } from "../utils.js/types";
import { ExecOptionsWithStringEncoding } from "child_process";

type IListingProps = {};
type projectListingType = { [key: string]: ProjectV2Type }
type emailsListingType = {
    [key: string]: {
        list: {
            [key: string]: {
                reatedAt: number,
                email: ExecOptionsWithStringEncoding,
            }
        }
    }
}
export const Listing = ({ }: IListingProps) => {
    const { user } = useAuth();
    const navigate = useNavigate()

    const [projects, setProjects] = useState<projectListingType>({});
    const [emailsData, setEmailsData] = useState<emailsListingType>({});

    useEffect(() => {
        fetchProjects();
        fetchProjectEmails();
    }, [user]);

    const fetchProjects = async () => {
        setProjects({})

        if (!user) {
            return
        }

        const userId = user?.id
        const userProjectsRef = ref(database, `users/${userId}/projects`)
        const snapshot = await get(userProjectsRef)
        const snapshotData = snapshot.val()
        setProjects(snapshotData)
    }

    const fetchProjectEmails = async () => {
        setProjects({})

        if (!user) {
            return
        }

        const userId = user?.id
        const userProjectsEmailsRef = ref(database, `emails/${userId}`)
        const snapshot = await get(userProjectsEmailsRef)
        const snapshotData = snapshot.val()
        setEmailsData(snapshotData || {})
    }

    const onAddProject = () => {
        navigate(`/editor`)
    }

    const onEditProject = (key: string) => {
        navigate(`/editor/${key}`)
    }

    return (
        <div className='listing__wrapper fullpage-wrapper'>
            <SignedOut>
                <LoggedOutDisplay />
            </SignedOut>
            <SignedIn>
                <>
                    <div className="custom__title">{"Projects"}</div>
                    <div className="listing__projects-container">
                        {projects && Object.keys(projects).map(key => {

                            const projectData = projects[key]
                            const nbBlocks = projectData?.items?.length || 0
                            const emails = Object.keys(emailsData).includes(key) ? emailsData[key]?.list : {}

                            return (
                                <Card
                                    key={`lp-${key}`}
                                    className="listing__card-container"
                                    onClick={() => onEditProject(key)}
                                >
                                    <div>
                                        {`${projectData.name || 'Unnamed'}`}
                                    </div>
                                    <div>
                                        {`${projectData.published ? 'Published' : 'Draft'}`}
                                    </div>
                                    <div>
                                        {`${nbBlocks} Blocks`}
                                    </div>
                                    <div>
                                        {`${Object.keys(emails).length} Emails`}
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                    <Button
                        onClick={onAddProject}
                        label='Add a Project'
                    />
                </>
            </SignedIn>
        </div>
    );
}
