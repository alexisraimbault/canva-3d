import React, { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
    children,
    className,
    ...props
}) => {
    return (
        <div
            className={`card__wrapper ${props?.onClick ? 'card__wrapper--clickable' : ''} ${className} `}
            {...props}
        >
            {children}
        </div>
    );
};
