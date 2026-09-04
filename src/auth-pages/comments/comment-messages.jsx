// WhatsAppMessage.jsx
import React from 'react';
import './comments.css';

function CommentMessages({ 
    messages, 
    sender, 
    timestamp, 
    isOwn = true,
    status = 'sent' // 'sent', 'delivered', 'read'
}) {
    const getStatusIcon = () => {
        switch(status) {
            case 'sent':
                return '✓';
            case 'delivered':
                return '✓✓';
            case 'read':
                return '✓✓';
            default:
                return '✓';
        }
    };

    return (
        <div className={`message-wrapper ${isOwn ? 'own-message' : 'other-message'} !mb-4`}>
            <div className="message-container">
                <div className={`message-bubble ${!isOwn && '!bg-foreground/10 before:!bg-foreground/10'}`}>
                    <span className='text-xs italic font-extralight text-accent dark:text-brand'>{sender}</span>
                    <div className={`message-content ${isOwn && '!text-accent'}`}>
                        {messages.map((msg, index) => (
                            <div key={index} className="message-text">
                                {msg}
                            </div>
                        ))}
                    </div>
                    <div className="message-meta">
                        <span className="message-time">{timestamp}</span>
                        {isOwn && (
                            <span className="message-status">
                                {status === 'read' ? (
                                    <span className="status-read">✓✓</span>
                                ) : (
                                    <span className="status-delivered">✓✓</span>
                                )}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommentMessages;