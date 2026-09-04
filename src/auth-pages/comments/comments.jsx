import React, { useState, useRef, useEffect, useContext } from 'react';
import './comments.css';
import CommentMessages from './comment-messages';
import { CornerDownLeft } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import { getActionComments, getComments, sendActionComment, sendComment } from '../../utils/folders';
import SkeletonComponent from '../../components/skeleton-component';

const Comments = ({ activity_id, type }) => {

    const { token, user, record, refreshRecord } = useContext(AppContext);
    const [messages, setMessages] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState();
    const [reloading, setReloading] = useState(false);
    
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const [initval, setInitval] = useState(0);

    setTimeout(() => {
        setInitval(initval+1)
    }, 5000)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const message = {
            //id: Date.now(),
            activity_id,
            comment: newMessage,
            sender: user && JSON.parse(user).email,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            //isOwn: true,
            //status: 'sent'
        };

        setMessages([...messages, message]);
        setNewMessage('');
        inputRef.current?.focus();

        // Simulate delivery status update
        //setTimeout(() => {
        type === 'folders' ?
            sendComment(token, message, setSuccess, setError, setSending) :
            sendActionComment(token, message, setSuccess, setError, setSending);
        //}, 1000);

        /**setTimeout(() => {
            setMessages(prevMessages =>
                prevMessages.map(msg =>
                    msg.id === message.id
                        ? { ...msg, status: 'delivered' }
                        : msg
                )
            );
        }, 1000);

        // Simulate read status
        setTimeout(() => {
            setMessages(prevMessages =>
                prevMessages.map(msg =>
                    msg.id === message.id
                        ? { ...msg, status: 'read' }
                        : msg
                )
            );
        }, 2000);*/
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            handleSendMessage(e);
        }
    };

    useEffect(() => {
        type === 'folders' ?
        getComments(token, { activity_id }, setMessages, setError, messages ? setReloading : setLoading) :
        getActionComments(token, { activity_id }, setMessages, setError, messages ? setReloading : setLoading)
    }, [initval])

    console.log(initval)
    
    return (
        <div className="whatsapp-chat">
            {/* Chat Header */}
            {/*<div className="chat-header !bg-background !border !border-muted-foreground/30 !rounded-t-xl">
                <div className="header-avatar !bg-accent dark:!bg-brand">
                    <span className="avatar-text">JD</span>
                </div>
                <div className="header-info">
                    <h3>John Doe</h3>
                    <span className="header-status !text-accent dark:!text-brand">Online</span>
                </div>
            </div>*/}

            {/* Messages Container */}
            <div className="messages-container !border !border-muted-foreground/20 !bg-gray-100 dark:!bg-[#030f36] rounded-t-xl p-2">
                {
                    loading ? <SkeletonComponent /> :
                    (messages && messages.length > 0 ? messages.map((msg) => (
                        <CommentMessages
                            key={msg.id}
                            messages={[msg.comment]}
                            sender={msg.sender}
                            timestamp={msg.created_at}
                            isOwn={user && JSON.parse(user).email === msg.sender}
                            status={newMessage === msg.comment && sending ? 'sending...' : msg.status}
                        />
                    )) : <span className='text-muted-foreground/30 text-lg'>No comment made on this activity yet.</span>)
                }
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="message-input-container !bg-background !border !border-muted-foreground/30 !rounded-b-xl">
                <form onSubmit={handleSendMessage} className="input-form">
                    <input
                        ref={inputRef}
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="message-input !border !border-accent dark:!border-brand dark:!text-accent"
                    />
                    <button type="submit" className="send-button !bg-accent dark:!bg-brand">
                        <CornerDownLeft className='w-24 h-24 text-white dark:text-accent' />
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Comments