import React, { useEffect, useState } from 'react'
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Button } from '../components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Badge } from '../components/ui/badge';
import LeftBanner from './left-banner';
import { BaggageClaim, Eye, EyeOff, LucideSettings, Settings2Icon } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import SubmitRequestDialog from './manage-requests/submit-request-dialog';

const Login = () => {
    const navigate = useNavigate();
    const { login, isLoading, isAuthenticated } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    //const [loginError, setLoginError] = useState("");
    const [error, setError] = useState("");
    const [eyeopen, setEyeopen] = useState(false);

    // Redirect to dashboard if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    const validateForm = () => {
        if (!email.trim()) {
            setError("Email is required");
            return false;
        }
        
        if (!password.trim()) {
            setError("Password is required");
            return false;
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address");
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        //setLoginError("");
        setError("");
        
        if (!validateForm()) {
            return;
        }

        try {
            await login(email, password);
            navigate("/dashboard");
            window.location.reload()
        } catch (err) {
            const errorMessage = err instanceof Error 
                ? err.message 
                : "Invalid email or password. Please try again.";
            setError(errorMessage);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background/20">
            <div className="w-full z-30 grid grid-cols-1 lg:grid-cols-2 min-h-screen">
                {/* Left Banner */}
                <LeftBanner />

                {/* Right Form */}
                <div className="bg-gray-100 dark:bg-blue-950 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12">
                    <div className="w-full max-w-lg">
                        <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Sign In</h1>
                        <p className="text-muted-foreground">Enter your credentials to access your account</p>
                        </div>
                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                                <p className="text-sm text-destructive flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {error}
                                </p>
                            </div>
                        )}
                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email input */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-14 bg-input border-border focus:ring-2 focus:ring-primary/30 focus:border-primary transition rounded-none"
                                    required
                                />     
                            </div>

                            {/* Password input */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                                Password
                                </Label>
                                <div className='w-full flex items-center gap-0'>
                                    <Input
                                        id="password"
                                        type={eyeopen ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-14 bg-input border-border focus:ring-2 focus:ring-primary/30 focus:border-primary transition rounded-none"
                                        required
                                    />
                                    <div className='flex items-center bg-input h-14 pr-2'>
                                    {
                                        eyeopen ? 
                                            <Eye 
                                                className='cursor-pointer'
                                                onClick={() => setEyeopen(false)}
                                            /> :
                                            <EyeOff
                                                className='cursor-pointer'
                                                onClick={() => setEyeopen(true)}
                                            />  
                                    }
                                    </div>
                                </div>
                            </div>

                            {/* Remember me & forgot password */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    checked={rememberMe}
                                    onCheckedChange={(checked) => setRememberMe(checked)}
                                    className="border-border"
                                />
                                <Label
                                    htmlFor="remember"
                                    className="text-sm font-normal text-muted-foreground cursor-pointer"
                                >
                                    Remember me
                                </Label>
                                </div>
                                <a href="#" className="text-sm font-medium text-primary hover:text-primary/80 transition">
                                Forgot password?
                                </a>
                            </div>

                            {/* Sign in button */}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 bg-blue-950 hover:bg-blue-950/80 dark:bg-gray-200 dark:hover:bg-gray-300 font-semibold transition disabled:opacity-70 rounded-none"
                            >
                                {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Signing in...
                                </span>
                                ) : (
                                "Sign in"
                                )}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="hidden items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-border"></div>
                        <span className="text-xs font-medium text-muted-foreground">OR</span>
                        <div className="flex-1 h-px bg-border"></div>
                        </div>

                        {/* Social login options */}
                        <div className="hidden grid-cols-2 gap-3 mb-6">
                        <Button
                            variant="outline"
                            className="h-10 border-border rounded-lg hover:bg-muted transition"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <span className="ml-2 hidden sm:inline text-sm">Google</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-10 border-border rounded-lg hover:bg-muted transition"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z"/>
                            </svg>
                            <span className="ml-2 hidden sm:inline text-sm">Facebook</span>
                        </Button>
                        </div>

                        {/* Sign up link */}
                        <p className="my-6 text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link to="/signup" className="font-semibold text-primary hover:text-primary/80 transition">
                            Sign up
                        </Link>
                        </p>

                        {/* Footer text */}
                        <p className="text-center text-xs text-muted-foreground mt-6">
                        By signing in, you agree to our{" "}
                        <a href="#" className="hover:text-foreground transition">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="hover:text-foreground transition">
                            Privacy Policy
                        </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login