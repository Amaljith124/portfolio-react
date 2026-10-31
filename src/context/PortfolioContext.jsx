import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getPortfolio, getPortfolioByToken } from '../webservices/webservices';
import { defaultPortfolio, DEFAULT_PORTFOLIO_SLUG } from '../data/defaultPortfolio';
import { applyCssVars, clearCssVars, themeToCssVars } from '../utils/theme';
import { useTheme } from './ThemeContext';

const PortfolioContext = createContext(null);

// Provides the portfolio to the sections of the page. Three ways in:
//   slug = the default portfolio ("/")      starts from the bundled copy of the seed (paints at once, identically) and is replaced by the API
//   slug = any other                         ("/p/<slug>") shows a loading placeholder until the API answers
//   token                                    ("/portfolio/<token>", the magic link) the token is sent to the API, which returns the JSON
// basePath is '' for the default site, '/p/<slug>' or '/portfolio/<token>' for the others (used by every internal link).
// status: loading | ready | notfound | error. retry() asks the API again.
export function PortfolioProvider({ slug, token, basePath, children }) {
  const { theme: mode } = useTheme();
  const isDefault = !token && slug === DEFAULT_PORTFOLIO_SLUG;
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState(function () {
    return isDefault ? { status: 'ready', data: defaultPortfolio } : { status: 'loading', data: null };
  });
  const appliedNames = useRef([]);

  useEffect(function () {
    let cancelled = false;
    setState(current => (isDefault ? current : { status: 'loading', data: null }));
    (token ? getPortfolioByToken(token) : getPortfolio(slug))
      .then(function (data) {
        if (!cancelled) {
          setState({ status: 'ready', data: data });
        } else {
          // the address changed while loading
        }
      })
      .catch(function (error) {
        if (!cancelled) {
          // the default site keeps showing its bundled copy when the API is unreachable
          setState(current => (isDefault && current.data ? current : { status: error.message === 'No such portfolio' ? 'notfound' : 'error', data: null }));
        } else {
          // the address changed while loading
        }
      });
    return function () {
      cancelled = true;
    };
  }, [slug, token, isDefault, attempt]);

  // the resolved theme of the current colour mode becomes CSS custom properties on <html>
  useEffect(function () {
    if (state.data) {
      appliedNames.current = applyCssVars(themeToCssVars(state.data.theme, mode), appliedNames.current);
    } else {
      // nothing to apply yet
    }
  }, [state.data, mode]);

  useEffect(function () {
    return function () {
      clearCssVars(appliedNames.current);
      appliedNames.current = [];
    };
  }, []);

  useEffect(function () {
    if (!isDefault && state.data) {
      const previous = document.title;
      document.title = `${state.data.name} | Portfolio`;
      return function () {
        document.title = previous;
      };
    } else {
      return undefined;
    }
  }, [isDefault, state.data]);

  // a magic link page is private by address: no indexing, and no referrer, so the token does not leak through outbound links
  useEffect(function () {
    if (token) {
      const tags = [['robots', 'noindex, nofollow'], ['referrer', 'no-referrer']].map(function ([name, content]) {
        const tag = document.createElement('meta');
        tag.name = name;
        tag.content = content;
        document.head.appendChild(tag);
        return tag;
      });
      return function () {
        tags.forEach(tag => tag.remove());
      };
    } else {
      return undefined;
    }
  }, [token]);

  const retry = useCallback(function () {
    setAttempt(current => current + 1);
  }, []);

  const value = useMemo(function () {
    return {
      slug: state.data ? state.data.slug : slug,
      basePath: basePath,
      status: state.status,
      retry: retry,
      portfolio: state.data ? state.data.portfolio : null,
      features: state.data ? state.data.features : { isAssistantEnabled: false }
    };
  }, [slug, basePath, state, retry]);

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context) {
    return context;
  } else {
    throw new Error('usePortfolio must be used inside PortfolioProvider');
  }
}
