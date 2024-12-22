"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';
import Dashboard from "../page";

const Login = () => {
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setMessage(null);

        const email = event.target.email.value;
        const password = event.target.password.value;

        if (!email || !password) {
            setError("Email và mật khẩu không được để trống.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post("http://localhost:8000/api/v1/login", {
                email: email,
                password: password,
            });

            if (response.data) {
                setMessage("Đăng nhập thành công!");
                localStorage.setItem("user", JSON.stringify(response.data));

                router.push(`/?path=DASHBOARD`);
            }
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || "Đăng nhập thất bại. Vui lòng thử lại.");
            } else {
                setError("Có lỗi xảy ra. Vui lòng kiểm tra kết nối mạng.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-primary">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-primary text-center mb-6">Login</h2>
                <form onSubmit={handleSubmit}>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    {message && <p className="text-green-500 text-sm text-center">{message}</p>}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <p className="text-gray-600 text-sm text-center mt-4">
                    Don't have an account?{" "}
                    <a href="#" className="text-primary font-bold hover:underline">
                        Sign up now
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
