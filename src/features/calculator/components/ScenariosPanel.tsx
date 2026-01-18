import React, { useReducer, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Layers, Upload, Trash2, Lightbulb } from 'lucide-react';
import type { PlainTaxResult } from '@domain/tax/models';
import type { SavedScenario } from '@lib/storage';
import { loadScenarios, addScenario, removeScenario } from '@lib/storage';
import { formatPercent } from '@lib/format';
import { useCurrency } from '@shared/contexts';

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
  const { inputCurrency, convertFromRON, formatCurrency } = useCurrency();
  const [state, dispatch] = useReducer(scenarioReducer, {
    scenarios: [],
  });

  const [scenarioName, setScenarioName] = useState('');

  // Helper to format scenario amounts in current input currency
  const formatScenarioAmount = (amountInRON: number) => {
    const converted = inputCurrency === 'RON' ? amountInRON : convertFromRON(amountInRON, inputCurrency);
    return formatCurrency(converted, inputCurrency);
  };

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
    <div className="rounded-xl p-6 border-glow card-hover animate-fade-up bg-panel border border-border">
      {/* Panel header and description */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Layers size={24} className="text-accent-primary" />
          <h2 className="text-2xl font-bold gradient-text">{t('home.scenarios.title')}</h2>
        </div>
        <p className="text-sm leading-relaxed text-text-secondary">
          {t('home.scenarios.description')}
        </p>
      </div>

      {/* Save the current scenario */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-text-secondary">
          {t('home.scenarios.saveLabel')}
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={scenarioName}
            onChange={(e) => setScenarioName(e.target.value)}
            placeholder={t('home.scenarios.namePlaceholder')}
            className="flex-1 px-4 py-2.5 rounded-lg focus:outline-none transition-all border border-border bg-surface text-text-primary focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/10"
          />
          <button
            onClick={handleAddScenario}
            disabled={!currentResult || !scenarioName.trim()}
            className="px-5 py-2.5 rounded-lg font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-accent-primary text-black hover:bg-accent-secondary hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] cursor-pointer"
          >
            {t('home.scenarios.saveButton')}
          </button>
        </div>
        <p className="text-xs mt-2 text-text-muted">
          {t('home.scenarios.maxScenariosNote', { count: 10 })}
        </p>
      </div>

      {/* Empty state when no scenarios are saved */}
      {state.scenarios.length === 0 && (
        <div className="rounded-lg p-8 text-center bg-surface border border-dashed border-border">
          <Lightbulb size={48} className="text-accent-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-text-primary">
            {t('home.scenarios.emptyState.title')}
          </h3>
          <p className="text-sm text-text-secondary">
            {t('home.scenarios.emptyState.description')}
          </p>
        </div>
      )}

      {/* Saved scenarios table */}
      {state.scenarios.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="min-w-full">
            <thead className="bg-surface">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                  {t('home.scenarios.table.scenario')}
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-muted">
                  {t('home.scenarios.table.grossIncome')}
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-muted">
                  {t('home.scenarios.table.netIncome')}
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-muted">
                  {t('home.scenarios.table.totalTaxes')}
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-muted">
                  {t('home.scenarios.table.effectiveRate')}
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-text-muted">
                  {t('home.scenarios.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-panel">
              {state.scenarios.map((scenario, index) => (
                  <tr
                    key={scenario.id}
                    className={`transition-colors hover:bg-accent-primary/5 ${index > 0 ? 'border-t border-border' : ''}`}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-text-primary">
                      <div className="flex items-center gap-2">
                        {scenario.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-mono text-text-secondary">
                      {formatScenarioAmount(scenario.result.input.grossIncome)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-mono font-semibold text-success">
                      {formatScenarioAmount(scenario.result.breakdown.netIncome)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-mono font-semibold text-danger">
                      {formatScenarioAmount(scenario.result.breakdown.total)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-mono font-semibold text-accent-electric">
                      {scenario.result.breakdown.effectiveRate !== null
                        ? formatPercent(scenario.result.breakdown.effectiveRate)
                        : '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onLoadScenario(scenario.result)}
                          className="p-2 rounded-lg transition-all bg-success/10 text-success border border-success/30 cursor-pointer hover:bg-success/20 hover:shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                          title={t('home.scenarios.actions.load')}
                        >
                          <Upload size={16} />
                        </button>
                        <button
                          onClick={() => handleRemoveScenario(scenario.id)}
                          className="p-2 rounded-lg transition-all bg-danger/10 text-danger border border-danger/30 cursor-pointer hover:bg-danger/20 hover:shadow-[0_0_10px_rgba(255,68,68,0.2)]"
                          title={t('home.scenarios.actions.delete')}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
