import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Save } from "lucide-react";
import { toast } from "sonner";

const questions = [
  {
    id: 1,
    question: "Will this capability materially differentiate us in the market? (Is this our competitive edge?)",
    defaultWeight: 25,
    scoringLogic: "5=Core differentiator | 1=Commodity function"
  },
  {
    id: 2,
    question: "Can we afford to wait 12+ months to get this capability live? (Time flexibility)",
    defaultWeight: 20,
    scoringLogic: "5=Can wait, iterate slowly | 1=Need within 3-6 months"
  },
  {
    id: 3,
    question: "Are our requirements highly unique vs. standard industry practice?",
    defaultWeight: 20,
    scoringLogic: "5=Completely custom | 1=80%+ standard fit"
  },
  {
    id: 4,
    question: "Do we have the team/capability to build AND operate this long-term?",
    defaultWeight: 15,
    scoringLogic: "5=Strong capability | 1=Large capability gap"
  },
  {
    id: 5,
    question: "Is 3-year TCO lower if we build (considering all costs)?",
    defaultWeight: 12,
    scoringLogic: "5=Much cheaper to build | 1=Vendor clearly cheaper"
  },
  {
    id: 6,
    question: "Is the vendor market immature or unproven for this specific problem?",
    defaultWeight: 8,
    scoringLogic: "5=No good vendors exist | 1=Many proven vendors"
  }
];

