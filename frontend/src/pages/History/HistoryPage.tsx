import { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { getHistoryByUserId } from "../../services/historyApi";
import "./HistoryPage.css";

interface HistoryPageProps {
  userId: string;
  onGoToHome: () => void;
  onGoToPlaylists: () => void;
  onGoToHistory: () => void;
}

interface HistoryItem {
  id: string;
  date: string;
  title: string;
}

export function HistoryPage({ userId, onGoToHome, onGoToPlaylists, onGoToHistory }: HistoryPageProps) {
  const [historyList, setHistoryList] = useState<HistoryItem[]>([
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadHistory() {
      setIsLoading(true);

      try {
        const items = await getHistoryByUserId(userId);

        if (!isMounted) {
          return;
        }

        setHistoryList(
          items.map((item) => {
            const rawDate = item.watched_at ?? item.watchedAt ?? "";
            const watchedDate = rawDate
              ? new Date(rawDate).toLocaleDateString("pt-BR")
              : "";

            return {
              id: item.id,
              date: watchedDate,
              title: item.title ?? "Filme sem título",
            };
          }),
        );
      } catch (error) {
        console.warn("Erro ao carregar histórico", error);

        if (isMounted) {
          setHistoryList([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  function handleHideItem(id: string) {
    setHistoryList(prev => prev.filter(item => item.id !== id));
  }

  function handleHideAll() {
    setHistoryList([]);
  }

  return (
    <div className="home-page">
      <Header 
        activePage="history" 
        onGoToHome={onGoToHome}
        onGoToPlaylists={onGoToPlaylists}
        onLogout={() => console.log("Usuário deslogado do histórico")}
        onGoToHistory={onGoToHistory}
      />

      <main className="home-content">
        <section className="home-hero-history">
          <div className="home-hero-text">
            <p className="home-eyebrow">Usuário</p>
            <h1>Histórico de Filmes</h1>
            <p>Aqui você poderá visualizar todos os filmes que já assistiu.</p>
          </div>
          
          {historyList.length > 0 && (
            <button 
              type="button" 
              className="btn-hide-all-dark"
              onClick={handleHideAll}
            >
              Ocultar tudo
            </button>
          )}
        </section>

        {isLoading ? (
          <div className="history-empty-box">Carregando histórico...</div>
        ) : historyList.length > 0 ? (
          /* Lista com scroll caso fique muito grande */
          <div className="history-scroll-container">
            <div className="history-list-dark">
              {historyList.map((item) => (
                <div key={item.id} className="history-item-row">
                  <span className="history-date">{item.date}</span>
                  <span className="history-title">{item.title}</span>
                  <button 
                    type="button" 
                    className="btn-hide-item-dark"
                    title="Esconder do histórico"
                    onClick={() => handleHideItem(item.id)}
                  >
                    {/* Ícone de Proibido/Ocultar */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Caixa pontilhada original mantendo o seu estilo */
          <div className="history-empty-box">
            Nenhum filme assistido recentemente.
          </div>
        )}
      </main>
    </div>
  );
}