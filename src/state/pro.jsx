import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { toast } from '../lib/toast';
import ProUpgradeSheet from '../components/ProUpgradeSheet';
import { FREE_USES, PRO_FEATURES } from '../lib/pro';

const STORAGE_KEY = 'aygo.pro.v1';

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved === 'object') return { isPro: Boolean(saved.isPro), used: saved.used || {} };
  } catch {
    // storage unavailable: start fresh
  }
  return { isPro: false, used: {} };
}

function save(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable: keep in memory only
  }
}

const ProContext = createContext(null);

export function ProProvider({ children }) {
  const [state, setState] = useState(load);
  const [paywallFeature, setPaywallFeature] = useState(undefined); // undefined = closed, null = opened without a feature

  const update = useCallback((next) => {
    setState((prev) => {
      const value = typeof next === 'function' ? next(prev) : next;
      save(value);
      return value;
    });
  }, []);

  const remaining = useCallback(
    (feature) => (state.isPro ? Infinity : Math.max(0, FREE_USES - (state.used[feature] || 0))),
    [state]
  );

  /** Runs fn if the user is Pro or still has free uses of the feature; otherwise opens the paywall */
  const gate = useCallback(
    (feature, fn) => {
      if (state.isPro) return fn?.();
      const used = state.used[feature] || 0;
      if (used >= FREE_USES) {
        setPaywallFeature(feature);
        return undefined;
      }
      update((prev) => ({ ...prev, used: { ...prev.used, [feature]: used + 1 } }));
      const left = FREE_USES - used - 1;
      const info = PRO_FEATURES[feature];
      if (info) {
        toast(left > 0
          ? `${info.label}: ${left} free ${left === 1 ? 'use' : 'uses'} left`
          : `That was your last free use of ${info.label}. Go Pro to keep using it.`);
      }
      return fn?.();
    },
    [state, update]
  );

  const value = useMemo(
    () => ({
      isPro: state.isPro,
      remaining,
      gate,
      openPaywall: (feature = null) => setPaywallFeature(feature),
      upgrade: () => {
        update((prev) => ({ ...prev, isPro: true }));
        setPaywallFeature(undefined);
        toast('Welcome to Aygo Pro. Every tool is now unlimited.');
      },
      downgrade: () => {
        update({ isPro: false, used: {} });
        setPaywallFeature(undefined);
        toast('Back on the Free plan (demo reset)');
      },
    }),
    [state.isPro, remaining, gate, update]
  );

  return (
    <ProContext.Provider value={value}>
      {children}
      {paywallFeature !== undefined && (
        <ProUpgradeSheet
          feature={paywallFeature}
          isPro={state.isPro}
          onClose={() => setPaywallFeature(undefined)}
          onUpgrade={value.upgrade}
          onDowngrade={value.downgrade}
        />
      )}
    </ProContext.Provider>
  );
}

export function usePro() {
  const ctx = useContext(ProContext);
  if (!ctx) throw new Error('usePro must be used inside <ProProvider>');
  return ctx;
}
