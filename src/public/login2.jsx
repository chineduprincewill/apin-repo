import React, { useEffect, useState } from 'react'
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Button } from '../components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
    const navigate = useNavigate();
    const { login, isLoading, isAuthenticated } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");

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
        setError("");
        
        if (!validateForm()) {
            return;
        }

        try {
            await login(email, password); // Pass rememberMe to login function
            // No need for reload - React state should handle the redirect
        } catch (err) {
            const errorMessage = err instanceof Error 
                ? err.message 
                : "Invalid email or password. Please try again.";
            setError(errorMessage);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 min-h-screen">
                {/* Left Banner - Keep as is */}
                <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-primary/20 via-primary/10 to-background relative overflow-hidden">
                    {/* ... same banner content ... */}
                </div>

                {/* Right Form */}
                <div className="flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12">
                    <div className="w-full max-w-md">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="lg:hidden inline-flex items-center justify-center w-12 h-12 bg-primary/20 rounded-xl mb-4">
                                <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded"></div>
                            </div>
                            <h1 className="text-3xl font-bold text-brand mb-2">Sign In</h1>
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
                                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-11 bg-input border-border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Password input */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-sm font-medium text-foreground">
                                        Password
                                    </Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-11 bg-input border-border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Remember me & forgot password */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        checked={rememberMe}
                                        onCheckedChange={(checked) => setRememberMe(!!checked)}
                                        className="border-border"
                                        disabled={isLoading}
                                    />
                                    <Label
                                        htmlFor="remember"
                                        className="text-sm font-normal text-muted-foreground cursor-pointer"
                                    >
                                        Remember me
                                    </Label>
                                </div>
                                <Link 
                                    to="/forgot-password" 
                                    className="text-sm font-medium text-primary hover:text-primary/80 transition"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Sign in button */}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 bg-accent hover:bg-accent/80 text-primary-foreground font-semibold rounded-lg transition disabled:opacity-70 disabled:cursor-not-allowed"
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

                        {/* ... rest of your UI remains the same ... */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;