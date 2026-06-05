import { Header } from "../../components/Header";
import "./HistoryPage.css"; // Se quiser adicionar estilos exclusivos para essa página depois

interface HistoryPageProps {
  onGoToHome: () => void;
  onGoToPlaylists: () => void;
  onGoToHistory: () => void;
}

export function HistoryPage({ onGoToHome, onGoToPlaylists , onGoToHistory}: HistoryPageProps) {
  return (
    <div className="home-page">
      {/* Reutilizando o mesmo Header e indicando que a página atual é 'history' */}
      <Header 
        activePage="history" 
        onGoToHome={onGoToHome}
        onGoToPlaylists={onGoToPlaylists}
        onLogout={() => {
          console.log("Usuário deslogado do histórico");
        }}
        onGoToHistory={onGoToHistory}
      />

      <main className="home-content">
        <section className="home-hero">
          <p className="home-eyebrow">Usuário</p>
          <h1>Histórico de Filmes</h1>
          <p>
            Aqui você poderá visualizar todos os filmes que já assistiu.
          </p>
        </section>

        {/* O conteúdo do histórico vai entrar aqui futuramente */}
        <div style={{ 
          border: "1px dashed var(--home-border)", 
          borderRadius: "8px", 
          padding: "40px", 
          textAlign: "center",
          color: "var(--home-muted)",
          marginTop: "24px"
        }}>
          Nenhum filme assistido recentemente.
        </div>
      </main>
    </div>
  );
}