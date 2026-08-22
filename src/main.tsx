  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(<App />);

  // Приложение стартовало — снимаем флаги аварийной перезагрузки, чтобы защита
  // от устаревшей сборки сработала и в следующий раз. См. сторож в index.html
  // и retryOnStaleChunk в app/routes.ts.
  try {
    sessionStorage.removeItem("boot-recovery-attempted");
    sessionStorage.removeItem("chunk-recovery-attempted");
  } catch {
    // sessionStorage недоступен — ничего страшного, флагов там всё равно нет.
  }
