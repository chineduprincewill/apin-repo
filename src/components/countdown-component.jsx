import React, { useEffect, useState } from 'react'

const CountdownComponent = () => {
    const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    });
    //const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
    // Set launch date to 90 days from now (only once)
    const launchDate = new Date('2026-03-23 00:00:00');
    launchDate.setDate(launchDate.getDate() + 19);

    const calculateCountdown = () => {
        const now = new Date().getTime();
        const distance = launchDate.getTime() - now;

        if (distance > 0) {
        setCountdown({
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            ),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
        } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
    };

    // Calculate immediately on mount
    calculateCountdown();

    // Then update every second
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
    }, []);

    /**const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
        setSubscribed(true);
        setEmail("");
        setTimeout(() => setSubscribed(false), 3000);
    }
    };*/

    const CountdownItem = ({
    value,
    label,
    }) => (
    <div className="flex flex-col items-center gap-2">
        <div className="relative h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg blur-xl"></div>
        <div className="relative bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30 rounded-lg w-full h-full flex items-center justify-center backdrop-blur-sm">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            {String(value).padStart(2, "0")}
            </span>
        </div>
        </div>
        <span className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">
        {label}
        </span>
    </div>
    );

    return (
    <div className="min-h-screen w-full overflow-hidden">
        {/* Animated background elements */}
        <div className="fixed inset-0 -z-10">
        <div className="gradient-dark absolute inset-0"></div>

        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-pulse -z-10 delay-1000"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse -z-10 delay-500"></div>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-2">
        <div className="w-full max-w-2xl mx-auto text-center">
            {/* Logo/Brand */}
            <div className="mx-auto mb-4 w-12 h-12 bg-gradient-to-br from-accent to-brand rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-gradient-to-br from-secondary/20 to-secondary/80 rounded-md"></div>
            </div>

            {/* Heading */}
            <p className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="block text-foreground mb-2">Something Amazing</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand via-primary to-accent">
                is Coming Soon
            </span>
            </p>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-xl mx-auto leading-relaxed">
            We&apos;re working on something incredible, <span className='text-accent font-semibold'>a robust and feature-right analytics and reporting module</span>.<br/> You will be notified the moment
            we launch.
            </p>

            {/* Countdown */}
            <div className="mb-12 sm:mb-16">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 justify-center">
                <CountdownItem value={countdown.days} label="Days" />
                <CountdownItem value={countdown.hours} label="Hours" />
                <CountdownItem value={countdown.minutes} label="Minutes" />
                <CountdownItem value={countdown.seconds} label="Seconds" />
            </div>
            </div>

            {/* Email subscription form */}
            {/**<form onSubmit={handleSubscribe} className="mb-12 sm:mb-16">
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 h-12 sm:h-13 bg-background/50 border-primary/30 text-foreground placeholder:text-muted-foreground focus:border-primary"
                />
                <Button
                type="submit"
                className="h-12 sm:h-13 px-6 sm:px-8 bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
                >
                {subscribed ? "Subscribed!" : "Notify Me"}
                </Button>
            </div>
            {subscribed && (
                <p className="text-accent text-sm mt-3 animate-in fade-in">
                ✓ Thank you for subscribing!
                </p>
            )}
            </form>*/}

            {/* Social links */}
            {/**<div className="flex justify-center gap-6 sm:gap-8">
            <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
                aria-label="Twitter"
            >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7a10.6 10.6 0 01-10-10.5z" />
                </svg>
            </a>
            <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
                aria-label="LinkedIn"
            >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                </svg>
            </a>
            <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
                aria-label="GitHub"
            >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.544 2.914 1.186.092-.923.35-1.544.636-1.9-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
            </a>
            </div>*/}
        </div>
        </div>
    </div>
    );
}

export default CountdownComponent