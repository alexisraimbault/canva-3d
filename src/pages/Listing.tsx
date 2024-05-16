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
import { IProject } from "../utils.js/types";

type IListingProps = {};
type projectListingType = { [key: string]: IProject }
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

                            // const projectData = projects[key]
                            return (
                                <Card
                                    key={`lp-${key}`}
                                    onClick={() => onEditProject(key)}
                                >
                                    {key}
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
