import { BlogPage, BlogPostPage, CalculatorPage, SettingsPage } from '@features';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const AppLayout: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CalculatorPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter basename="/pfa-taxes-calculator">
      <AppLayout />
    </BrowserRouter>
  );
};
