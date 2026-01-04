import React, { useState, useEffect } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Loader2, AlertTriangle, Eye, Clock, CheckCircle2, XCircle, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import ScoreSelector from "@/components/ScoreSelector";
import ResultDialog from "@/components/ResultDialog";

const SCORECARD_SECTIONS = [
  {
    id: 'real_user_reality',
    title: '1. Real User Reality',
    critical: true,
    passScore: 6,
    questions: [
      'Designed for distracted, rushed users (not ideal users)',
      'Core flow works with partial attention',
      'Does not assume motivation, patience, or learning',
      'Validated against real behavior, not opinions or assumptions on customer behaviour'
    ]
  },
  {
    id: 'moment_context_clarity',
    title: '2. Moment and Context Clarity',
    critical: true,
    passScore: 6,
    questions: [
      'Primary user moment is clearly defined',
      'Real decision points and friction points identified',
      'Effort reduced at peak friction (not on the margins)',
      'No feature without a clear moment attached'
    ]
  },
  {
    id: 'first_value_experience',
    title: '3. First Value Experience',
    critical: true,
    passScore: 5,
    questions: [
      'Time-to-value measured in minutes, not sessions',
      'First success possible without instructions',
      'Onboarding is simple, and gets customer to their target'
    ]
  },
  {
    id: 'effort_cognitive_load',
    title: '4. Effort and Cognitive Load',
    critical: false,
    passScore: 6,
    questions: [
      'Every step justifies its existence',
      'Choices reduced where users do not want to decide',
      'Internal complexity is hidden (users see outcomes)',
      'Next action is always obvious'
    ]
  },
  {
    id: 'transitions_flow_integrity',
    title: '5. Transitions and Flow Integrity',
    critical: true,
    passScore: 7,
    questions: [
      'Transitions between steps are intentional and clear',
      'System feedback matches user expectations',
      'Errors explain what happened and what to do next',
      'Progress is visible from Started to Completed'
    ]
  },
  {
    id: 'momentum_habit_dependence',
    title: '6. Momentum vs Habit Dependence',
    critical: false,
    passScore: 5,
    questions: [
      'Users feel progress early (even with partial completion)',
      'Continued use feels easier than first use',
      'Product does not rely on discipline, reminders, or habit change'
    ]
  },
  {
    id: 'failure_edge_cases_recovery',
    title: '7. Failure, Edge Cases, Recovery',
    critical: true,
    passScore: 7,
    questions: [
      'Failure states are intentionally designed (not default errors)',
      'Errors are due to human behavior, not technical failures',
      'Recovery paths are obvious and forgiving',
      'User is never blamed for system issues'
    ]
  },
  {
    id: 'trust_confidence_signals',
    title: '8. Trust and Confidence Signals',
    critical: false,
    passScore: 6,
    questions: [
      'Language is calm, clear, and respectful',
      'Pricing, permissions, and data use are transparent',
      'No surprises or dark patterns (e.g user informed product is not yet available after a long onboarding)',
      'Support experience matches product promise'
    ]
  }
];

