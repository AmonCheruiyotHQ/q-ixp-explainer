import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, CheckCircle, XCircle, Info } from 'lucide-react';

const IXPScoreExplanation = () => {
  const [activeTab, setActiveTab] = useState('buy');
  const [showAllPass, setShowAllPass] = useState(true);
  
  // Generate sample data based on scenario
  const generateSampleData = () => {
    const data = [];
    const bufferSize = 36; // 3 minutes with 5-second intervals
    
    for (let i = 0; i < bufferSize; i++) {
      let ixp15m, ixp1h;
      
      if (activeTab === 'buy') {
        if (showAllPass) {
          // All pass scenario: 15m consistently above 1h
          ixp15m = 65 + Math.random() * 8;
          ixp1h = 55 + Math.random() * 5;
        } else {
          // Some fail scenario: occasionally 15m drops below 1h
          ixp15m = 60 + Math.random() * 10;
          ixp1h = 55 + Math.random() * 8;
          if (i % 8 === 0) ixp15m = 52 + Math.random() * 3; // Make some fail
        }
      } else {
        if (showAllPass) {
          // All pass scenario: 15m consistently below 1h
          ixp15m = 45 + Math.random() * 5;
          ixp1h = 55 + Math.random() * 8;
        } else {
          // Some fail scenario: occasionally 15m goes above 1h
          ixp15m = 50 + Math.random() * 10;
          ixp1h = 55 + Math.random() * 5;
          if (i % 8 === 0) ixp15m = 58 + Math.random() * 3; // Make some fail
        }
      }
      
      data.push({
        reading: i + 1,
        '15m_ixp': ixp15m,
        '1h_ixp': ixp1h,
        comparison: activeTab === 'buy' ? (ixp15m > ixp1h ? 1 : -1) : (ixp15m < ixp1h ? 1 : -1)
      });
    }
    return data;
  };

  const [chartData, setChartData] = useState(generateSampleData());

  // Recalculate when tab or scenario changes
  React.useEffect(() => {
    setChartData(generateSampleData());
  }, [activeTab, showAllPass]);

  // Calculate score based on data
  const calculateScore = () => {
    const sum = chartData.reduce((acc, item) => acc + item.comparison, 0);
    const allPass = Math.abs(sum) === chartData.length;
    return allPass ? 5.0 : 0.5;
  };

  const score = calculateScore();
  const passCount = chartData.filter(d => d.comparison === 1).length;
  const failCount = chartData.filter(d => d.comparison === -1).length;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl shadow-2xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-3">IXP Score Calculation</h1>
        <p className="text-lg text-slate-600">Understanding how we compare 15-minute and 1-hour IXP values</p>
      </div>

      {/* Trade Type Selection */}
      <div className="flex gap-4 mb-6 justify-center">
        <button
          onClick={() => setActiveTab('buy')}
          className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-md ${
            activeTab === 'buy'
              ? 'bg-green-500 text-white scale-105'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp size={24} />
          BUY Signal
        </button>
        <button
          onClick={() => setActiveTab('sell')}
          className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-md ${
            activeTab === 'sell'
              ? 'bg-red-500 text-white scale-105'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingDown size={24} />
          SELL Signal
        </button>
      </div>

      {/* Scenario Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-white rounded-xl p-4 shadow-md">
          <label className="flex items-center gap-3 cursor-pointer">
            <span className="font-semibold text-slate-700">Show Scenario:</span>
            <select 
              value={showAllPass ? 'pass' : 'fail'} 
              onChange={(e) => setShowAllPass(e.target.value === 'pass')}
              className="px-4 py-2 border-2 border-slate-300 rounded-lg font-semibold"
            >
              <option value="pass">All Pass (Score 5.0)</option>
              <option value="fail">Some Fail (Score 0.5)</option>
            </select>
          </label>
        </div>
      </div>

      {/* Step 1: Data Collection */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-lg border-l-4 border-blue-500">
        <div className="flex items-start gap-3 mb-4">
          <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">1</div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Data Collection Setup</h2>
            <p className="text-slate-600 mb-4">Every 5 seconds, we record IXP values from both timeframes</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg border-2 border-blue-200">
            <div className="text-sm text-blue-700 font-semibold mb-1">Time Window</div>
            <div className="text-3xl font-bold text-blue-800">3 minutes</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-lg border-2 border-purple-200">
            <div className="text-sm text-purple-700 font-semibold mb-1">Interval</div>
            <div className="text-3xl font-bold text-purple-800">5 seconds</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 rounded-lg border-2 border-indigo-200">
            <div className="text-sm text-indigo-700 font-semibold mb-1">Total Readings</div>
            <div className="text-3xl font-bold text-indigo-800">36 values</div>
          </div>
        </div>
      </div>

      {/* Step 2: Comparison Logic */}
      <div className={`rounded-xl p-6 mb-6 shadow-lg border-l-4 ${
        activeTab === 'buy' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <div className={`${activeTab === 'buy' ? 'bg-green-500' : 'bg-red-500'} text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0`}>2</div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {activeTab === 'buy' ? 'BUY' : 'SELL'} Signal - Comparison Logic
            </h2>
            <p className="text-slate-600">For each of the 36 readings, we compare the two IXP values</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-inner">
          <div className="mb-4">
            <div className="font-bold text-slate-700 mb-3 text-lg">Condition Checked:</div>
            <div className={`text-2xl font-mono font-bold p-4 rounded-lg ${
              activeTab === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {activeTab === 'buy' ? '15m IXP > 1h IXP' : '15m IXP < 1h IXP'}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg border-2 border-green-300">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-green-600" size={24} />
                <span className="font-bold text-green-800">Condition TRUE</span>
              </div>
              <div className="text-3xl font-bold text-green-600">Record: +1</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-lg border-2 border-red-300">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="text-red-600" size={24} />
                <span className="font-bold text-red-800">Condition FALSE</span>
              </div>
              <div className="text-3xl font-bold text-red-600">Record: -1</div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Visual Chart */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-lg border-l-4 border-purple-500">
        <div className="flex items-start gap-3 mb-4">
          <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">3</div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Visual Comparison</h2>
            <p className="text-slate-600">Watch how the 15m IXP compares to 1h IXP over all 36 readings</p>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="reading" 
              label={{ value: 'Reading Number (1-36)', position: 'insideBottom', offset: -5 }}
              stroke="#64748b"
            />
            <YAxis 
              label={{ value: 'IXP Value', angle: -90, position: 'insideLeft' }}
              stroke="#64748b"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '2px solid #cbd5e1',
                borderRadius: '8px',
                padding: '12px'
              }}
              formatter={(value, name) => [
                typeof value === 'number' ? value.toFixed(1) : value,
                name === '15m_ixp' ? '15-min IXP' : name === '1h_ixp' ? '1-hour IXP' : name
              ]}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Line 
              type="monotone" 
              dataKey="15m_ixp" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              name="15-minute IXP"
              dot={{ fill: '#8b5cf6', r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="1h_ixp" 
              stroke="#f59e0b" 
              strokeWidth={3}
              name="1-hour IXP"
              dot={{ fill: '#f59e0b', r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Comparison Results Summary */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="text-green-600" size={20} />
              <span className="font-semibold text-green-800">Passed (+1)</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{passCount} / 36</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="text-red-600" size={20} />
              <span className="font-semibold text-red-800">Failed (-1)</span>
            </div>
            <div className="text-3xl font-bold text-red-600">{failCount} / 36</div>
          </div>
        </div>
      </div>

      {/* Step 4: Final Score Calculation */}
      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 shadow-lg border-l-4 border-indigo-500">
        <div className="flex items-start gap-3 mb-4">
          <div className="bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">4</div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Final Score Calculation</h2>
            <p className="text-slate-600">The score depends on whether ALL readings passed</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-inner">
          <div className="mb-6">
            <div className="text-center mb-4">
              <div className="text-sm font-semibold text-slate-600 mb-2">SUM OF ALL COMPARISONS</div>
              <div className="text-5xl font-bold text-indigo-600">
                {chartData.reduce((acc, item) => acc + item.comparison, 0)}
              </div>
            </div>
          </div>

          <div className="border-t-2 border-slate-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold text-slate-700">Scoring Rule:</div>
              <Info className="text-slate-400" size={20} />
            </div>
            
            <div className="space-y-3">
              <div className={`p-4 rounded-lg border-2 ${
                score === 5.0 ? 'bg-green-100 border-green-400' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-mono text-sm text-slate-600">IF sum = {activeTab === 'buy' ? '+36' : '-36'}</div>
                    <div className="font-bold text-green-700">(All 36 readings passed)</div>
                  </div>
                  <div className="text-3xl font-bold text-green-600">Score = 5.0</div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border-2 ${
                score === 0.5 ? 'bg-orange-100 border-orange-400' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-mono text-sm text-slate-600">IF sum ≠ {activeTab === 'buy' ? '+36' : '-36'}</div>
                    <div className="font-bold text-orange-700">(Any reading failed)</div>
                  </div>
                  <div className="text-3xl font-bold text-orange-600">Score = 0.5</div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Score Display */}
          <div className={`mt-6 p-6 rounded-xl text-center ${
            score === 5.0 ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-orange-500 to-orange-600'
          } text-white shadow-lg`}>
            <div className="text-sm font-semibold mb-2 opacity-90">CURRENT IXP SCORE</div>
            <div className="text-6xl font-bold">{score.toFixed(1)}</div>
            <div className="text-sm mt-2 opacity-90">
              {score === 5.0 ? '✓ Excellent! All comparisons passed' : '✗ Weak signal - some comparisons failed'}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Box */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mt-6">
        <div className="flex items-start gap-3">
          <Info className="text-blue-600 flex-shrink-0 mt-1" size={24} />
          <div>
            <h3 className="font-bold text-blue-900 mb-2">Key Takeaways:</h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>The IXP score is <strong>all-or-nothing</strong>: Either 5.0 (perfect) or 0.5 (weak)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>For a BUY signal to score 5.0, the 15m IXP must be above 1h IXP for <strong>all 36 readings</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>For a SELL signal to score 5.0, the 15m IXP must be below 1h IXP for <strong>all 36 readings</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Even <strong>one single failed comparison</strong> drops the score to 0.5</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IXPScoreExplanation;