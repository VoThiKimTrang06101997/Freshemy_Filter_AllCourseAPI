import React from "react";

const WarningIcon: React.FC = () => {
    return (
        <>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" fill="#FFFF00" />
                <path
                    d="M9.14939 7.8313C8.57654 5.92179 10.0064 4 12 4V4C13.9936 4 15.4235 5.92179 14.8506 7.8313L13.2873 13.0422C13.2171 13.2762 13.182 13.3932 13.128 13.4895C12.989 13.7371 12.7513 13.9139 12.4743 13.9759C12.3664 14 12.2443 14 12 14V14C11.7557 14 11.6336 14 11.5257 13.9759C11.2487 13.9139 11.011 13.7371 10.872 13.4895C10.818 13.3932 10.7829 13.2762 10.7127 13.0422L9.14939 7.8313Z"
                    stroke="#33363F"
                    strokeWidth="2"
                />
                <circle cx="12" cy="19" r="2" stroke="#33363F" strokeWidth="2" />
            </svg>
        </>
    );
};

export default WarningIcon;
