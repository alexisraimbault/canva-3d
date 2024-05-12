import { useParams } from 'react-router-dom'

type IProjectProps = {};

export const Project = ({ }: IProjectProps) => {
    const { projectId: urlProjectId } = useParams()

    return (
        <div>
            {`Hello from Project ${urlProjectId}`}
        </div>
    );
}
