import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, EyeOff, Eye, CheckCircle2 } from "lucide-react";
import loginBg from "@/assets/login-bg.png";
import uniLogo from "@/assets/unilibre-logo.png";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const ok = login(email, password);
    if (ok) {
      navigate("/");
    } else {
      setError("Credenciales inválidas. Usa uno de los correos de demo.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left — Red branding panel */}
      <div className="relative hidden w-1/2 flex-col items-start justify-start overflow-hidden bg-primary lg:flex">
        <img
          src={loginBg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-transparent" />
        <div className="relative z-10 flex flex-col px-12 pt-10">
          <img
            src={uniLogo}
            alt="Universidad Libre"
            className="mb-6 h-40 w-40 rounded-full border-4 border-white/20 object-cover shadow-lg"
          />
          <h1 className="font-display text-4xl font-extrabold text-white leading-tight">
            Universidad Libre
          </h1>
          <p className="mt-2 text-lg font-medium text-white/90">
            Sistema de Programación Académica
          </p>
          <div className="my-4 h-px w-48 bg-white/30" />
          <p className="text-sm text-white/80">Facultad de Ingeniería</p>
        </div>
      </div>

      {/* Right — Login form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 lg:px-16">
        {/* Mobile logo */}
        <div className="mb-8 flex flex-col items-center lg:hidden">
          <img src={uniLogo} alt="Universidad Libre" className="mb-3 h-16 w-16 rounded-full object-cover" />
          <h2 className="font-display text-lg font-bold text-foreground">Universidad Libre</h2>
        </div>

        <div className="w-full max-w-md">
          <h2 className="font-display text-3xl font-bold text-foreground">Bienvenido</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Accede con tus credenciales institucionales.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Email */}
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                placeholder="correo@unilibre.edu.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-input bg-card py-3.5 pl-12 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
              {email.includes("@") && (
                <CheckCircle2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-success" />
              )}
            </div>

            <div className="h-px bg-border" />

            {/* Password */}
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-input bg-card py-3.5 pl-12 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>

            {/* Forgot password link */}
            <div className="text-right">
              <button type="button" className="text-xs font-semibold text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Remember */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-input accent-primary"
              />
              <label htmlFor="remember" className="text-xs text-muted-foreground">
                Recordar Sesión
              </label>
            </div>

            {error && (
              <p className="rounded-lg bg-destructive/10 px-4 py-2 text-xs font-medium text-destructive">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-2xl bg-primary py-4 text-base font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
            >
              Continuar
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 rounded-xl border border-border bg-muted/30 p-4">
            <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Credenciales de Demo
            </p>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <p><span className="font-medium text-foreground">Admin:</span> admin@unilibre.edu.co</p>
              <p><span className="font-medium text-foreground">Secretaría:</span> secretaria@unilibre.edu.co</p>
              <p><span className="font-medium text-foreground">Docente:</span> docente@unilibre.edu.co</p>
              <p className="mt-1 text-[10px] italic">Cualquier contraseña funciona</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
