import { useState } from "react";
import "./App.css";
import { HomePage } from "./pages/Home/HomePage";
import { MinhasPlaylistsPage } from "./pages/MinhasPlaylists/MinhasPlaylistsPage";
import { HistoryPage } from "./pages/History/HistoryPage"; 

// 2. ADICIONADO "history" NAS OPÇÕES DE TELA
type CurrentPage = "home" | "playlists" | "history";

function App() {
  const [currentPage, setCurrentPage] = useState<CurrentPage>("home");

  const currentUser = {
    id: "Victoria",
    name: "Victoria",
  };

  if (currentPage === "playlists") {
    return (
      <MinhasPlaylistsPage
        userId={currentUser.id}
        onGoToHome={() => setCurrentPage("home")}
      />
    );
  }

  if (currentPage === "history") {
    return (
      <HistoryPage
        onGoToHome={() => setCurrentPage("home")}
        onGoToPlaylists={() => setCurrentPage("playlists")}
        onGoToHistory={() => setCurrentPage("history")}
      />
    );
  }

  return (
    <HomePage
      userId={currentUser.id}
      onGoToPlaylists={() => setCurrentPage("playlists")}
      onGoToHome={() => setCurrentPage("home")}
      onGoToHistory={() => setCurrentPage("history")}
    />
  );
}

export default App;