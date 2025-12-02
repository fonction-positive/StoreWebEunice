import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import api from "@/lib/api";

const VerifyEmail = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email") || "";

    const [codeDigits, setCodeDigits] = useState<string[]>(["", "", "", "", "", ""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [countdown, setCountdown] = useState(60);
    const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Start countdown timer
    const startCountdown = () => {
        setCountdown(60);
        if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current);
        }
        countdownTimerRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    if (countdownTimerRef.current) {
                        clearInterval(countdownTimerRef.current);
                        countdownTimerRef.current = null;
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Handle input change
    const handleInput = (index: number, value: string) => {
        // Only allow digits
        if (value && !/^\d$/.test(value)) {
            return;
        }

        const newDigits = [...codeDigits];
        newDigits[index] = value;
        setCodeDigits(newDigits);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Clear error message
        setErrorMessage("");
    };

    // Handle keydown
    const handleKeydown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !codeDigits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Handle paste
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").trim();

        if (/^\d{6}$/.test(pastedData)) {
            setCodeDigits(pastedData.split(""));
            inputRefs.current[5]?.focus();
        }
    };

    // Verify code
    const handleVerify = async () => {
        const code = codeDigits.join("");

        if (code.length !== 6) {
            setErrorMessage("验证码应为6位");
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            const response = await api.post("auth/verify_register/", {
                email,
                code,
            });

            // Save tokens
            localStorage.setItem("access_token", response.data.access);
            localStorage.setItem("refresh_token", response.data.refresh);

            // Clear registration data
            localStorage.removeItem("registerData");

            // Redirect to home with full page reload
            window.location.href = "/mobile/";
        } catch (err: any) {
            let errorMsg = "验证失败";
            if (err.response?.data?.detail) {
                errorMsg = err.response.data.detail;
            }

            setErrorMessage(errorMsg);
            // Clear code
            setCodeDigits(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    // Resend code
    const resendCode = async () => {
        try {
            // Get registration data from localStorage
            const registerDataStr = localStorage.getItem("registerData");
            if (!registerDataStr) {
                setErrorMessage("注册信息已过期，请重新注册");
                setTimeout(() => navigate("/register"), 2000);
                return;
            }

            const registerData = JSON.parse(registerDataStr);

            if (!registerData.username || !registerData.email || !registerData.password) {
                setErrorMessage("注册信息不完整，请重新注册");
                setTimeout(() => navigate("/register"), 2000);
                return;
            }

            await api.post("auth/register/", registerData);
            setErrorMessage("");
            startCountdown();
        } catch (err: any) {
            let errorMsg = "发送失败";
            if (err.response?.data?.detail) {
                errorMsg = err.response.data.detail;
            }
            setErrorMessage(errorMsg);
        }
    };

    useEffect(() => {
        if (!email) {
            setErrorMessage("邮箱地址缺失");
            setTimeout(() => navigate("/register"), 2000);
            return;
        }

        // Auto-focus first input
        inputRefs.current[0]?.focus();

        // Start countdown
        startCountdown();

        // Cleanup
        return () => {
            if (countdownTimerRef.current) {
                clearInterval(countdownTimerRef.current);
            }
        };
    }, [email, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] px-4 py-6">
            <Card className="w-full max-w-[440px] p-12 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] bg-white border-0">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className="w-[72px] h-[72px] bg-[#1d1d1f] rounded-[18px] flex items-center justify-center">
                        <span className="text-white text-[32px] font-bold tracking-tight">F</span>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-[28px] font-bold text-center text-[#1d1d1f] mb-2 tracking-tight">
                    验证邮箱
                </h1>
                <p className="text-[15px] text-center text-[#86868b] mb-10">
                    我们已向 <strong className="text-[#1d1d1f] font-semibold">{email}</strong> 发送验证码
                </p>

                {/* Code Input */}
                <div className="flex gap-3 justify-center mb-6">
                    {codeDigits.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleInput(index, e.target.value)}
                            onKeyDown={(e) => handleKeydown(index, e)}
                            onPaste={handlePaste}
                            className="w-[52px] h-[64px] text-center text-[28px] font-semibold border-2 border-[#d2d2d7] rounded-xl bg-[#f5f5f7] text-[#1d1d1f] transition-all outline-none focus:border-[#1d1d1f] focus:bg-white focus:ring-[3px] focus:ring-[rgba(29,29,31,0.1)] [&:not(:placeholder-shown)]:bg-white [&:not(:placeholder-shown)]:border-[#1d1d1f]"
                        />
                    ))}
                </div>

                {/* Error Message */}
                {errorMessage && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}

                {/* Verify Button */}
                <Button
                    onClick={handleVerify}
                    disabled={loading || codeDigits.join("").length !== 6}
                    className="w-full h-[52px] bg-[#1d1d1f] hover:bg-[#1d1d1f] text-white rounded-xl text-base font-semibold shadow-[0_4px_16px_rgba(29,29,31,0.3)] hover:shadow-[0_8px_24px_rgba(29,29,31,0.4)] hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100 mb-5"
                >
                    {loading ? "验证中..." : "验证"}
                </Button>

                {/* Resend */}
                <div className="text-center">
                    {countdown > 0 ? (
                        <span className="text-[14px] text-[#86868b]">
                            {countdown}秒后可重新发送
                        </span>
                    ) : (
                        <button
                            onClick={resendCode}
                            className="text-[14px] text-[#1d1d1f] font-medium hover:scale-105 transition-transform hover:underline"
                        >
                            重新发送验证码
                        </button>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default VerifyEmail;
