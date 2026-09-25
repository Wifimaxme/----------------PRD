  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(<App />);

  // Приложение стартовало: снимаем флаг аварийной перезагрузки, чтобы сторож
  // из public/boot-recovery.js сработал и в следующий раз. Флаг перезагрузки
  // из retryOnStaleChunk (app/routes.ts) снимается там же, после удачной
  // загрузки чанка: если снимать его здесь, при старте, то после перезагрузки
  // он пропадал раньше повторной попытки, и «один раз» превращалось в цикл.
  try {
    sessionStorage.removeItem("boot-recovery-attempted");
  } catch {
    // sessionStorage недоступен: ничего страшного, флагов там всё равно нет.
  }
