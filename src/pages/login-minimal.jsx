import React from "react";
import axios from "axios";  
import LoginForm from '@/components/authentication/LoginForm'
const isBrowser = typeof window !== "undefined";
const protocol = isBrowser && window.location.protocol === "https:" ? "https" : "http";
const API_BASE = protocol === "https"  ?  'https://waveledserver.vercel.app' : "http://localhost:4000";

const LoginMinimal = () => {

    const handleLoggedIn = async (partialUser) => {
    try {
      // Tenta obter mais dados do user (ex.: companySlug) após login
      const { data } = await axios.get(
        `${API_BASE}/api/me`,
        { withCredentials: true }
      );

      const user = data?.user || partialUser || {}; 

      // Caso não uses subdomínios, só navega para um dashboard simples
      // (se tiveres react-router, podes usar navigate('/dashboard'))
      window.location.assign("/");
    } catch (e) {
      console.error("onLoggedIn error:", e);
      // Fallback: vai para o domínio base
     //  window.location.assign(getBaseUrl());
    }
  };

    return (
      <section className="login-auth">
        <video loop autoPlay muted  src="https://video-previews.elements.envatousercontent.com/h264-video-previews/5e9f529a-11cc-4efc-926e-010896f35ec0/57339165.mp4"></video> 
        <main className="auth-minimal-wrapper over-wrapper">
            <div className="auth-minimal-inner">
                <div className="minimal-card-wrapper">
                    <div className="card mb-4 mt-5 mx-4 mx-sm-0 position-relative"> 
                        <div className="card-body p-sm-5">
                           <LoginForm onLoggedIn={handleLoggedIn} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
      </section> 

    )
}

export default LoginMinimal


 


 