export default function Scorecard() {
  const [view, setView] = useState('loading');
  const [scores, setScores] = useState({});
  const [productName, setProductName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [viewingAssessment, setViewingAssessment] = useState(null);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const { data: assessments = [], isLoading } = useQuery({
    queryKey: ['assessments', user?.email],
    queryFn: () => base44.entities.Assessment.filter({ user_email: user?.email }, '-created_date'),
    enabled: !!user?.email
  });

  useEffect(() => {
    if (!isLoading) {
      if (assessments.length > 0) {
        setView('list');
      } else {
        setView('new');
        initializeScores();
      }
    }
  }, [isLoading, assessments]);

  const initializeScores = () => {
    const initialScores = {};
    SCORECARD_SECTIONS.forEach(section => {
      section.questions.forEach((_, qIndex) => {
        initialScores[`${section.id}_${qIndex}`] = null;
      });
    });
    setScores(initialScores);
    setProductName('');
  };

  const handleStartNew = () => {
    initializeScores();
    setViewingAssessment(null);
    setView('new');
  };

  const handleViewAssessment = (assessment) => {
    setViewingAssessment(assessment);
    setScores(assessment.scores || {});
    setProductName(assessment.product_name || '');
    setView('view');
  };

  const handleEditAssessment = (assessment) => {
    setViewingAssessment(assessment);
    setScores(assessment.scores || {});
    setProductName(assessment.product_name || '');
    setView('edit');
  };

  const calculateTotalScore = () => {
    return Object.values(scores).reduce((sum, score) => sum + (score || 0), 0);
  };

  const calculateSectionScore = (sectionId) => {
    const sectionScores = Object.entries(scores)
      .filter(([key]) => key.startsWith(sectionId))
      .map(([, value]) => value || 0);
    return sectionScores.reduce((sum, score) => sum + score, 0);
  };

  const checkCriticalFailures = () => {
    const failures = [];
    SCORECARD_SECTIONS.forEach(section => {
      if (section.critical) {
        const sectionScore = calculateSectionScore(section.id);
        const hasZero = Object.entries(scores)
          .filter(([key]) => key.startsWith(section.id))
          .some(([, value]) => value === 0);
        
        if (sectionScore < section.passScore || hasZero) {
          failures.push(section.title);
        }
      }
    });
    return failures;
  };

  const handleSubmit = async () => {
    const totalScore = calculateTotalScore();
    const criticalFailures = checkCriticalFailures();
    
    let status = 'pass';
    if (criticalFailures.length > 0) {
      status = 'fail';
    } else if (totalScore < 48) {
      status = 'conditional';
    }

    const assessmentData = {
      user_email: user.email,
      product_name: productName,
      scores,
      total_score: totalScore,
      passed: status === 'pass',
      critical_failures: criticalFailures,
      status
    };

    setIsSubmitting(true);
    
    if (view === 'edit' && viewingAssessment) {
      // Update existing assessment
      await base44.entities.Assessment.update(viewingAssessment.id, assessmentData);
    } else {
      // Create new assessment
      await base44.entities.Assessment.create(assessmentData);
    }
    
    queryClient.invalidateQueries({ queryKey: ['assessments'] });
    setCurrentResult(assessmentData);
    setShowResult(true);
    setIsSubmitting(false);
  };

  const handleResultClose = () => {
    setShowResult(false);
    setView('list');
  };

  const totalScore = calculateTotalScore();
  const allAnswered = Object.values(scores).every(s => s !== null);

  if (isLoading || view === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <ResultDialog 
        open={showResult} 
        onClose={handleResultClose}
        result={currentResult}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={createPageUrl('Dashboard')}>
                <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_695a45a00c41aebc946dc291/dcce5d331_VenturesBlack.png" 
                alt="35N Ventures" 
                className="h-8 object-contain"
              />
            </div>
            {(view === 'new' || view === 'view' || view === 'edit') && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-slate-500">Total Score</p>
                  <p className={`text-2xl font-bold ${totalScore >= 48 ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {totalScore} <span className="text-sm font-normal text-slate-400">/ 60</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {view === 'list' && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-light text-slate-900 tracking-tight mb-2">
                  Product Launch CX Scorecard
                </h1>
                <p className="text-slate-500">Your previous assessments</p>
              </div>
              <Button 
                onClick={handleStartNew}
                className="bg-slate-900 hover:bg-slate-800 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Start New Assessment
              </Button>
            </div>

            <Card className="border-0 shadow-lg">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-100">
                    <TableHead>Product Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessments.map((assessment) => (
                    <TableRow 
                      key={assessment.id} 
                      className="border-slate-100 cursor-pointer hover:bg-slate-50"
                      onClick={() => handleViewAssessment(assessment)}
                    >
                      <TableCell className="font-medium">
                        {assessment.product_name || 'Untitled Assessment'}
                      </TableCell>
                      <TableCell className="text-slate-500">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {format(new Date(assessment.created_date), 'MMM d, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`font-semibold ${assessment.total_score >= 48 ? 'text-emerald-600' : 'text-slate-900'}`}>
                          {assessment.total_score}/60
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary"
                          className={
                            assessment.status === 'pass' 
                              ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                              : assessment.status === 'conditional'
                              ? 'bg-amber-100 text-amber-700 border-amber-200'
                              : 'bg-red-100 text-red-700 border-red-200'
                          }
                        >
                          {assessment.status === 'pass' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                          {assessment.status === 'conditional' && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {assessment.status === 'fail' && <XCircle className="h-3 w-3 mr-1" />}
                          {assessment.status === 'pass' ? 'Pass' : assessment.status === 'conditional' ? 'Conditional' : 'Fail'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewAssessment(assessment);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditAssessment(assessment);
                            }}
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </>
        )}

        {(view === 'new' || view === 'view' || view === 'edit') && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-light text-slate-900 tracking-tight mb-2">
                Product Launch CX Scorecard
              </h1>
              <p className="text-slate-500 max-w-2xl">
                A non-technical launch gate for fintech, enterprise, and emerging markets products. 
                Score each item: 0 = Not addressed, 1 = Partial, 2 = Validated.
              </p>
            </div>

            {(view === 'new' || view === 'edit') && (
              <Card className="border-0 shadow-lg mb-8">
                <CardContent className="p-6">
                  <Label htmlFor="productName" className="text-sm font-medium text-slate-700">
                    Product Name
                  </Label>
                  <Input
                    id="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Enter the name of the product you're assessing"
                    className="mt-2 h-12 border-slate-200 focus:border-slate-900 focus:ring-slate-900"
                  />
                </CardContent>
              </Card>
            )}

            {view === 'view' && viewingAssessment && (
              <Card className="border-0 shadow-lg mb-8 bg-slate-900 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Product Name</p>
                      <p className="text-xl font-semibold">{viewingAssessment.product_name || 'Untitled Assessment'}</p>
                    </div>
                    <Badge 
                      variant="secondary"
                      className={
                        viewingAssessment.status === 'pass' 
                          ? 'bg-emerald-500 text-white' 
                          : viewingAssessment.status === 'conditional'
                          ? 'bg-amber-500 text-white'
                          : 'bg-red-500 text-white'
                      }
                    >
                      {viewingAssessment.status === 'pass' ? 'Passed' : viewingAssessment.status === 'conditional' ? 'Conditional' : 'Failed'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-6">
              {SCORECARD_SECTIONS.map((section) => {
                const sectionScore = calculateSectionScore(section.id);
                const maxScore = section.questions.length * 2;
                
                return (
                  <Card key={section.id} className="border-0 shadow-lg overflow-hidden">
                    <CardHeader className="bg-slate-50 border-b border-slate-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-lg font-semibold tracking-tight">
                            {section.title}
                          </CardTitle>
                          {section.critical && (
                            <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              CRITICAL
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-500">
                            Pass: {section.passScore}/{maxScore}
                          </p>
                          <p className={`text-lg font-bold ${sectionScore >= section.passScore ? 'text-emerald-600' : 'text-slate-900'}`}>
                            {sectionScore}/{maxScore}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      {section.questions.map((question, qIndex) => {
                        const scoreKey = `${section.id}_${qIndex}`;
                        return (
                          <div 
                            key={qIndex}
                            className="flex items-center justify-between p-6 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                          >
                            <p className="text-slate-700 flex-1 pr-6">
                              {question}
                            </p>
                            <ScoreSelector
                              value={scores[scoreKey]}
                              onChange={(value) => setScores({ ...scores, [scoreKey]: value })}
                              disabled={view === 'view'}
                            />
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {(view === 'new' || view === 'edit') && (
              <div className="sticky bottom-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 mt-8 -mx-6 px-6 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      Minimum passing score: 48/60. Failing any CRITICAL section = No launch.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    {view === 'edit' && (
                      <Button
                        onClick={() => setView('list')}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      onClick={handleSubmit}
                      disabled={!allAnswered || isSubmitting}
                      className="bg-slate-900 hover:bg-slate-800 text-white px-8 h-12"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {view === 'edit' ? 'Updating...' : 'Submitting...'}
                        </>
                      ) : (
                        view === 'edit' ? 'Update Assessment' : 'Submit Assessment'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {view === 'view' && (
              <div className="mt-8 flex justify-center">
                <Button
                  onClick={() => setView('list')}
                  variant="outline"
                  className="mr-4"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to List
                </Button>
                <Button
                  onClick={handleStartNew}
                  className="bg-slate-900 hover:bg-slate-800 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Start New Assessment
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}