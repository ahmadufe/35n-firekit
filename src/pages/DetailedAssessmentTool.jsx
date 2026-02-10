import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Save, ChevronDown, ChevronUp, Lock } from "lucide-react";
import { toast } from "sonner";
import AccessCodeDialog from "@/components/AccessCodeDialog";

const sections = [
  {
    id: 1,
    title: "STRATEGIC DIFFERENTIATION",
    weight: 22.0,
    questions: [
      {
        id: 1,
        question: "Will this capability materially differentiate us in the market within 12-24 months?",
        weight: 5.5,
        scoringLogic: "5=Core differentiator | 1=Commodity"
      },
      {
        id: 2,
        question: "Would vendor parity with competitors be strategically unacceptable?",
        weight: 5.5,
        scoringLogic: "5=Core differentiator | 1=Commodity"
      },
      {
        id: 3,
        question: "Is this capability core to how we create value (not just support operations)?",
        weight: 5.5,
        scoringLogic: "5=Core differentiator | 1=Commodity"
      },
      {
        id: 4,
        question: "Do we expect to keep evolving this capability for 3-5 years?",
        weight: 5.5,
        scoringLogic: "5=Core differentiator | 1=Commodity"
      }
    ]
  },
  {
    id: 2,
    title: "SPEED & URGENCY",
    weight: 10.0,
    questions: [
      {
        id: 5,
        question: "Can we afford to wait 12+ months to get this capability live?",
        weight: 2.5,
        scoringLogic: "5=Can wait/iterate | 1=Need fast delivery"
      },
      {
        id: 6,
        question: "Is perfect fit more important than speed to market?",
        weight: 2.5,
        scoringLogic: "5=Can wait/iterate | 1=Need fast delivery"
      },
      {
        id: 7,
        question: "Can we tolerate iterative delivery with learning cycles and potential delays?",
        weight: 2.5,
        scoringLogic: "5=Can wait/iterate | 1=Need fast delivery"
      },
      {
        id: 8,
        question: "Do we have time to build without losing market opportunity?",
        weight: 2.5,
        scoringLogic: "5=Can wait/iterate | 1=Need fast delivery"
      }
    ]
  },
  {
    id: 3,
    title: "REQUIREMENT UNIQUENESS & WORKFLOW DEPTH",
    weight: 13.0,
    questions: [
      {
        id: 9,
        question: "Are our workflows materially different from standard industry practice?",
        weight: 3.25,
        scoringLogic: "5=Highly unique/complex | 1=Standard workflows"
      },
      {
        id: 10,
        question: "Do we need complex approval chains/rules/orchestration unique to us?",
        weight: 3.25,
        scoringLogic: "5=Highly unique/complex | 1=Standard workflows"
      },
      {
        id: 11,
        question: "Will the process change frequently over the next 12-24 months?",
        weight: 3.25,
        scoringLogic: "5=Highly unique/complex | 1=Standard workflows"
      },
      {
        id: 12,
        question: "Are vendor standard workflows incompatible with our business needs?",
        weight: 3.25,
        scoringLogic: "5=Highly unique/complex | 1=Standard workflows"
      }
    ]
  },
  {
    id: 4,
    title: "INTEGRATION & ARCHITECTURE REALITY",
    weight: 9.0,
    questions: [
      {
        id: 13,
        question: "Does this require deep integration with multiple legacy systems?",
        weight: 3.0,
        scoringLogic: "5=Complex custom integration | 1=Simple connectors work"
      },
      {
        id: 14,
        question: "Do we need custom data models/transformations that vendors won't support cleanly?",
        weight: 3.0,
        scoringLogic: "5=Complex custom integration | 1=Simple connectors work"
      },
      {
        id: 15,
        question: "Are \"standard connectors\" unlikely to be enough?",
        weight: 3.0,
        scoringLogic: "5=Complex custom integration | 1=Simple connectors work"
      }
    ]
  },
  {
    id: 5,
    title: "COMPLIANCE, RISK & CONTROL",
    weight: 9.0,
    questions: [
      {
        id: 16,
        question: "Are there regulatory/data residency/security requirements that vendors struggle to meet?",
        weight: 2.25,
        scoringLogic: "5=High compliance/control needs | 1=Standard OK"
      },
      {
        id: 17,
        question: "Would we need audit-level transparency/control that vendors won't provide?",
        weight: 2.25,
        scoringLogic: "5=High compliance/control needs | 1=Standard OK"
      },
      {
        id: 18,
        question: "Is vendor lock-in a major strategic risk here?",
        weight: 2.25,
        scoringLogic: "5=High compliance/control needs | 1=Standard OK"
      },
      {
        id: 19,
        question: "Is the financial/operational cost of choosing wrong extremely high?",
        weight: 2.25,
        scoringLogic: "5=High compliance/control needs | 1=Standard OK"
      }
    ]
  },
  {
    id: 6,
    title: "ECONOMICS & TCO",
    weight: 11.0,
    questions: [
      {
        id: 20,
        question: "At our scale, would building likely be cheaper over 3 years (including run + change)?",
        weight: 3.7,
        scoringLogic: "5=Much cheaper to build | 1=Vendor clearly cheaper"
      },
      {
        id: 21,
        question: "Would vendor pricing scale painfully with usage/users/transactions?",
        weight: 3.7,
        scoringLogic: "5=Much cheaper to build | 1=Vendor clearly cheaper"
      },
      {
        id: 22,
        question: "Would internal build meaningfully reduce marginal cost at scale?",
        weight: 3.7,
        scoringLogic: "5=Much cheaper to build | 1=Vendor clearly cheaper"
      }
    ]
  },
  {
    id: 7,
    title: "DELIVERY READINESS & CAPABILITY",
    weight: 12.0,
    questions: [
      {
        id: 23,
        question: "Do we have a strong product owner with authority and time?",
        weight: 2.4,
        scoringLogic: "5=Strong capability & governance | 1=Weak/missing"
      },
      {
        id: 24,
        question: "Do we have (or can realistically secure) the engineering/architecture/security capacity?",
        weight: 2.4,
        scoringLogic: "5=Strong capability & governance | 1=Weak/missing"
      },
      {
        id: 25,
        question: "Can we hire and retain top talent in this domain?",
        weight: 2.4,
        scoringLogic: "5=Strong capability & governance | 1=Weak/missing"
      },
      {
        id: 26,
        question: "Can we run this long-term (support, patches, monitoring, upgrades)?",
        weight: 2.4,
        scoringLogic: "5=Strong capability & governance | 1=Weak/missing"
      },
      {
        id: 27,
        question: "Do we have governance to deliver predictably (prioritization, change control, QA, release)?",
        weight: 2.4,
        scoringLogic: "5=Strong capability & governance | 1=Weak/missing"
      }
    ]
  },
  {
    id: 8,
    title: "INNOVATION VELOCITY & EVOLUTION",
    weight: 6.0,
    questions: [
      {
        id: 28,
        question: "Will this capability require continuous innovation/evolution over next 3+ years?",
        weight: 2.0,
        scoringLogic: "5=High innovation needs | 1=Stable/commodity"
      },
      {
        id: 29,
        question: "Will vendors fall behind our innovation trajectory in this domain?",
        weight: 2.0,
        scoringLogic: "5=High innovation needs | 1=Stable/commodity"
      },
      {
        id: 30,
        question: "Do we need cutting-edge capabilities that vendors don't offer yet?",
        weight: 2.0,
        scoringLogic: "5=High innovation needs | 1=Stable/commodity"
      }
    ]
  },
  {
    id: 9,
    title: "PLATFORM & REUSE POTENTIAL",
    weight: 4.0,
    questions: [
      {
        id: 31,
        question: "Can this be reused across multiple business lines/regions?",
        weight: 2.0,
        scoringLogic: "5=High reuse potential | 1=Single use case"
      },
      {
        id: 32,
        question: "Could it become a foundational platform capability (not a one-off project)?",
        weight: 2.0,
        scoringLogic: "5=High reuse potential | 1=Single use case"
      }
    ]
  },
  {
    id: 10,
    title: "VENDOR MATURITY & AVAILABILITY",
    weight: 4.0,
    questions: [
      {
        id: 33,
        question: "Is the vendor market immature or unproven for this specific problem?",
        weight: 1.3,
        scoringLogic: "5=No good vendors/high vendor risk | 1=Proven vendors"
      },
      {
        id: 34,
        question: "Do our requirements exceed what vendors can deliver (even with customization)?",
        weight: 1.3,
        scoringLogic: "5=No good vendors/high vendor risk | 1=Proven vendors"
      },
      {
        id: 35,
        question: "Does building carry lower delivery risk than buying from vendors?",
        weight: 1.3,
        scoringLogic: "5=No good vendors/high vendor risk | 1=Proven vendors"
      }
    ]
  }
];

