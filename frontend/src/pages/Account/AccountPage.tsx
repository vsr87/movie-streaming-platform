import React, { useEffect, useState, useRef } from "react";
import { getProfile, updateProfile, updatePhoto } from "../../services/accountService";
import "./AccountPage.css";

interface AccountPageProps {
  userId: string;
  onGoToHome: () => void;
  onGoToPlaylists: () => void;
  onGoToHistory: () => void;
  onLogout?: () => void;
}

export function AccountPage({
  userId,
  onGoToHome,
  onGoToPlaylists,
  onGoToHistory,
  onLogout,
}: AccountPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // Original values to check if there are changes
  const [originalName, setOriginalName] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const profile = await getProfile(userId);
      setName(profile.name);
      setEmail(profile.email);
      setPhotoUrl(profile.photo);
      setOriginalName(profile.name);
      setOriginalEmail(profile.email);
    } catch (err: any) {
      setErrorMessage(err.message || "Erro ao carregar dados do perfil.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const handleCancel = () => {
    setName(originalName);
    setEmail(originalEmail);
    setPassword("");
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const payload: any = {};
    let hasChanges = false;

    if (name !== originalName) {
      payload.name = name;
      hasChanges = true;
    }
    if (email !== originalEmail) {
      payload.email = email;
      hasChanges = true;
    }
    if (password) {
      payload.password = password;
      hasChanges = true;
    }

    if (!hasChanges) {
      setErrorMessage("Nenhuma alteração foi realizada");
      setIsSaving(false);
      return;
    }

    try {
      const res = await updateProfile(userId, payload);
      setSuccessMessage(res.message || "Alterações salvas com sucesso");
      setPassword("");
      
      // Update original values
      if (payload.name) setOriginalName(payload.name);
      if (payload.email) setOriginalEmail(payload.email);
    } catch (err: any) {
      setErrorMessage(err.message || "Erro ao salvar alterações.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const sizeMB = file.size / (1024 * 1024);
      const res = await updatePhoto(userId, file.name, sizeMB);
      setSuccessMessage(res.message || "Foto atualizada com sucesso");
      // Update photo local state
      setPhotoUrl(file.name);
    } catch (err: any) {
      setErrorMessage(err.message || "Erro ao atualizar foto.");
    } finally {
      setIsSaving(false);
      // Reset input value to allow selecting same file again
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Helper avatar fallback
  const avatarSource = photoUrl 
    ? (photoUrl.startsWith("http") ? photoUrl : `https://lh3.googleusercontent.com/aida-public/${photoUrl}`) 
    : "https://lh3.googleusercontent.com/aida-public/AB6AXuADUdUiXftpvF9uuBSbsyTJ89zqe7LR_EXkoqJ9m37bXkr7qGsbImgOAgqLnnpGvwSHnUJAYlPtWGJ-2bItZbs_Ilzt0UWcV-rwS2AYCzlxHIMmtDdKxnyfQH5Jbxzg8CKjxJs3iCYIxtgjhcZJkYYKX3cavVWWcxGfMGGDmOju8BvZ0o41MZWCaWnku0hktfyZFbl9xEVGEBdlNSGWNZmgvXq_fV1T8LWHDnuAP3QW1goj_RZ4c69oLWw-cVf_zYtDyhJ8uDycomSv";

  return (
    <div className="font-sans antialiased min-h-screen flex bg-black text-white w-full">
      {/* Hidden File Input for photo upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoChange}
        className="hidden"
        accept=".jpg,.jpeg,.png"
      />

      {/* BEGIN: MainSidebar */}
      <aside
        className="w-72 bg-[#121414] flex flex-col h-screen fixed left-0 top-0 border-r border-[#FFC107]/20 p-8"
        data-purpose="main-navigation"
      >
        <div className="mb-12">
          <h1 className="text-[#FFC107] text-2xl font-extrabold tracking-tight">Cinema</h1>
        </div>

        {/* User Mini Profile */}
        <div className="flex items-center gap-3 mb-10 p-2" data-purpose="user-sidebar-profile">
          <img
            alt={name || "User"}
            className="w-10 h-10 rounded-full border border-[#FFC107]/50 object-cover"
            src={avatarSource}
          />
          <div>
            <p className="text-sm font-bold text-white leading-tight">{name || "Carregando..."}</p>
            <p className="text-[10px] text-[#FFC107]/70 uppercase tracking-widest">Premium Member</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2">
          <button
            onClick={onGoToHome}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-[#FFC107] transition-colors duration-200 text-left"
            type="button"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
            </svg>
            <span className="text-sm font-medium">Dashboard</span>
          </button>

          <button
            onClick={onGoToPlaylists}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-[#FFC107] transition-colors duration-200 text-left"
            type="button"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
            </svg>
            <span className="text-sm font-medium">Minhas Playlists</span>
          </button>

          <button
            onClick={onGoToHistory}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-[#FFC107] transition-colors duration-200 text-left"
            type="button"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
            </svg>
            <span className="text-sm font-medium">Histórico</span>
          </button>

          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl active-nav-item text-[#FFC107] text-left"
            type="button"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
            </svg>
            <span className="text-sm font-bold">Account Settings</span>
          </button>
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto pt-6 border-t border-[#FFC107]/10 space-y-2">
          <a
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors duration-200"
            href="#"
          >
            <svg
              className="w-5 h-5 text-[#FFC107]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
            </svg>
            <span className="text-sm">Help Center</span>
          </a>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 transition-colors duration-200 text-left"
            type="button"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
            </svg>
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </aside>
      {/* END: MainSidebar */}

      {/* BEGIN: MainContent */}
      <main className="flex-1 ml-72 p-12 bg-black min-h-screen" data-purpose="account-settings-content">
        {/* Page Header */}
        <header className="mb-12">
          <h2 className="text-4xl font-extrabold text-[#FFC107] mb-2">Configurações da Conta</h2>
          <p className="text-gray-400 text-lg">Gerencie suas informações pessoais e preferências de visualização.</p>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFC107]"></div>
            <p className="text-gray-400 mt-4 font-semibold">Carregando dados da conta...</p>
          </div>
        ) : (
          <div
            className="bg-[#1A1C1C]/50 border border-[#FFC107]/10 rounded-3xl p-10 max-w-5xl mx-auto"
            data-purpose="settings-form-container"
          >
            {/* Feedback Alerts */}
            {successMessage && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm font-semibold flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-semibold flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Profile Header Info */}
            <div className="flex items-center gap-8 mb-12">
              <div className="relative">
                <img
                  alt={name || "User"}
                  className="w-32 h-32 rounded-full border-4 border-[#FFC107]/20 object-cover shadow-2xl"
                  src={avatarSource}
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{name}</h3>
                <p className="text-gray-400 text-sm mb-4">Membro desde Outubro 2023</p>
                <button
                  type="button"
                  onClick={handlePhotoUploadClick}
                  disabled={isSaving}
                  className="bg-[#FFC107] text-[#121414] px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Uploading..." : "Upload New Photo"}
                </button>
              </div>
            </div>

            {/* Settings Form */}
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username Field */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                    Nome de Usuário
                  </label>
                  <div className="relative">
                    <input
                      className="w-full bg-black/40 border border-[#FFC107]/30 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#FFC107] transition-all input-glow"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#FFC107]">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                    E-mail
                  </label>
                  <div className="relative">
                    <input
                      className="w-full bg-black/40 border border-[#FFC107]/30 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#FFC107] transition-all input-glow"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#FFC107]">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                  Nova Senha
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-black/40 border border-[#FFC107]/30 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#FFC107] transition-all input-glow"
                    type="password"
                    placeholder="Mantenha em branco para não alterar"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#FFC107]/50">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path
                        clipRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        fillRule="evenodd"
                      ></path>
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"></path>
                    </svg>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-gray-500">
                  A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos.
                </p>
              </div>

              {/* Language and Quality Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  className="w-full bg-[#FFC107] flex items-center justify-between px-6 py-4 rounded-xl text-[#121414] font-bold text-sm"
                  type="button"
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      ></path>
                    </svg>
                    <span>Idioma: Português</span>
                  </div>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </button>
                <button
                  className="w-full bg-[#FFC107] flex items-center justify-between px-6 py-4 rounded-xl text-[#121414] font-bold text-sm"
                  type="button"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-[#121414] text-[#FFC107] text-[10px] px-1.5 py-0.5 rounded font-black">HD</span>
                    <span>Qualidade: 4K Ultra HD</span>
                  </div>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </button>
              </div>

              <hr className="border-[#FFC107]/10 my-8" />

              {/* Form Actions */}
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleCancel}
                  className="px-8 py-3 border border-[#FFC107] rounded-xl text-[#FFC107] font-bold text-sm hover:bg-[#FFC107]/5 transition-colors"
                  type="button"
                >
                  Cancelar
                </button>
                <button
                  className="px-8 py-3 bg-[#FFC107] border border-[#FFC107] rounded-xl text-[#121414] font-bold text-sm hover:bg-yellow-500 transition-colors shadow-lg shadow-[#FFC107]/20 disabled:opacity-50"
                  type="submit"
                  disabled={isSaving}
                >
                  {isSaving ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Info Cards Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-5xl mx-auto" data-purpose="status-cards">
          {/* Security Card */}
          <div className="bg-[#FFC107] p-6 rounded-[24px] flex items-center gap-5">
            <div className="bg-black p-3 rounded-xl">
              <svg
                className="h-6 w-6 text-[#FFC107]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                ></path>
              </svg>
            </div>
            <div>
              <h4 className="text-[#121414] font-extrabold text-lg leading-tight">Segurança da Conta</h4>
              <p className="text-[#121414]/70 text-sm font-medium">A autenticação de dois fatores está ativa para sua proteção.</p>
            </div>
          </div>

          {/* Recent Access Card */}
          <div className="bg-[#FFC107] p-6 rounded-[24px] flex items-center gap-5">
            <div className="bg-black p-3 rounded-xl">
              <svg
                className="h-6 w-6 text-[#FFC107]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                ></path>
              </svg>
            </div>
            <div>
              <h4 className="text-[#121414] font-extrabold text-lg leading-tight">Acessos Recentes</h4>
              <p className="text-[#121414]/70 text-sm font-medium">Você tem 3 dispositivos conectados à sua conta no momento.</p>
            </div>
          </div>
        </div>
      </main>
      {/* END: MainContent */}
    </div>
  );
}
