
type GradientButtonPropsTypes = {
    label: string,
    className?: string,
    onClick?: () => void,
    gradientColors?: string[],
    textColor?: string,
    borderRadius?: number,
    isBold?: boolean,
    fontSize?: number,
};

export const GradientButton = ({
    label,
    className = "",
    onClick = () => { },
    gradientColors = ['24FFC0', '4589E3'],
    textColor = 'ffffff',
    borderRadius = 6,
    isBold = true,
    fontSize = 2,
}: GradientButtonPropsTypes) => {
    return (
        <button
            className={`custom-button__btn ${className}`}
            onClick={onClick}
            style={{
                borderRadius: `${borderRadius}px`,
                color: `#${textColor}`,
                backgroundImage: `linear-gradient(to left, #${gradientColors[0]}, #${gradientColors[1]}, #${gradientColors[0]})`,
                fontFamily: isBold ? "visby_heavy" : "visby_regular",
                fontSize: `${fontSize}em`,
            }}
        >
            {label}
        </button>
    );
}
