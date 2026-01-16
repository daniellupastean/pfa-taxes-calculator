import type { PlainTaxResult } from '../domain/tax/models';

const STORAGE_KEY = 'pfa_tax_scenarios_v1';
const MAX_SCENARIOS = 10;

export interface SavedScenario {
  id: string;
  name: string;
  timestamp: number;
  result: PlainTaxResult;
}

export function loadScenarios(): SavedScenario[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as SavedScenario[];
  } catch (error) {
    console.error('Error loading scenarios:', error);
    return [];
  }
}

export function saveScenarios(scenarios: SavedScenario[]): void {
  try {
    const limited = scenarios.slice(-MAX_SCENARIOS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
  } catch (error) {
    console.error('Error saving scenarios:', error);
  }
}

export function addScenario(name: string, result: PlainTaxResult): SavedScenario[] {
  const scenarios = loadScenarios();
  const newScenario: SavedScenario = {
    id: `scenario_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    timestamp: Date.now(),
    result,
  };

  const updated = [...scenarios, newScenario];
  saveScenarios(updated);
  return updated;
}

export function removeScenario(id: string): SavedScenario[] {
  const scenarios = loadScenarios();
  const updated = scenarios.filter((s) => s.id !== id);
  saveScenarios(updated);
  return updated;
}

export function exportScenarioAsJson(scenario: SavedScenario): void {
  const dataStr = JSON.stringify(scenario, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${scenario.name.replace(/\s+/g, '_')}_${new Date(scenario.timestamp).toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
