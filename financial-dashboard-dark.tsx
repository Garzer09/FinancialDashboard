import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

// --- Constantes y configuración ---
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];
const RISK_COLORS = {
  'Crítico': '#ef4444',
  'Alto': '#f97316',
  'Medio': '#eab308',
  'Bajo': '#22c55e'
};
const RADIAN = Math.PI / 180;

// --- Componentes auxiliares ---
const KpiCard = ({ title, value, unit = '', description = '', trend = null, darkMode = true }) => {
  const bgColor = darkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = darkMode ? 'text-gray-100' : 'text-gray-800';
  const subTextColor = darkMode ? 'text-gray-300' : 'text-gray-600';
  
  return (
    <div className={`${bgColor} p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-700`}>
      <h3 className={`text-sm font-semibold ${subTextColor} mb-1`}>{title}</h3>
      <p className={`text-2xl font-bold mb-1 ${textColor}`}>
        {value}
        <span className="text-lg ml-1">{unit}</span>
        {trend !== null && !isNaN(trend) && (
          <span className={`ml-2 text-sm font-semibold ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend >= 0 ? '▲' : '▼'} {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </p>
      {description && <p className={`text-xs ${subTextColor}`}>{description}</p>}
    </div>
  );
};

const RiskEvaluationCard = ({ risk, darkMode = true }) => {
  const bgColor = darkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = `border-${RISK_COLORS[risk.severity].replace('#', '')}`;
  const textColor = darkMode ? 'text-gray-100' : 'text-gray-800';
  const subTextColor = darkMode ? 'text-gray-300' : 'text-gray-600';
  
  // Determine color based on severity
  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'Crítico': return darkMode ? 'text-red-500' : 'text-red-600';
      case 'Alto': return darkMode ? 'text-orange-500' : 'text-orange-600';
      case 'Medio': return darkMode ? 'text-yellow-500' : 'text-yellow-600';
      case 'Bajo': return darkMode ? 'text-green-500' : 'text-green-600';
      default: return darkMode ? 'text-gray-300' : 'text-gray-600';
    }
  };
  
  const severityColor = getSeverityColor(risk.severity);
  const impactColor = getSeverityColor(risk.impactLevel);
  const probabilityColor = getSeverityColor(risk.probabilityLevel);
  
  return (
    <div className={`${bgColor} p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-700`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className={`text-lg font-bold ${textColor}`}>{risk.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${severityColor} bg-opacity-20 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          {risk.severity}
        </span>
      </div>
      <p className={`text-sm ${subTextColor} mb-3`}>{risk.description}</p>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className={`p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <span className={`text-xs ${subTextColor}`}>Impacto</span>
          <p className={`text-sm font-bold ${impactColor}`}>{risk.impactLevel} ({risk.impact}/10)</p>
        </div>
        <div className={`p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <span className={`text-xs ${subTextColor}`}>Probabilidad</span>
          <p className={`text-sm font-bold ${probabilityColor}`}>{risk.probabilityLevel} ({risk.probability}/10)</p>
        </div>
      </div>
      
      <div className={`p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-3`}>
        <h4 className={`text-xs font-semibold ${subTextColor} mb-1`}>Factores clave</h4>
        <ul className={`list-disc pl-4 text-xs ${subTextColor}`}>
          {risk.factors.map((factor, idx) => (
            <li key={idx}>{factor}</li>
          ))}
        </ul>
      </div>
      
      <div className={`p-2 rounded ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <h4 className={`text-xs font-semibold ${subTextColor} mb-1`}>Estrategias de mitigación</h4>
        <ul className={`list-disc pl-4 text-xs ${subTextColor}`}>
          {risk.mitigation.map((strategy, idx) => (
            <li key={idx}>{strategy}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Componente principal
const FinancialDashboard = () => {
  // --- Estados ---
  const [darkMode, setDarkMode] = useState(true);
  const [selectedSection, setSelectedSection] = useState('overview');
  const [selectedYear, setSelectedYear] = useState(2017);
  const [previousYear, setPreviousYear] = useState(2016);
  
  // Datos financieros simulados basados en el caso DIA
  const financialData = {
    2017: {
      assets: {
        nonCurrent: {
          intangibleAssets: 595838,
          tangibleAssets: 1363963,
          longTermFinancialInvestments: 149071,
          deferredTaxAssets: 253983,
          total: 2362855
        },
        current: {
          nonCurrentAssetsHeldForSale: 39663,
          inventory: 569644,
          accountsReceivable: 286932,
          shortTermFinancialInvestments: 19500,
          cashAndEquivalents: 347580,
          total: 1263319
        },
        total: 3626174
      },
      equity: 325983,
      liabilities: {
        longTerm: 1009198,
        shortTerm: {
          suppliers: 1807433,
          shortTermFinancialDebt: 483560,
          total: 2290993
        },
        total: 3300191
      },
      income: {
        sales: 8620550,
        costOfSales: 6808596,
        personnelCosts: 808943,
        otherOperatingCosts: 645071,
        depreciation: 235512,
        ebit: 122428,
        extraordinaryResults: 128941,
        financialExpenses: 65334,
        ebt: 186035
      }
    },
    2016: {
      assets: {
        nonCurrent: {
          intangibleAssets: 595323,
          tangibleAssets: 1469078,
          longTermFinancialInvestments: 128588,
          deferredTaxAssets: 314273,
          total: 2507262
        },
        current: {
          nonCurrentAssetsHeldForSale: 0,
          inventory: 669592,
          accountsReceivable: 340781,
          shortTermFinancialInvestments: 25954,
          cashAndEquivalents: 372740,
          total: 1409067
        },
        total: 3916329
      },
      equity: 392883,
      liabilities: {
        longTerm: 1154223,
        shortTerm: {
          suppliers: 2053847,
          shortTermFinancialDebt: 315376,
          total: 2369223
        },
        total: 3523446
      },
      income: {
        sales: 8867621,
        costOfSales: 6942007,
        personnelCosts: 846103,
        otherOperatingCosts: 653549,
        depreciation: 232953,
        ebit: 193009,
        extraordinaryResults: 109572,
        financialExpenses: 59928,
        ebt: 242653
      }
    }
  };
  
  // --- Cálculo de Ratios ---
  const calculateRatios = (year) => {
    const data = financialData[year];
    if (!data) return {};
    
    const activoTotal = data.assets.total;
    const activoCorriente = data.assets.current.total;
    const activoNoCorriente = data.assets.nonCurrent.total;
    const patrimonioNeto = data.equity;
    const pasivoCorriente = data.liabilities.shortTerm.total;
    const pasivoNoCorriente = data.liabilities.longTerm.total;
    const pasivoTotal = data.liabilities.total;
    const disponible = data.assets.current.cashAndEquivalents;
    const existencias = data.assets.current.inventory;
    const ventas = data.income.sales;
    const ebit = data.income.ebit;
    const ebitda = ebit + data.income.depreciation;
    const bai = data.income.ebt;
    const deudaFinanciera = pasivoNoCorriente + data.liabilities.shortTerm.shortTermFinancialDebt;
    
    return {
      // Estructura y solvencia
      solidezPatrimonial: patrimonioNeto / activoTotal,
      solvenciaCapacidad: activoTotal / pasivoTotal,
      apalancamientoFinanciero: activoTotal / patrimonioNeto,
      // Liquidez
      liquidez: activoCorriente / pasivoCorriente,
      puntualidad: (activoCorriente - existencias) / pasivoCorriente,
      tesoreriaInmediata: disponible / pasivoCorriente,
      fondoManiobra: activoCorriente - pasivoCorriente,
      // Rentabilidad
      roe: bai / patrimonioNeto,
      roa: bai / activoTotal,
      roaOperativo: ebit / activoTotal,
      // Márgenes
      margenBruto: (ventas - data.income.costOfSales) / ventas,
      margenEbit: ebit / ventas,
      margenBai: bai / ventas,
      // Eficiencia
      rotacionActivos: ventas / activoTotal,
      // Capacidad de pago
      capacidadDevolucionDeuda: ebitda / deudaFinanciera
    };
  };
  
  // Cálculo de ratios para los años seleccionados
  const currentRatios = useMemo(() => calculateRatios(selectedYear), [selectedYear]);
  const prevRatios = useMemo(() => calculateRatios(previousYear), [previousYear]);
  
  // Cálculo de tendencias para KPIs
  const getTrend = (ratioName) => {
    if (!prevRatios || !currentRatios[ratioName] || !prevRatios[ratioName]) return null;
    if (prevRatios[ratioName] === 0) return null;
    return ((currentRatios[ratioName] / prevRatios[ratioName]) - 1) * 100;
  };
  
  // Formateador de números
  const formatNumber = (value, decimals = 1, unit = '') => {
    if (typeof value !== 'number' || !isFinite(value)) return '-';
    const multiplier = unit === '%' ? 100 : 1;
    return `${(value * multiplier).toLocaleString('es-ES', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${unit}`;
  };
  
  // --- Datos para gráficos ---
  const chartData = useMemo(() => {
    // Datos balance para gráfico de barras
    const balanceData = [
      { name: 'Act. No Corriente', [previousYear]: financialData[previousYear].assets.nonCurrent.total, [selectedYear]: financialData[selectedYear].assets.nonCurrent.total },
      { name: 'Act. Corriente', [previousYear]: financialData[previousYear].assets.current.total, [selectedYear]: financialData[selectedYear].assets.current.total },
      { name: 'Patrimonio Neto', [previousYear]: financialData[previousYear].equity, [selectedYear]: financialData[selectedYear].equity },
      { name: 'Pas. No Corriente', [previousYear]: financialData[previousYear].liabilities.longTerm, [selectedYear]: financialData[selectedYear].liabilities.longTerm },
      { name: 'Pas. Corriente', [previousYear]: financialData[previousYear].liabilities.shortTerm.total, [selectedYear]: financialData[selectedYear].liabilities.shortTerm.total },
    ];
    
    // Datos cuenta de resultados para gráfico de barras
    const incomeData = [
      { name: 'Ventas', [previousYear]: financialData[previousYear].income.sales, [selectedYear]: financialData[selectedYear].income.sales },
      { name: 'EBIT', [previousYear]: financialData[previousYear].income.ebit, [selectedYear]: financialData[selectedYear].income.ebit },
      { name: 'BAI', [previousYear]: financialData[previousYear].income.ebt, [selectedYear]: financialData[selectedYear].income.ebt },
    ];
    
    // Datos para gráfico de pie (estructura balance)
    const balancePieData = [
      { name: 'Act. No Corriente', value: financialData[selectedYear].assets.nonCurrent.total },
      { name: 'Act. Corriente', value: financialData[selectedYear].assets.current.total },
      { name: 'Patrimonio Neto', value: financialData[selectedYear].equity },
      { name: 'Pas. No Corriente', value: financialData[selectedYear].liabilities.longTerm },
      { name: 'Pas. Corriente', value: financialData[selectedYear].liabilities.shortTerm.total },
    ];
    
    // Datos para radar de ratios
    const ratiosRadarData = [
      { ratio: 'Solidez Patrimonial', [previousYear]: prevRatios.solidezPatrimonial * 10, [selectedYear]: currentRatios.solidezPatrimonial * 10 },
      { ratio: 'Liquidez', [previousYear]: prevRatios.liquidez * 0.7, [selectedYear]: currentRatios.liquidez * 0.7 },
      { ratio: 'ROE', [previousYear]: prevRatios.roe * 0.2, [selectedYear]: currentRatios.roe * 0.2 },
      { ratio: 'ROA', [previousYear]: prevRatios.roa * 2, [selectedYear]: currentRatios.roa * 2 },
      { ratio: 'Margen EBIT', [previousYear]: prevRatios.margenEbit * 10, [selectedYear]: currentRatios.margenEbit * 10 },
      { ratio: 'Rotación', [previousYear]: prevRatios.rotacionActivos * 0.4, [selectedYear]: currentRatios.rotacionActivos * 0.4 },
    ];
    
    // Datos para evolución de ratios
    const ratiosEvolution = [
      { name: 'Solidez Patrimonial (%)', 2016: prevRatios.solidezPatrimonial * 100, 2017: currentRatios.solidezPatrimonial * 100 },
      { name: 'Liquidez', 2016: prevRatios.liquidez, 2017: currentRatios.liquidez },
      { name: 'ROE (%)', 2016: prevRatios.roe * 100, 2017: currentRatios.roe * 100 },
      { name: 'ROA (%)', 2016: prevRatios.roa * 100, 2017: currentRatios.roa * 100 },
      { name: 'Margen EBIT (%)', 2016: prevRatios.margenEbit * 100, 2017: currentRatios.margenEbit * 100 },
    ];
    
    // Matriz de riesgo
    const riskMatrix = [];
    for (let impact = 1; impact <= 10; impact++) {
      for (let probability = 1; probability <= 10; probability++) {
        riskMatrix.push({
          x: probability,
          y: impact,
          z: impact * probability,
        });
      }
    }
    
    return { 
      balanceData, 
      incomeData, 
      balancePieData, 
      ratiosRadarData, 
      ratiosEvolution,
      riskMatrix
    };
  }, [selectedYear, previousYear, currentRatios, prevRatios]);
  
  // --- Evaluación de Riesgos ---
  const riskEvaluation = useMemo(() => {
    // Helper para determinar nivel
    const getLevel = (value) => {
      if (value >= 8) return 'Crítico';
      if (value >= 6) return 'Alto';
      if (value >= 4) return 'Medio';
      return 'Bajo';
    };
    
    // Helper para calcular severidad
    const calculateSeverity = (impact, probability) => {
      const score = impact * probability / 10;
      return getLevel(score);
    };
    
    return [
      {
        id: 1,
        title: 'Riesgo de Insolvencia',
        description: 'Baja solidez patrimonial (8.99%) y alta dependencia de financiación externa aumentan el riesgo de insolvencia ante situaciones adversas.',
        impact: 9,
        impactLevel: getLevel(9),
        probability: 6,
        probabilityLevel: getLevel(6),
        severity: calculateSeverity(9, 6),
        factors: [
          'Patrimonio neto representa solo el 8.99% del activo total',
          'Apalancamiento financiero elevado (11.12 veces)',
          'Deterioro de la solidez respecto al año anterior (10.03%)',
          'Dependencia crítica de financiación externa'
        ],
        mitigation: [
          'Reestructuración financiera urgente para fortalecer el patrimonio neto',
          'Ampliación de capital o reinversión total de beneficios',
          'Desinversión en activos no estratégicos para reducir endeudamiento',
          'Renegociación de deuda para mejorar condiciones y plazos'
        ],
        ratios: ['solidezPatrimonial', 'apalancamientoFinanciero'],
        coordinates: {x: 6, y: 9}
      },
      {
        id: 2,
        title: 'Riesgo de Liquidez',
        description: 'Baja liquidez (0.55) y fondo de maniobra negativo comprometen la capacidad de la empresa para atender sus compromisos a corto plazo.',
        impact: 8,
        impactLevel: getLevel(8),
        probability: 7,
        probabilityLevel: getLevel(7),
        severity: calculateSeverity(8, 7),
        factors: [
          'Ratio de liquidez (0.55) muy por debajo del umbral mínimo (1.0)',
          'Fondo de maniobra negativo (-1,027,674 mil €)',
          'Baja cobertura de pasivos corrientes inmediatos (tesorería/pasivo corriente: 0.15)',
          'Deterioro respecto al año anterior (liquidez 2016: 0.59)'
        ],
        mitigation: [
          'Negociación urgente con proveedores para extender plazos de pago',
          'Optimización agresiva del capital circulante',
          'Refinanciación de deuda a corto plazo',
          'Aceleración de rotación de inventarios',
          'Políticas más estrictas de gestión de crédito a clientes'
        ],
        ratios: ['liquidez', 'puntualidad', 'tesoreriaInmediata'],
        coordinates: {x: 7, y: 8}
      },
      {
        id: 3,
        title: 'Deterioro de Rentabilidad Operativa',
        description: 'Significativa caída en el margen operativo y rentabilidad de los activos sugiere problemas en la eficiencia operativa del negocio.',
        impact: 7,
        impactLevel: getLevel(7),
        probability: 8,
        probabilityLevel: getLevel(8),
        severity: calculateSeverity(7, 8),
        factors: [
          'Descenso del margen EBIT de 2.18% a 1.42%',
          'Caída del ROA operativo de 4.97% a 3.43%',
          'Deterioro de márgenes a pesar de ligera mejora en rotación',
          'Posible pérdida de eficiencia operativa o incremento de costes'
        ],
        mitigation: [
          'Análisis detallado de la estructura de costes',
          'Optimización de procesos operativos',
          'Revisión de la política de precios',
          'Evaluación de rentabilidad por línea de producto',
          'Plan de mejora de eficiencia operativa global'
        ],
        ratios: ['margenEbit', 'roaOperativo'],
        coordinates: {x: 8, y: 7}
      },
      {
        id: 4,
        title: 'Riesgo de Refinanciación',
        description: 'Baja capacidad de devolución de deuda podría dificultar la refinanciación en condiciones favorables.',
        impact: 6,
        impactLevel: getLevel(6),
        probability: 7,
        probabilityLevel: getLevel(7),
        severity: calculateSeverity(6, 7),
        factors: [
          'Ratio de capacidad de devolución de deuda (EBITDA/Deuda) de 0.24',
          'Deterioro respecto al año anterior (0.29)',
          'Posible incremento del coste financiero en nuevas operaciones',
          'Potencial reducción de calificación crediticia'
        ],
        mitigation: [
          'Diversificación de fuentes de financiación',
          'Búsqueda de alternativas con menor coste financiero',
          'Refinanciación anticipada para evitar condiciones desfavorables',
          'Mejora de EBITDA mediante optimización operativa'
        ],
        ratios: ['capacidadDevolucionDeuda'],
        coordinates: {x: 7, y: 6}
      },
      {
        id: 5,
        title: 'Riesgo de Mercado',
        description: 'Caída de ventas y deterioro de márgenes sugieren presiones competitivas que podrían intensificarse.',
        impact: 7,
        impactLevel: getLevel(7),
        probability: 6,
        probabilityLevel: getLevel(6),
        severity: calculateSeverity(7, 6),
        factors: [
          'Descenso de ventas de 8,867,621 mil € a 8,620,550 mil € (-2.8%)',
          'Reducción de margen EBIT en un 35%',
          'Posible incremento de la presión competitiva en el sector',
          'Cambios en las preferencias o comportamiento de los consumidores'
        ],
        mitigation: [
          'Análisis de mercado y competencia',
          'Revisión del posicionamiento estratégico',
          'Renovación de la propuesta de valor',
          'Optimización del mix de productos',
          'Mejora de la experiencia del cliente'
        ],
        ratios: ['margenEbit'],
        coordinates: {x: 6, y: 7}
      }
    ];
  }, [currentRatios, prevRatios]);
  
  // --- Componente de matriz de riesgo ---
  const RiskMatrix = ({ risks, darkMode }) => {
    const bgColor = darkMode ? 'bg-gray-800' : 'bg-white';
    const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
    const textColor = darkMode ? 'text-gray-100' : 'text-gray-800';
    
    return (
      <div className={`${bgColor} p-4 rounded-lg shadow-lg border ${borderColor}`}>
        <h3 className={`text-lg font-bold mb-3 ${textColor}`}>Matriz de Riesgos</h3>
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#444" : "#ccc"} />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Probabilidad" 
              domain={[0, 10]} 
              label={{ value: 'Probabilidad', position: 'bottom', fill: darkMode ? '#eee' : '#333' }} 
              tick={{ fill: darkMode ? '#eee' : '#333' }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Impacto" 
              domain={[0, 10]} 
              label={{ value: 'Impacto', angle: -90, position: 'left', fill: darkMode ? '#eee' : '#333' }} 
              tick={{ fill: darkMode ? '#eee' : '#333' }}
            />
            <Tooltip
              formatter={(value, name) => [value, name]}
              contentStyle={{ backgroundColor: darkMode ? '#333' : '#fff', borderColor: darkMode ? '#555' : '#ccc' }}
              itemStyle={{ color: darkMode ? '#eee' : '#333' }}
            />
            <Scatter 
              data={chartData.riskMatrix} 
              fill="#8884d8"
            >
              {chartData.riskMatrix.map((entry, index) => {
                const severity = entry.z;
                let color = RISK_COLORS.Bajo;
                if (severity >= 64) color = RISK_COLORS.Crítico;
                else if (severity >= 36) color = RISK_COLORS.Alto;
                else if (severity >= 16) color = RISK_COLORS.Medio;
                
                return <Cell key={`cell-${index}`} fill={color} fillOpacity={0.1} />;
              })}
            </Scatter>
            
            {risks.map((risk, index) => (
              <Scatter
                key={`risk-${index}`}
                name={risk.title}
                data={[risk.coordinates]}
                fill={RISK_COLORS[risk.severity]}
              />
              
            ))}
          </ScatterChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {Object.entries(RISK_COLORS).map(([severity, color]) => (
            <div key={severity} className="flex items-center">
              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color }}></div>
              <span className={`text-xs ${textColor}`}>{severity}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Función para renderizar la sección principal
  const renderSection = () => {
    const bgColor = darkMode ? 'bg-gray-800' : 'bg-white';
    const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
    const textColor = darkMode ? 'text-gray-100' : 'text-gray-800';
    const subTextColor = darkMode ? 'text-gray-300' : 'text-gray-600';
    const highlightBg = darkMode ? 'bg-gray-700' : 'bg-gray-100';
    
    switch(selectedSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className={`${bgColor} p-6 rounded-lg shadow-lg border ${borderColor}`}>
              <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Visión General - Ejercicio {selectedYear}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard 
                  title="ROE (Rent. Financiera)" 
                  value={formatNumber(currentRatios.roe, 1, '%')} 
                  trend={getTrend('roe')} 
                  description="BAI / Patrimonio Neto" 
                  darkMode={darkMode}
                />
                <KpiCard 
                  title="ROA (Rent. Económica)" 
                  value={formatNumber(currentRatios.roa, 1, '%')} 
                  trend={getTrend('roa')} 
                  description="BAI / Activo Total" 
                  darkMode={darkMode}
                />
                <KpiCard 
                  title="Solidez Patrimonial" 
                  value={formatNumber(currentRatios.solidezPatrimonial, 1, '%')} 
                  trend={getTrend('solidezPatrimonial')} 
                  description="Patrimonio Neto / Activo Total" 
                  darkMode={darkMode}
                />
                <KpiCard 
                  title="Liquidez" 
                  value={formatNumber(currentRatios.liquidez, 2)} 
                  trend={getTrend('liquidez')} 
                  description="Activo Corriente / Pasivo Corriente" 
                  darkMode={darkMode}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`${bgColor} p-6 rounded-lg shadow-lg border ${borderColor}`}>
                <h3 className={`text-lg font-bold mb-4 ${textColor}`}>Evolución de Ratios</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={chartData.ratiosEvolution}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#444" : "#ccc"} />
                    <XAxis dataKey="name" tick={{ fill: darkMode ? '#eee' : '#333' }} />
                    <YAxis tick={{ fill: darkMode ? '#eee' : '#333' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: darkMode ? '#333' : '#fff', borderColor: darkMode ? '#555' : '#ccc' }}
                      itemStyle={{ color: darkMode ? '#eee' : '#333' }}
                    />
                    <Legend wrapperStyle={{ color: darkMode ? '#eee' : '#333' }} />
                    <Bar dataKey="2016" fill={COLORS[0]} />
                    <Bar dataKey="2017" fill={COLORS[1]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className={`${bgColor} p-6 rounded-lg shadow-lg border ${borderColor}`}>
                <h3 className={`text-lg font-bold mb-4 ${textColor}`}>Análisis Comparativo de Ratios</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart outerRadius={90} data={chartData.ratiosRadarData}>
                    <PolarGrid stroke={darkMode ? "#444" : "#ccc"} />
                    <PolarAngleAxis dataKey="ratio" tick={{ fill: darkMode ? '#eee' : '#333' }} />
                    <PolarRadiusAxis stroke={darkMode ? "#666" : "#999"} tick={{ fill: darkMode ? '#eee' : '#333' }} />
                    <Radar name={previousYear} dataKey={previousYear} stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.3} />
                    <Radar name={selectedYear} dataKey={selectedYear} stroke={COLORS[1]} fill={COLORS[1]} fillOpacity={0.3} />
                    <Legend wrapperStyle={{ color: darkMode ? '#eee' : '#333' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: darkMode ? '#333' : '#fff', borderColor: darkMode ? '#555' : '#ccc' }}
                      itemStyle={{ color: darkMode ? '#eee' : '#333' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className={`${bgColor} p-6 rounded-lg shadow-lg border ${borderColor}`}>
              <h3 className={`text-lg font-bold mb-4 ${textColor}`}>Diagnóstico general</h3>
              <p className={`mb-4 ${textColor}`}>
                La empresa presenta un deterioro general en sus indicadores financieros entre 2016 y 2017. 
                La solidez patrimonial ha disminuido del 10.03% al 8.99%, indicando una mayor dependencia de financiación externa. 
                La liquidez también ha empeorado (de 0.59 a 0.55), manteniéndose en niveles preocupantes por debajo de 1.
                Se observa una significativa caída en la rentabilidad operativa (margen EBIT de 2.18% a 1.42%) 
                aunque se ha compensado parcialmente con una ligera mejora en la rotación de activos.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className={`p-4 rounded-lg ${highlightBg}`}>
                  <h4 className={`font-semibold mb-2 text-green-500`}>Fortalezas</h4>
                  <ul className={`list-disc pl-5 ${subTextColor}`}>
                    <li>Alta rotación de activos (2.38 veces), indicando eficiencia en generación de ventas</li>
                    <li>Rentabilidad financiera (ROE) alta (57.07%), aunque con alto riesgo por apalancamiento</li>
                    <li>Ligera mejora en la gestión de existencias (reducción de inventario)</li>
                  </ul>
                </div>
                
                <div className={`p-4 rounded-lg ${highlightBg}`}>
                  <h4 className={`font-semibold mb-2 text-red-500`}>Debilidades</h4>
                  <ul className={`list-disc pl-5 ${subTextColor}`}>
                    <li>Baja solidez patrimonial (8.99%) con tendencia negativa</li>
                    <li>Liquidez insuficiente (0.55) para cubrir compromisos a corto plazo</li>
                    <li>Bajo margen operativo (1.42%) y en deterioro</li>
                    <li>Débil capacidad de devolución de deuda (0.24)</li>
                  </ul>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${highlightBg}`}>
                <h4 className={`font-semibold mb-2 text-blue-500`}>Modelo de negocio</h4>
                <p className={subTextColor}>
                  El modelo de negocio se basa en la rotación y no en el margen. El ROE (57.07%) proviene principalmente 
                  del efecto apalancamiento (11.12 veces) y no de la rentabilidad económica (5.13%), lo que aumenta 
                  significativamente el riesgo financiero.
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'riskAnalysis':
        return (
          <div className="space-y-6">
            <div className={`${bgColor} p-6 rounded-lg shadow-lg border ${borderColor}`}>
              <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Análisis Avanzado de Riesgos</h2>
              <p className={`mb-6 ${textColor}`}>
                Este módulo proporciona una evaluación detallada de los principales riesgos financieros 
                identificados a partir del análisis de los estados financieros, incluyendo su probabilidad, 
                impacto potencial y estrategias de mitigación recomendadas.
              </p>
              
              <RiskMatrix risks={riskEvaluation} darkMode={darkMode} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {riskEvaluation.slice(0, 2).map(risk => (
                  <RiskEvaluationCard key={risk.id} risk={risk} darkMode={darkMode} />
                ))}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                {riskEvaluation.slice(2, 5).map(risk => (
                  <RiskEvaluationCard key={risk.id} risk={risk} darkMode={darkMode} />
                ))}
              </div>
              
              <div className={`mt-6 p-4 rounded-lg ${highlightBg}`}>
                <h4 className={`font-semibold mb-2 ${textColor}`}>Evaluación de Riesgo Global</h4>
                <p className={subTextColor}>
                  El perfil de riesgo de la compañía se ha deteriorado significativamente respecto al ejercicio anterior. 
                  La combinación de riesgos financieros (baja solidez, escasa liquidez) y operativos (caída de márgenes) 
                  genera un escenario de alta vulnerabilidad ante cualquier deterioro adicional del entorno de negocio. 
                  Se requieren acciones correctivas urgentes en diversas áreas para evitar una potencial crisis financiera.
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'balanceSheet':
        return (
          <div className="space-y-6">
            <div className={`${bgColor} p-6 rounded-lg shadow-lg border ${borderColor}`}>
              <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Análisis del Balance</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className={`text-lg font-bold mb-3 ${textColor}`}>Estructura del Balance</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={chartData.balanceData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#444" : "#ccc"} />
                      <XAxis dataKey="name" tick={{ fill: darkMode ? '#eee' : '#333' }} />
                      <YAxis tick={{ fill: darkMode ? '#eee' : '#333' }} />
                      <Tooltip 
                        formatter={(value) => [`${value.toLocaleString('es-ES')} €`, '']}
                        contentStyle={{ backgroundColor: darkMode ? '#333' : '#fff', borderColor: darkMode ? '#555' : '#ccc' }}
                        itemStyle={{ color: darkMode ? '#eee' : '#333' }}
                      />
                      <Legend wrapperStyle={{ color: darkMode ? '#eee' : '#333' }} />
                      <Bar dataKey={previousYear} fill={COLORS[0]} name={`${previousYear}`} />
                      <Bar dataKey={selectedYear} fill={COLORS[1]} name={`${selectedYear}`} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div>
                  <h3 className={`text-lg font-bold mb-3 ${textColor}`}>Composición del Balance ({selectedYear})</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData.balancePieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {chartData.balancePieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value.toLocaleString('es-ES')} €`, '']}
                        contentStyle={{ backgroundColor: darkMode ? '#333' : '#fff', borderColor: darkMode ? '#555' : '#ccc' }}
                        itemStyle={{ color: darkMode ? '#eee' : '#333' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <KpiCard 
                  title="Solidez Patrimonial" 
                  value={formatNumber(currentRatios.solidezPatrimonial, 1, '%')} 
                  trend={getTrend('solidezPatrimonial')} 
                  description="PN / Activo Total" 
                  darkMode={darkMode}
                />
                <KpiCard 
                  title="Solvencia" 
                  value={formatNumber(currentRatios.solvenciaCapacidad, 2)} 
                  trend={getTrend('solvenciaCapacidad')} 
                  description="Activo Total / Pasivo Total" 
                  darkMode={darkMode}
                />
                <KpiCard 
                  title="Apalancamiento" 
                  value={formatNumber(currentRatios.apalancamientoFinanciero, 2)} 
                  trend={getTrend('apalancamientoFinanciero')} 
                  description="Activo Total / PN" 
                  darkMode={darkMode}
                />
                <KpiCard 
                  title="Liquidez" 
                  value={formatNumber(currentRatios.liquidez, 2)} 
                  trend={getTrend('liquidez')} 
                  description="Activo Cte / Pasivo Cte" 
                  darkMode={darkMode}
                />
                <KpiCard 
                  title="Liquidez Inmediata" 
                  value={formatNumber(currentRatios.tesoreriaInmediata, 2)} 
                  trend={getTrend('tesoreriaInmediata')} 
                  description="Disponible / Pasivo Cte" 
                  darkMode={darkMode}
                />
                <KpiCard 
                  title="Fondo de Maniobra" 
                  value={formatNumber(currentRatios.fondoManiobra, 0, ' €')} 
                  trend={getTrend('fondoManiobra')} 
                  description="Act Cte - Pas Cte" 
                  darkMode={darkMode}
                />
              </div>
              
              <div className={`mt-6 p-4 rounded-lg ${highlightBg}`}>
                <h4 className={`font-semibold mb-2 ${textColor}`}>Diagnóstico de la Estructura Patrimonial</h4>
                <p className={subTextColor}>
                  La estructura patrimonial muestra un desequilibrio significativo, con un patrimonio neto que representa 
                  solo el 8.99% del activo total (frente al 10.03% del año anterior). Este bajo nivel de capitalización 
                  implica un elevado apalancamiento financiero (11.12 veces), lo que aumenta el riesgo financiero de la empresa.
                  
                  El fondo de maniobra es negativo (-1,027,674 mil €), lo que indica que parte del activo no corriente está 
                  siendo financiado con pasivo a corto plazo, generando una situación de desequilibrio financiero estructural. 
                  Los ratios de liquidez (0.55) y tesorería inmediata (0.15) están muy por debajo de los niveles recomendados, 
                  sugiriendo potenciales dificultades para atender los pagos a corto plazo.
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'incomeStatement':
        return (
          <div className="space-y-6">
            <div className={`${bgColor} p-6 rounded-lg shadow-lg border ${borderColor}`}>
              <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Análisis de la Cuenta de Resultados</h2>
              
              <div className="mb-6">
                <h3 className={`text-lg font-bold mb-3 ${textColor}`}>Evolución Cuenta de Resultados</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={chartData.incomeData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#444" : "#ccc"} />
                    <XAxis dataKey="name" tick={{ fill: darkMode ? '#eee' : '#333' }} />
                    <YAxis tick={{ fill: darkMode ? '#eee' : '#333' }} />
                    <Tooltip 
                      formatter={(value) => [`${value.toLocaleString('es-ES')} €`, '']}
                      contentStyle={{ backgroundColor: darkMode ? '#333' : '#fff', borderColor: darkMode ? '#555' : '#ccc' }}
                      itemStyle={{ color: darkMode ? '#eee' : '#333' }}
                    />
                    <Legend wrapperStyle={{ color: darkMode ? '#eee' : '#333' }} />
                    <Bar dataKey={previousYear} fill={COLORS[0]} name={`${previousYear}`} />
                    <Bar dataKey={selectedYear} fill={COLORS[1]} name={`${selectedYear}`} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <KpiCard 
                  title="Margen Bruto" 
                  value={formatNumber(currentRatios.margenBruto, 1, '%')} 
                  trend={getTrend('margenBruto')} 
                  description="Margen Bruto / Ventas" 
                  darkMode={darkMode}
                />
                <KpiCard 
                  title="Margen EBIT" 
                  value={formatNumber(currentRatios.margenEbit, 1, '%')} 
                  trend={getTrend('margenEbit')} 
                  description="EBIT / Ventas" 
                  darkMode={darkMode}
                />
                <KpiCard 
                  title="Margen Neto (BAI)" 
                  value={formatNumber(currentRatios.margenBai, 1, '%')} 
                  trend={getTrend('margenBai')} 
                  description="BAI / Ventas" 
                  darkMode={darkMode}
                />
                <KpiCard 
                  title="ROE" 
                  value={formatNumber(currentRatios.roe, 1, '%')} 
                  trend={getTrend('roe')} 
                  description="BAI / PN" 
                  darkMode={darkMode}
                />
                <KpiCard 
                  title="ROA" 
                  value={formatNumber(currentRatios.roa, 1, '%')} 
                  trend={getTrend('roa')} 
                  description="BAI / Activo Total" 
                  darkMode={darkMode}
                />
                <KpiCard 
                  title="Rotación Activos" 
                  value={formatNumber(currentRatios.rotacionActivos, 2)} 
                  trend={getTrend('rotacionActivos')} 
                  description="Ventas / Activo Total" 
                  darkMode={darkMode}
                />
              </div>
              
              <div className={`mt-6 p-4 rounded-lg ${highlightBg}`}>
                <h4 className={`font-semibold mb-2 ${textColor}`}>Análisis DuPont (Descomposición del ROE)</h4>
                <div className="flex flex-wrap gap-2 text-center items-center">
                  <div className={`p-3 bg-blue-900 bg-opacity-40 rounded flex-1 min-w-[100px]`}>
                    <div className="text-xs font-semibold text-blue-300">Margen Neto (BAI)</div>
                    <div className="text-lg font-bold text-blue-100">{formatNumber(currentRatios.margenBai, 2, '%')}</div>
                  </div>
                  <div className="p-3 text-xl font-bold self-center text-gray-400">x</div>
                  <div className={`p-3 bg-green-900 bg-opacity-40 rounded flex-1 min-w-[100px]`}>
                    <div className="text-xs font-semibold text-green-300">Rotación Activos</div>
                    <div className="text-lg font-bold text-green-100">{formatNumber(currentRatios.rotacionActivos, 2)}</div>
                  </div>
                  <div className="p-3 text-xl font-bold self-center text-gray-400">x</div>
                  <div className={`p-3 bg-yellow-900 bg-opacity-40 rounded flex-1 min-w-[100px]`}>
                    <div className="text-xs font-semibold text-yellow-300">Apalancamiento</div>
                    <div className="text-lg font-bold text-yellow-100">{formatNumber(currentRatios.apalancamientoFinanciero, 2)}</div>
                  </div>
                  <div className="p-3 text-xl font-bold self-center text-gray-400">=</div>
                  <div className={`p-3 bg-red-900 bg-opacity-40 rounded flex-1 min-w-[100px]`}>
                    <div className="text-xs font-semibold text-red-300">ROE</div>
                    <div className="text-lg font-bold text-red-100">{formatNumber(currentRatios.roe, 2, '%')}</div>
                  </div>
                </div>
                <p className={`mt-3 ${subTextColor}`}>
                  La alta rentabilidad financiera (57.07%) se debe principalmente al elevado apalancamiento (11.12) 
                  y no a la eficiencia operativa. La empresa opera con márgenes muy ajustados (margen BAI: 2.16%) 
                  y depende de la rotación de activos (2.38) para generar rentabilidad. Esta estructura magnifica 
                  el riesgo, ya que cualquier reducción adicional en los márgenes podría comprometer significativamente 
                  el resultado.
                </p>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className={`${bgColor} p-6 rounded-lg shadow-lg border ${borderColor}`}>
            <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Seleccione una sección</h2>
            <p className={textColor}>Por favor, seleccione una sección del panel lateral para visualizar el análisis correspondiente.</p>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-800'}`}>
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard Financiero Avanzado</h1>
          <div className="flex items-center">
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-blue-800 text-gray-200'}`}
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg flex-shrink-0 overflow-y-auto border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="p-4">
            <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Caso DIA (2016-2017)</h2>
            
            <nav className="space-y-1">
              <button
                onClick={() => setSelectedSection('overview')}
                className={`w-full text-left py-2 px-3 rounded-md flex items-center ${
                  selectedSection === 'overview'
                    ? (darkMode ? 'bg-blue-900 text-white' : 'bg-blue-100 text-blue-800')
                    : (darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Visión General
              </button>
              
              <button
                onClick={() => setSelectedSection('riskAnalysis')}
                className={`w-full text-left py-2 px-3 rounded-md flex items-center ${
                  selectedSection === 'riskAnalysis'
                    ? (darkMode ? 'bg-blue-900 text-white' : 'bg-blue-100 text-blue-800')
                    : (darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Análisis de Riesgos
              </button>
              
              <button
                onClick={() => setSelectedSection('balanceSheet')}
                className={`w-full text-left py-2 px-3 rounded-md flex items-center ${
                  selectedSection === 'balanceSheet'
                    ? (darkMode ? 'bg-blue-900 text-white' : 'bg-blue-100 text-blue-800')
                    : (darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Balance
              </button>
              
              <button
                onClick={() => setSelectedSection('incomeStatement')}
                className={`w-full text-left py-2 px-3 rounded-md flex items-center ${
                  selectedSection === 'incomeStatement'
                    ? (darkMode ? 'bg-blue-900 text-white' : 'bg-blue-100 text-blue-800')
                    : (darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                Cuenta de Resultados
              </button>
            </nav>
            
            <div className={`mt-6 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-sm font-semibold uppercase mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Años Disponibles</h3>
              <div className="space-y-1">
                {Object.keys(financialData).map(year => (
                  <button
                    key={year}
                    className={`w-full text-left py-1 px-3 rounded-md ${
                      selectedYear === parseInt(year)
                        ? (darkMode ? 'bg-blue-900 text-white' : 'bg-blue-100 text-blue-800')
                        : (darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')
                    }`}
                    onClick={() => {
                      if (selectedYear !== parseInt(year)) {
                        setPreviousYear(selectedYear);
                        setSelectedYear(parseInt(year));
                      }
                    }}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>
        
        {/* Main Content Area */}
        <main className={`flex-1 p-6 overflow-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          {renderSection()}
        </main>
      </div>
      
      {/* Footer */}
      <footer className={`p-4 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="container mx-auto text-center text-sm">
          Dashboard de Análisis Financiero Avanzado
        </div>
      </footer>
    </div>
  );
};

export default FinancialDashboard;
