import React from 'react'

const ButtonLoader = ({ loadingText }) => {
    return (
        <span className="flex items-center gap-2 md:gap-4 text-xl md:text-4xl italic font-extralight">
            <svg className="animate-spin h-6 w-6 md:h-32 md:w-32" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {loadingText}
        </span>
    )
}

export default ButtonLoader