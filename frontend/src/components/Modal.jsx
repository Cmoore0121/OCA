import React, { useState } from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>Close</button>
                {children}
            </div>
        </div>
    );
};


const LinkedInButton = ({ url, text }) => {
    const handleClick = () => {
        // Ensure the URL starts with http:// or https://
        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            console.error('Provided URL is not valid:', url);
        }
    };

    if (!url) {
        return <p>NO URL available</p>;
    }

    return (
        <button className='button blue-button' onClick={handleClick} style={{ cursor: 'pointer' }}>
            {text}
        </button>
    );
};

export  {Modal, LinkedInButton};