import { useQuasar } from "quasar";

export const useNotify = () => {
  const $q = useQuasar();

  const errorNotify = (message) => {
    $q.notify({
      message: message || "Algo ocurrió",
      caption: "Error",
      color: "negative",
      position: "top",
      progress: true,
      icon: "report_problem",
    });
  };

  const successNotify = (message) => {
    $q.notify({
      message: message || "Exito",
      color: "positive",
      position: "top",
      progress: true,
      icon: "mdi-check-circle",
    });
  };

  const showNotify = (caption, message, color = "negative") => {
    $q.notify({
      message: message || "Algo ocurrió",
      caption: caption || "Error",
      color: color,
      position: "top",
      progress: true,
    });
  };

  return { showNotify, errorNotify, successNotify };
};