export default function ExecutiveDecisionTool() {
  const [scores, setScores] = useState({});
  const [weights, setWeights] = useState(
    questions.reduce((acc, q) => ({ ...acc, [q.id]: q.defaultWeight }), {})
  );
  const [assessmentName, setAssessmentName] = useState('');
  const [showHybridApproaches, setShowHybridApproaches] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        return await base44.auth.me();
      } catch (error) {
        return null;
      }
    }
  });

  useEffect(() => {
    if (!user) {
      base44.auth.redirectToLogin();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Please sign in to access this tool</h2>
          <p className="text-slate-600 mb-6">You need to be logged in to use the Executive Decision Tool</p>
        </div>
      </div>
    );
  }

  const handleScoreChange = (id, value) => {
    const numValue = parseFloat(value);
    if (value === '' || (numValue >= 1 && numValue <= 5)) {
      setScores({ ...scores, [id]: value === '' ? '' : numValue });
    }
  };

  const handleWeightChange = (id, value) => {
    const numValue = parseFloat(value);
    if (value === '' || (numValue >= 0 && numValue <= 100)) {
      setWeights({ ...weights, [id]: value === '' ? '' : numValue });
    }
  };

  const calculateWeightedScore = (id) => {
    const score = scores[id] || 0;
    const weight = weights[id] || 0;
    return (score * weight / 100).toFixed(2);
  };

  const totalWeight = Object.values(weights).reduce((sum, w) => sum + (parseFloat(w) || 0), 0);
  const totalWeightedScore = questions.reduce((sum, q) => {
    return sum + parseFloat(calculateWeightedScore(q.id));
  }, 0).toFixed(2);

  const getDecision = () => {
    const score = parseFloat(totalWeightedScore);
    if (score >= 4.0) {
      return {
        title: "Strong BUILD",
        subtitle: "Clear strategic & economic case",
        color: "bg-green-50 border-green-200 text-green-900"
      };
    } else if (score >= 3.3) {
      return {
        title: "Lean BUILD",
        subtitle: "Consider hybrid or phased approach",
        color: "bg-blue-50 border-blue-200 text-blue-900"
      };
    } else if (score >= 2.7) {
      return {
        title: "Lean BUY",
        subtitle: "But evaluate build for key differentiators",
        color: "bg-orange-50 border-orange-200 text-orange-900"
      };
    } else if (score >= 1.0) {
      return {
        title: "Strong BUY",
        subtitle: "Focus resources on actual competitive advantage",
        color: "bg-red-50 border-red-200 text-red-900"
      };
    }
    return {
      title: "Incomplete",
      subtitle: "Please complete all scores",
      color: "bg-slate-50 border-slate-200 text-slate-600"
    };
  };

  const decision = getDecision();
  const score = parseFloat(totalWeightedScore);
  const shouldShowHybridBanner = score >= 2.7 && score <= 3.9;

  const handleSave = async () => {
    if (!user) return;
    
    if (!assessmentName.trim()) {
      toast.error('Please enter an assessment name');
      return;
    }

    setIsSaving(true);
    try {
      await base44.entities.ExecutiveDecision.create({
        user_email: user.email,
        assessment_name: assessmentName,
        scores,
        weights,
        total_score: parseFloat(totalWeightedScore),
        decision: decision.title
      });
      toast.success('Assessment saved successfully');
    } catch (error) {
      toast.error('Failed to save assessment');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <Link to={createPageUrl('BuildVSBuyMatrix')}>
            <Button variant="ghost" className="mb-6">
              ← Back to Build vs Buy Matrix
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-slate-900 mb-3">
                Executive Decision Tool
              </h1>
              <p className="text-lg text-slate-600">
                Answer each question below. Score 1-5 where 5 = Strongly BUILD, 1 = Strongly BUY, 3 = Neutral
              </p>
            </div>
            <Button
              onClick={handleSave}
              disabled={!user || isSaving}
              className={`flex items-center gap-2 ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Assessment'}
            </Button>
          </div>
          
          <div className="max-w-md">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Assessment Name
            </label>
            <Input
              type="text"
              placeholder="e.g., CRM System Evaluation"
              value={assessmentName}
              onChange={(e) => setAssessmentName(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Decision Box */}
        <div className={`mb-8 p-6 rounded-lg border-2 ${decision.color}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium opacity-70 mb-1">DECISION</div>
              <div className="text-3xl font-bold">{decision.title}</div>
              <div className="text-lg mt-1">{decision.subtitle}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium opacity-70 mb-1">Total Score</div>
              <div className="text-5xl font-bold">{totalWeightedScore}</div>
              <div className="text-sm mt-1">out of 5.0</div>
            </div>
          </div>
        </div>

        {/* Hybrid Approaches Banner */}
        {shouldShowHybridBanner && (
          <div className="mb-8">
            <button
              onClick={() => setShowHybridApproaches(!showHybridApproaches)}
              className="w-full bg-blue-50 border-2 border-blue-200 rounded-lg p-4 flex items-center justify-between hover:bg-blue-100 transition-colors"
            >
              <span className="text-blue-900 font-semibold">Explore hybrid approaches</span>
              {showHybridApproaches ? (
                <ChevronUp className="h-5 w-5 text-blue-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-blue-600" />
              )}
            </button>
            
            {showHybridApproaches && (
              <div className="mt-4 bg-white border border-blue-200 rounded-lg p-6">
                <p className="text-slate-700 mb-4 font-medium">
                  Sometimes the answer is neither pure build nor pure buy:
                </p>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="border border-slate-200 p-3 text-left font-semibold text-slate-900">Scenario</th>
                        <th className="border border-slate-200 p-3 text-left font-semibold text-slate-900">Approach</th>
                        <th className="border border-slate-200 p-3 text-left font-semibold text-slate-900">When to Use</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-200 p-3 font-medium text-slate-900">Buy then Build</td>
                        <td className="border border-slate-200 p-3 text-slate-700">Start with vendor, migrate later</td>
                        <td className="border border-slate-200 p-3 text-slate-700">
                          <ul className="list-disc list-inside space-y-1">
                            <li>Need fast launch</li>
                            <li>Building capability over time</li>
                            <li>Validating market first</li>
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-slate-200 p-3 font-medium text-slate-900">Build on Top</td>
                        <td className="border border-slate-200 p-3 text-slate-700">Use vendor infrastructure, build custom layer</td>
                        <td className="border border-slate-200 p-3 text-slate-700">
                          <ul className="list-disc list-inside space-y-1">
                            <li>Need customization</li>
                            <li>Vendor has strong foundation</li>
                            <li>Integration is clean</li>
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-slate-200 p-3 font-medium text-slate-900">Open Source + Build</td>
                        <td className="border border-slate-200 p-3 text-slate-700">Fork/extend OSS with internal dev</td>
                        <td className="border border-slate-200 p-3 text-slate-700">
                          <ul className="list-disc list-inside space-y-1">
                            <li>Community momentum</li>
                            <li>Customization needed</li>
                            <li>Technical team exists</li>
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-slate-200 p-3 font-medium text-slate-900">Co-development</td>
                        <td className="border border-slate-200 p-3 text-slate-700">Partner with vendor for custom features</td>
                        <td className="border border-slate-200 p-3 text-slate-700">
                          <ul className="list-disc list-inside space-y-1">
                            <li>Specific needs</li>
                            <li>Vendor is flexible</li>
                            <li>Shared strategic value</li>
                            <li>Clear boundaries</li>
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-slate-200 p-3 font-medium text-slate-900">Modular Approach</td>
                        <td className="border border-slate-200 p-3 text-slate-700">Build core, buy peripherals</td>
                        <td className="border border-slate-200 p-3 text-slate-700">
                          <ul className="list-disc list-inside space-y-1">
                            <li>Some pieces are commodity</li>
                            <li>Want control of key components</li>
                          </ul>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Questions Table */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b-2 border-slate-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-sm text-slate-900 w-12">#</th>
                  <th className="text-left p-4 font-semibold text-sm text-slate-900">Question</th>
                  <th className="text-left p-4 font-semibold text-sm text-slate-900 w-32">Your Score (1-5)</th>
                  <th className="text-left p-4 font-semibold text-sm text-slate-900 w-24">Weight (%)</th>
                  <th className="text-left p-4 font-semibold text-sm text-slate-900 w-32">Weighted Score</th>
                  <th className="text-left p-4 font-semibold text-sm text-slate-900 w-64">Scoring Logic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {questions.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-sm font-medium text-slate-900">{q.id}</td>
                    <td className="p-4 text-sm text-slate-700">{q.question}</td>
                    <td className="p-4">
                      <Input
                        type="number"
                        min="1"
                        max="5"
                        step="0.1"
                        value={scores[q.id] || ''}
                        onChange={(e) => handleScoreChange(q.id, e.target.value)}
                        className="w-full bg-yellow-50 border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
                        placeholder="1-5"
                      />
                    </td>
                    <td className="p-4">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        value={weights[q.id] || ''}
                        onChange={(e) => handleWeightChange(q.id, e.target.value)}
                        className="w-full"
                      />
                    </td>
                    <td className="p-4 text-sm font-semibold text-slate-900">
                      {calculateWeightedScore(q.id)}
                    </td>
                    <td className="p-4 text-xs text-slate-600 italic">
                      {q.scoringLogic}
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-50 font-semibold">
                  <td className="p-4 text-sm text-slate-900" colSpan="3">TOTAL</td>
                  <td className="p-4 text-sm text-slate-900">
                    {totalWeight.toFixed(0)}%
                  </td>
                  <td className="p-4 text-sm text-slate-900">
                    {totalWeightedScore}
                  </td>
                  <td className="p-4"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Score Interpretation */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Score Interpretation:</h3>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span><strong>4.0 - 5.0:</strong> Strong BUILD - Clear strategic & economic case</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-semibold">•</span>
              <span><strong>3.3 - 3.9:</strong> Lean BUILD - Consider hybrid or phased approach</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 font-semibold">•</span>
              <span><strong>2.7 - 3.2:</strong> Lean BUY - But evaluate build for key differentiators</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 font-semibold">•</span>
              <span><strong>1.0 - 2.6:</strong> Strong BUY - Focus resources on actual competitive advantage</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}