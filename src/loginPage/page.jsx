import { User, Lock } from "lucide-react";
import { useState } from "react";
import useAuthStore from "../stores/authStore";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    const success = await login(data);

    if (success) {
      navigate('/'); 
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 transition-colors dark:bg-slate-950">
      
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-y-1 p-6">
            <h1 className="text-center text-2xl font-bold text-slate-900 dark:text-slate-50">
              Welcome Back
            </h1>
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              Sign in to continue to your dashboard
            </p>
          </div>

          <div className="p-6 pt-0">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Username Input */}
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-slate-800 dark:text-slate-200"
                >
                  Username
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-3 size-5 text-slate-400" />
                  <input
                    name="username"
                    onChange={handleChange}
                    value={data.username}
                    type="text"
                    id="username"
                    placeholder="e.g., john.doe"
                    className="w-full rounded-lg border border-slate-300 bg-transparent py-2 pl-10 pr-3 text-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/80 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus-visible:ring-blue-600"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-800 dark:text-slate-200"
                >
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 size-5 text-slate-400" />
                  <input
                    name="password"
                    onChange={handleChange}
                    value={data.password}
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-300 bg-transparent py-2 pl-10 pr-3 text-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/80 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus-visible:ring-blue-600"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-slate-50 transition-colors hover:bg-blue-600/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-500 dark:text-slate-50 dark:hover:bg-blue-500/90 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
