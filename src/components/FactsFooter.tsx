import { useMemo } from 'react';
import { AppConstants } from '../config/appConstants';

export function FactsFooter() {
  const fact = useMemo(
    () =>
      AppConstants.RANDOM_FACTS[
        Math.floor(Math.random() * AppConstants.RANDOM_FACTS.length)
      ],
    [],
  );

  return (
    <footer className="facts-footer" role="contentinfo" aria-live="polite">
      <p><em>{fact}</em></p>
    </footer>
  );
}