const defaultWeights = {};
sections.forEach(section => {
  section.questions.forEach(q => {
    defaultWeights[q.id] = q.weight;
  });
});

export default function DetailedAssessmentTool() {
  const urlParams = new URLSearchParams(window.location.search);
  const assessmentId = urlParams.get('id');
  
  const [scores, setScores] = useState({});
  const [weights, setWeights] = useState(defaultWeights);
  const [assessmentName, setAssessmentName] = useState('');
  const [showHybridApproaches, setShowHybridApproaches] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

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

  const { data: savedAssessment } = useQuery({
    queryKey: ['detailedAssessment', assessmentId],
    queryFn: async () => {
      if (!assessmentId) return null;
      const assessments = await base44.entities.DetailedAssessment.filter({ id: assessmentId });
      return assessments[0] || null;
    },
    enabled: !!assessmentId
  });

  useEffect(() => {
    // Check if user has access via login or access code
    const hasAccessCode = sessionStorage.getItem('access_code_tool_1770624688365');
    if (user || hasAccessCode) {
      setHasAccess(true);
    } else {
      setShowAccessDialog(true);
    }
  }, [user]);

  useEffect(() => {
    if (savedAssessment) {
      setScores(savedAssessment.scores || {});
      setWeights(savedAssessment.weights || defaultWeights);
      setAssessmentName(savedAssessment.assessment_name || '');
    }
  }, [savedAssessment]);

  if (!hasAccess) {
    return (
      <>
        <AccessCodeDialog
          open={showAccessDialog}
          onOpenChange={(open) => {
            setShowAccessDialog(open);
            if (!open) {
              // Check again if access was granted
              const hasAccessCode = sessionStorage.getItem('access_code_tool_1770624688365');
              if (hasAccessCode) {
                setHasAccess(true);
              }
            }
          }}
          resource={{
            id: "tool_1770624688365",
            title: "Build VS Buy Decision Matrix",
            page: "DetailedAssessmentTool"
          }}
        />
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
          <div className="max-w-md text-center">
            <Lock className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Access Required</h2>
            <p className="text-slate-600 mb-6">Please sign in or enter an access code to use this tool.</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => base44.auth.redirectToLogin()}>
                Sign in
              </Button>
              <Button variant="outline" onClick={() => setShowAccessDialog(true)}>
                Enter Access Code
              </Button>
            </div>
          </div>
        </div>
      </>
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

  const resetWeights = () => {
    setWeights(defaultWeights);
  };

  const calculateWeightedScore = (id) => {
    const score = scores[id] || 0;
    const weight = weights[id] || 0;
    return ((score * weight) / 100).toFixed(2);
  };

  const getSectionTotal = (section) => {
    return section.questions.reduce((sum, q) => {
      return sum + (parseFloat(weights[q.id]) || 0);
    }, 0);
  };

  const allQuestions = sections.flatMap(section => section.questions);
  
  const totalWeight = allQuestions.reduce((sum, q) => {
    return sum + (parseFloat(weights[q.id]) || 0);
  }, 0);

  const totalWeightedScore = allQuestions.reduce((sum, q) => {
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
      if (assessmentId) {
        // Update existing assessment
        await base44.entities.DetailedAssessment.update(assessmentId, {
          assessment_name: assessmentName,
          scores,
          weights,
          total_score: parseFloat(totalWeightedScore),
          decision: decision.title
        });
      } else {
        // Create new assessment
        await base44.entities.DetailedAssessment.create({
          user_email: user.email,
          assessment_name: assessmentName,
          scores,
          weights,
          total_score: parseFloat(totalWeightedScore),
          decision: decision.title
        });
      }
      toast.success('The assessment has been saved. You can access it from the saved assessment table on the tool\'s main page.');
    } catch (error) {
      toast.error('Failed to save assessment');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link to={createPageUrl('BuildVSBuyMatrix')}>
            <Button variant="ghost">
              ← Back to Build vs Buy Matrix
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-slate-900 mb-3">
                Detailed Assessment Tool
              </h1>
              <p className="text-lg text-slate-600">
                Answer each question. Score 1-5 where 5 = Strongly BUILD, 1 = Strongly BUY, 3 = Neutral
              </p>
            </div>
            {user ? (
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Assessment'}
              </Button>
            ) : (
              <div className="text-right">
                <div className="text-sm text-slate-500 mb-1">Sign in to save assessments</div>
                <Button variant="outline" onClick={() => base44.auth.redirectToLogin()}>
                  Sign in
                </Button>
              </div>
            )}
          </div>
          
          {user && (
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
          )}
        </div>

        {/* Weight Warning */}
        {Math.abs(totalWeight - 100) > 0.01 && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
            <p className="text-red-700 font-semibold text-center">
              Attention: Weights don't add up to 100%. Please adjust (Current total: {totalWeight.toFixed(1)}%)
            </p>
          </div>
        )}

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

        {/* Reset Weights Button */}
        <div className="mb-4 flex justify-end">
          <Button onClick={resetWeights} variant="outline">
            Reset Weights
          </Button>
        </div>

        {/* Questions Table by Section */}
        <div className="space-y-8">
          {sections.map((section) => {
            const sectionTotal = getSectionTotal(section);
            return (
              <div key={section.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    {section.id}) {section.title}
                  </h2>
                  <div className="text-sm font-medium">
                    Section Total: {sectionTotal.toFixed(1)}%
                  </div>
                </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
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
                    {section.questions.map((q) => (
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
                            step="0.1"
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
                  </tbody>
                </table>
              </div>
            </div>
            );
          })}
        </div>

        {/* Total Summary */}
        <div className="mt-8 bg-slate-900 text-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-semibold">TOTAL WEIGHTED SCORE</div>
              <div className="text-sm opacity-70 mt-1">Total Weight: {totalWeight.toFixed(1)}%</div>
            </div>
            <div className="text-3xl font-bold">{totalWeightedScore} / 5.0</div>
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