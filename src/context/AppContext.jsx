import { createContext, useState, useCallback, useRef } from "react";
import axios from "axios";
import { envConfig } from "@/config/enf_config";

export const AppContext = createContext(undefined);
const previewCache = new Map();

export function AppProvider({ children }) {
  const [lookerInstanceUrl, setLookerInstanceUrl] = useState("");
  const [lookerClientId, setLookerClientId]       = useState("");
  const [lookerClientSecret, setLookerClientSecret] = useState("");
  const [selectedDash, setSelectedDash]           = useState(null);

  const [previewData, setPreviewData]     = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError]   = useState(null);
  const cachedDashIdRef = useRef(null);

  const API_BASE = envConfig.baseUrl;

  const fetchDashboards = async (controller) => {
    try {
      const resp = await axios.post(
        `${API_BASE}/looker/dashboards`,
        {
          looker_url:           lookerInstanceUrl,
          looker_client_id:     lookerClientId,
          looker_client_secret: lookerClientSecret,
        },
        {
          signal:  controller?.signal,
          headers: { "Content-Type": "application/json" },
        }
      );
      return resp.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Dashboards request cancelled");
      } else {
        console.error("Dashboard fetch failed:", error);
      }
      throw error;
    }
  };

  const fetchPreview = useCallback(
    async (controller) => {
      if (!selectedDash || !lookerInstanceUrl) return;

      const cacheKey = `${lookerInstanceUrl}__${selectedDash.id}`;

      if (previewCache.has(cacheKey)) {
        const cached = previewCache.get(cacheKey);
        setPreviewData(cached);
        setPreviewError(null);
        cachedDashIdRef.current = selectedDash.id;
        return cached;
      }

      if (cachedDashIdRef.current === selectedDash.id && previewData) {
        return previewData;
      }

      setPreviewLoading(true);
      setPreviewError(null);
      setPreviewData(null);

      try {
        const resp = await axios.post(
          `${API_BASE}/looker/preview`,
          {
            looker_url:           lookerInstanceUrl,
            looker_id:            selectedDash.id,
            looker_client_id:     lookerClientId,
            looker_client_secret: lookerClientSecret,
          },
          {
            signal:  controller?.signal,
            headers: { "Content-Type": "application/json" },
          }
        );

        if (controller?.signal?.aborted) return;

        previewCache.set(cacheKey, resp.data);
        cachedDashIdRef.current = selectedDash.id;
        setPreviewData(resp.data);
        return resp.data;
      } catch (error) {
        if (axios.isCancel(error) || controller?.signal?.aborted) return;
        console.error("Preview fetch failed:", error);
        setPreviewError(error);
        throw error;
      } finally {
        if (!controller?.signal?.aborted) setPreviewLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lookerInstanceUrl, lookerClientId, lookerClientSecret, selectedDash?.id]
  );

  const selectDash = useCallback((dash) => {
    if (dash?.id !== cachedDashIdRef.current) {
      setPreviewData(null);
      setPreviewError(null);
      setPreviewLoading(false);
    }
    setSelectedDash(dash);
  }, []);

  const value = {
    lookerInstanceUrl,
    lookerClientId,
    lookerClientSecret,
    setLookerInstanceUrl,
    setLookerClientId,
    setLookerClientSecret,

    selectedDash,
    setSelectedDash: selectDash,   

    fetchDashboards,
    fetchPreview,

    previewData,
    previewLoading,
    previewError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}