import React from 'react';

import LandingPage from './pages/LandingPage/LandingPage';
import NutritionPage from './pages/NutritionPage/NutritionPage';
import MapPage from './pages/MapPage/MapPage';
import ForceLayoutPage from './pages/ForceLayoutPage/ForceLayoutPage';
import BarPage from './pages/BarPage/BarPage';

import './App.css';

function App() {
  return (
    <div>
      <LandingPage />
      <NutritionPage />
      <MapPage />
      <ForceLayoutPage />
      <BarPage />
    </div>
  );
}

export default App;
