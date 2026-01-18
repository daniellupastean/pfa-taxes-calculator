import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './App';
import { AppProviders } from '../shared/providers/AppProviders';
import '../i18n/config';

function renderApp() {
  return render(
    <AppProviders>
      <App />
    </AppProviders>
  );
}

describe('App', () => {
  it('should render the app title', () => {
    renderApp();
    const titles = screen.getAllByText(/Romanian PFA Tax Calculator/i);
    expect(titles.length).toBeGreaterThan(0);
  });

  it('should render input fields', () => {
    renderApp();
    expect(screen.getByText(/Annual Gross Income/i)).toBeInTheDocument();
    expect(screen.getByText(/Annual Deductible Expenses/i)).toBeInTheDocument();
  });

  it('should render results card', () => {
    renderApp();
    expect(screen.getByText(/Calculation Results/i)).toBeInTheDocument();
  });

  it('should render tax rate chart', () => {
    renderApp();
    expect(screen.getByText(/Effective Tax Rate Evolution/i)).toBeInTheDocument();
  });

  it('should render scenarios panel', () => {
    renderApp();
    expect(screen.getByText(/Planning Scenarios/i)).toBeInTheDocument();
  });

  it('should render settings button', () => {
    renderApp();
    expect(screen.getByTitle(/Settings/i)).toBeInTheDocument();
  });

  it('should show initial calculation results with zero values', () => {
    renderApp();
    expect(screen.getByText(/Total Taxes and Contributions/i)).toBeInTheDocument();
  });
});
