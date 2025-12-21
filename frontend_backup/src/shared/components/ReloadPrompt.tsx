/**
 * ReloadPrompt - Notification de mise à jour PWA
 */

import { useState, useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export function ReloadPrompt() {
  const [show, setShow] = useState(false);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration) {
      console.log('✅ Service Worker registered:', registration);
    },
    onRegisterError(error) {
      console.error('❌ Service Worker registration error:', error);
    },
    onNeedRefresh() {
      console.log('🔄 New version available');
      setShow(true);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      setShow(true);
    }
  }, [needRefresh]);

  const handleUpdate = async () => {
    await updateServiceWorker(true);
    setShow(false);
  };

  const handleDismiss = () => {
    setShow(false);
    setNeedRefresh(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-4 right-4 z-50 max-w-sm"
        >
          <div className="bg-card border border-border rounded-lg shadow-lg p-4">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0 bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full">
                <RefreshCw className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Mise à jour disponible
                </h3>
                <p className="text-sm text-muted mb-3">
                  Une nouvelle version de l'application est disponible. Rechargez pour profiter des dernières améliorations.
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleUpdate}
                    size="sm"
                    className="flex-1"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Mettre à jour
                  </Button>
                  <Button
                    onClick={handleDismiss}
                    variant="outline"
                    size="sm"
                  >
                    Plus tard
                  </Button>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 text-muted hover:text-foreground transition-colors p-1"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
