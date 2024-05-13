// import React from 'react';
// import { AppContext, AppContextTypes } from '../../utils/AppContext';
import { CircularProgress } from '@nextui-org/react';

interface LoaderProps {
    lang: `bg-BG` | `en-US`;
}

const Loader : React.FC<LoaderProps> = ({lang}) : JSX.Element => {
    const { loadingText, ariaLabel } : { loadingText: string, ariaLabel: string } = lang === "bg-BG" ? LoaderText.bg : LoaderText.en;

    return (
        <>
            <div className='flex items-center justify-center h-[91vh] pt-20 space-x-2'>
                <h1 className='text-3xl font-bold'>{loadingText}</h1>
                <CircularProgress color='primary' aria-label={ariaLabel} size='lg' />
            </div>
        </>
    )
}


export default Loader;


const LoaderText = {
    bg : {
        loadingText : 'Зареждане...',
        ariaLabel : 'Зареждане'
    } as {loadingText : string, ariaLabel : string},
    en : {
        loadingText : 'Loading...',
        ariaLabel : 'Loading'
    } as {loadingText : string, ariaLabel : string}
};