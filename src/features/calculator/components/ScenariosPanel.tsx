import React, { useReducer, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Layers, Upload, Trash2, Lightbulb, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { PlainTaxResult } from '../../../domain/tax/models';
import type { SavedScenario } from '../../../lib/storage';
import { loadScenarios, addScenario, removeScenario } from '../../../lib/storage';
import { formatLeiRounded, formatPercent } from '../../../lib/format';

interface ScenariosPanelProps {
  currentResult: PlainTaxResult | null;
  onLoadScenario: (result: PlainTaxResult) => void;
}

type ScenarioAction =
  | { type: 'LOAD_SCENARIOS'; scenarios: SavedScenario[] }
  | { type: 'ADD_SCENARIO'; scenario: SavedScenario }
  | { type: 'REMOVE_SCENARIO'; id: string };

interface ScenarioState {
  scenarios: SavedScenario[];
}

function scenarioReducer(state: ScenarioState, action: ScenarioAction): ScenarioState {
  switch (action.type) {
    case 'LOAD_SCENARIOS':
      return { ...state, scenarios: action.scenarios };
    case 'ADD_SCENARIO':
      return { ...state, scenarios: [...state.scenarios, action.scenario] };
    case 'REMOVE_SCENARIO':
      return {
        ...state,
        scenarios: state.scenarios.filter((s) => s.id !== action.id),
      };
    default:
      return state;
  }
}

export const ScenariosPanel: React.FC<ScenariosPanelProps> = ({
  currentResult,
  onLoadScenario,
}) => {
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(scenarioReducer, {
    scenarios: [],
  });

  const [scenarioName, setScenarioName] = useState('');

  useEffect(() => {
    const loaded = loadScenarios();
    dispatch({ type: 'LOAD_SCENARIOS', scenarios: loaded });
  }, []);

  const handleAddScenario = () => {
    if (!currentResult || !scenarioName.trim()) return;

    const updated = addScenario(scenarioName.trim(), currentResult);
    dispatch({ type: 'LOAD_SCENARIOS', scenarios: updated });
    setScenarioName('');
  };

  const handleRemoveScenario = (id: string) => {
    const updated = removeScenario(id);
    dispatch({ type: 'LOAD_SCENARIOS', scenarios: updated });
  };

  return (
    <div
      className="rounded-xl p-6 border-glow card-hover animate-fade-up"
      style={{ backgroundColor: 'var(--color-panel)', border: '1px solid var(--color-border)' }}
    >
      {/* Header cu descriere */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Layers size={24} style={{ color: 'var(--color-accent-primary)' }} />
          <h2 className="text-2xl font-bold gradient-text">{t('home.scenarios.title')}</h2>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          {t('home.scenarios.description')}
        </p>
      </div>

      {/* Salvare scenariu curent */}
      <div className="mb-6">
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {t('home.scenarios.saveLabel')}
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={scenarioName}
            onChange={(e) => setScenarioName(e.target.value)}
            placeholder={t('home.scenarios.namePlaceholder')}
            className="flex-1 px-4 py-2.5 rounded-lg focus:outline-none transition-all"
            style={{
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-primary)',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--color-accent-primary)';
              e.target.style.boxShadow = '0 0 0 2px rgba(251, 191, 36, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--color-border)';
              e.target.style.boxShadow = 'none';
            }}
          />
          <button
            onClick={handleAddScenario}
            disabled={!currentResult || !scenarioName.trim()}
            className="px-5 py-2.5 rounded-lg font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--color-accent-primary)',
              color: '#000',
              cursor: !currentResult || !scenarioName.trim() ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = 'var(--color-accent-secondary)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(251, 191, 36, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-accent-primary)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {t('home.scenarios.saveButton')}
          </button>
        </div>
        <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
          {t('home.scenarios.maxScenariosNote', { count: 10 })}
        </p>
      </div>

      {/* Empty state */}
      {state.scenarios.length === 0 && (
        <div
          className="rounded-lg p-8 text-center"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px dashed var(--color-border)',
          }}
        >
          <Lightbulb
            size={48}
            style={{ color: 'var(--color-accent-primary)', margin: '0 auto 16px' }}
          />
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            {t('home.scenarios.emptyState.title')}
          </h3>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {t('home.scenarios.emptyState.description')}
          </p>
        </div>
      )}

      {/* Tabel scenarii */}
      {state.scenarios.length > 0 && (
        <div
          className="overflow-x-auto rounded-lg"
          style={{ border: '1px solid var(--color-border)' }}
        >
          <table className="min-w-full">
            <thead style={{ backgroundColor: 'var(--color-surface)' }}>
              <tr>
                <th
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {t('home.scenarios.table.scenario')}
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {t('home.scenarios.table.grossIncome')}
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {t('home.scenarios.table.netIncome')}
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {t('home.scenarios.table.totalTaxes')}
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {t('home.scenarios.table.effectiveRate')}
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {t('home.scenarios.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: 'var(--color-panel)' }}>
              {state.scenarios.map((scenario, index) => {
                const currentTotal = currentResult?.breakdown.total ?? 0;
                const scenarioTotal = scenario.result.breakdown.total;
                const diff = scenarioTotal - currentTotal;
                const diffPercent =
                  currentTotal > 0 ? ((diff / currentTotal) * 100).toFixed(1) : null;

                return (
                  <tr
                    key={scenario.id}
                    className="transition-colors"
                    style={{
                      borderTop: index > 0 ? '1px solid var(--color-border)' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(251, 191, 36, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td
                      className="px-4 py-3 text-sm font-medium"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      <div className="flex items-center gap-2">
                        {scenario.name}
                        {currentResult && diff !== 0 && diffPercent && (
                          <div
                            className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold"
                            style={{
                              backgroundColor:
                                diff > 0 ? 'rgba(255, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                              color: diff > 0 ? '#ff4444' : '#10b981',
                              border: `1px solid ${diff > 0 ? 'rgba(255, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                            }}
                          >
                            {diff > 0 ? (
                              <TrendingUp size={10} />
                            ) : diff < 0 ? (
                              <TrendingDown size={10} />
                            ) : (
                              <Minus size={10} />
                            )}
                            {diffPercent}%
                          </div>
                        )}
                      </div>
                    </td>
                    <td
                      className="px-4 py-3 text-sm text-right font-mono"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {formatLeiRounded(scenario.result.input.grossIncome)}
                    </td>
                    <td
                      className="px-4 py-3 text-sm text-right font-mono font-semibold"
                      style={{ color: '#10b981' }}
                    >
                      {formatLeiRounded(scenario.result.breakdown.netIncome)}
                    </td>
                    <td
                      className="px-4 py-3 text-sm text-right font-mono font-semibold"
                      style={{ color: '#ff4444' }}
                    >
                      {formatLeiRounded(scenario.result.breakdown.total)}
                    </td>
                    <td
                      className="px-4 py-3 text-sm text-right font-mono font-semibold"
                      style={{ color: 'var(--color-accent-electric)' }}
                    >
                      {scenario.result.breakdown.effectiveRate !== null
                        ? formatPercent(scenario.result.breakdown.effectiveRate)
                        : '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onLoadScenario(scenario.result)}
                          className="p-2 rounded-lg transition-all"
                          style={{
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            color: '#10b981',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.2)';
                            e.currentTarget.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                          title={t('home.scenarios.actions.load')}
                        >
                          <Upload size={16} />
                        </button>
                        <button
                          onClick={() => handleRemoveScenario(scenario.id)}
                          className="p-2 rounded-lg transition-all"
                          style={{
                            backgroundColor: 'rgba(255, 68, 68, 0.1)',
                            color: '#ff4444',
                            border: '1px solid rgba(255, 68, 68, 0.3)',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 68, 68, 0.2)';
                            e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 68, 68, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 68, 68, 0.1)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                          title={t('home.scenarios.actions.delete')}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
