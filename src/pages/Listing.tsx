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

type IListingProps = {};
type projectListingType = { [key: string]: ProjectV2Type }
export const Listing = ({ }: IListingProps) => {
    const { user } = useAuth();
    const navigate = useNavigate()

    const [projects, setProjects] = useState<projectListingType>({});

    useEffect(() => {
        fetchProjects();
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

                            return (
                                <Card
                                    key={`lp-${key}`}
                                    className="listing__card-container"
                                    onClick={() => onEditProject(key)}
                                >
                                    <div>
                                        {`${nbBlocks} Blocks`}
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
