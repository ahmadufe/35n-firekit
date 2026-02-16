import React, { useState, useEffect } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Download } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import LoginPromptMetricsDialog from "@/components/LoginPromptMetricsDialog";

SaaSMetricsDashboard.public = true;

const metricsData = [
  { id: 1, category: "Market size & Opportunity", metric: "Total Addressable Market (TAM)", description: "the total demand for your product or service if you could sell to every single potential customer out there", formula: "N/A" },
  { id: 2, category: "Market size & Opportunity", metric: "Serviceable Available Market (SAM)", description: "the portion of TAM that your business can realistically target", formula: "N/A" },
  { id: 3, category: "Market size & Opportunity", metric: "Serviceable Obtainable Market (SOM)", description: "the portion of your SAM that you can realistically capture, considering competition, market conditions, and your business's capacity", formula: "N/A" },
  { id: 4, category: "Market size & Opportunity", metric: "Market value", description: "The total revenue your market can generate", formula: "N/A" },
  { id: 5, category: "Customer base", metric: "# of current customers", description: "# of active users currently using the solution", formula: "N/A" },
  { id: 6, category: "Customer base", metric: "# of sign ups / wait listed users", description: "no. of users who registered to use the service when its available", formula: "N/A" },
  { id: 7, category: "Product / market fit", metric: "Customer Retention rate", description: "How many of the customers continue to use the solution", formula: "(Customers at the end of a period - customers added during the given period) / Customers at the start of the given period  ×100%" },
  { id: 8, category: "Product / market fit", metric: "Churn rate", description: "The rate at which customers stop using a product or service", formula: "Total Number of Customers at the Start of the Period / Number of Customers Lost during Period ×100" },
  { id: 9, category: "Product / market fit", metric: "User engagement", description: "[Insert the relevant metrics that you track; e.g. Daily login / unique user, Login frequency / user, session duration, etc.]", formula: "[Add the values for the metrics you track]" },
  { id: 10, category: "Product / market fit", metric: "Customer feedback (NPS or others)", description: "- Could be Net Promoter Score (NPS) or rating on a public forum (google reviews, etc.) or other feedback metrics", formula: "N/A" },
  { id: 11, category: "Customer Acquisition", metric: "Cost of Customer Acquisition (CAC)", description: "Cost of marketing for each customer acquired", formula: "Number of New Customers Acquired / Total Marketing and Sales Expenses." },
  { id: 12, category: "Customer Acquisition", metric: "Customer Lifetime Value (LTV)", description: "he total earnings a business can anticipate from a single customer over the entire relationship", formula: "Average Purchase Value×Purchase Frequency / ChurnRate​" },
  { id: 13, category: "Customer Acquisition", metric: "Conversion rate", description: "The rate of users who complete a targeted action, such as purchasing", formula: "Number of Visitors / Number of Conversions ×100%" },
  { id: 14, category: "Financials", metric: "Total Investments to date", description: "", formula: "" },
  { id: 15, category: "Financials", metric: "Total Revenue to date", description: "The total income generated from sales or services, representing the \"top line\" of a financial statement before any expenses are considered", formula: "The amount of money a business charges for each unit of its product or service × the amount sold" },
  { id: 16, category: "Financials", metric: "Profit (as of last financial year - you can choose a different period if early stage)", description: "The money left over after all operating costs, expenses, and taxes have been deducted from the total revenue", formula: "Total Revenue – Total Expenses" },
  { id: 17, category: "Financials", metric: "Gross margin", description: "reflects the profitability of a company's core operations by measuring profit after deducting the Cost of Goods Sold (COGS); i.e. after deducting only the direct costs of producing goods", formula: "(Total Revenue - Cost of Goods Sold) / Total Revenue x 100%" },
  { id: 18, category: "Financials", metric: "Net margin", description: "indicates a company's overall profitability by showing the percentage of revenue remaining after all expenses, including operating costs, interest, and taxes, have been subtracted", formula: "(Total Revenue - Cost)/ Total Revenue × 100%" },
  { id: 19, category: "Financials", metric: "Monthly Burn rate", description: "Amount of cash burnt to run the company", formula: "Total Cash Outflow - Total Cash Inflow per month" },
  { id: 20, category: "Financials", metric: "CAC payback time", description: "the number of months needed by a company to recoup the CAC, i.e the initial costs incurred in the process of acquiring a new customer", formula: "CAC / Monthly Gross Profit per Customer" },
  { id: 21, category: "Financials", metric: "Average Revenue per User (ARPU)", description: "the total revenue generated from each user or subscriber over a specific period", formula: "Total Revenue / Number of Users" },
  { id: 22, category: "Financials", metric: "Average Rate of Return", description: "the average annual profit an investment generates as a percentage of its initial cost", formula: "Average Annual Profit / Initial Investment × 100%" },
  { id: 23, category: "Growth & Retention", metric: "Monthly Recurring Revenue (MRR)", description: "Recurring revenue each month, a key metric for subscription-based businesses", formula: "Number of Active Customers x Average Revenue Per User (ARPU) OR (New MRR + Expansion MRR) - (Churned MRR + Contraction MRR)" },
  { id: 24, category: "Growth & Retention", metric: "Annual Recurring Revenue (ARR)", description: "Recurring revenue each year, a key metric for subscription-based businesses", formula: "(New Recurring Revenue + Expansion Revenue) - (Lost Revenue from Churned Customers + Contraction Revenue)" },
  { id: 25, category: "Growth & Retention", metric: "Average Contract Value (ACV)", description: "the annualized revenue from a single customer contract", formula: "Total Annual contract value / No. of customers" },
  { id: 26, category: "Growth & Retention", metric: "Gross Revenue Retention (GRR)", description: "Gross Revenue Retention (GRR) measures the pure percentage of recurring revenue retained from existing customers after accounting for downgrades and churn, excluding any revenue from upsells or expansions and therefore can never exceed 100%. More important for understanding customer loyalty", formula: "(Starting MRR – Downgrade Revenue – Churned Revenue) / Starting MRR] × 100" },
  { id: 27, category: "Growth & Retention", metric: "Net Revenue Retention", description: "includes expansion revenue from upsells, cross-sells, and increased usage, allowing it to go above 100% and indicating growth from the existing customer base. It showcases the overall financial momentum from existing customers and is a key growth indicator", formula: "(Starting MRR + Expansion Revenue - Contraction Revenue - Churn Revenue) / Starting MRR" },
  { id: 28, category: "Brand equity & positionning", metric: "No. of partnerships", description: "MOU's with other startups, established organizations or others", formula: "N/A" },
  { id: 29, category: "Brand equity & positionning", metric: "No. of awards", description: "", formula: "N/A" },
  { id: 30, category: "Brand equity & positionning", metric: "No. of grants", description: "", formula: "N/A" }
];

export default function SaaSMetricsDashboard() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [country, setCountry] = useState('');
  const [metrics, setMetrics] = useState({});
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

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

  const { data: savedData = [] } = useQuery({
    queryKey: ['saasMetrics', user?.email],
    queryFn: () => base44.entities.SaaSMetrics.filter({ user_email: user?.email }),
    enabled: !!user?.email
  });

  useEffect(() => {
    const viewId = location.state?.viewId;
    const editId = location.state?.editId;
    
    if (viewId || editId) {
      const targetData = savedData.find(d => d.id === (viewId || editId));
      if (targetData) {
        setCompanyName(targetData.company_name || '');
        setIndustry(targetData.industry || '');
        setCountry(targetData.country || '');
        setMetrics(targetData.metrics_data || {});
        setCurrentEditId(editId || null);
      }
    }
  }, [savedData, location.state]);

  const handleMetricChange = (metricId, field, value) => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    setMetrics(prev => ({
      ...prev,
      [metricId]: {
        ...prev[metricId],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    setIsSaving(true);
    try {
      const dataToSave = {
        user_email: user.email,
        company_name: companyName,
        industry: industry,
        country: country,
        metrics_data: metrics
      };

      if (currentEditId) {
        await base44.entities.SaaSMetrics.update(currentEditId, dataToSave);
      } else {
        const newRecord = await base44.entities.SaaSMetrics.create(dataToSave);
        setCurrentEditId(newRecord.id);
      }

      queryClient.invalidateQueries({ queryKey: ['saasMetrics'] });
      queryClient.invalidateQueries({ queryKey: ['allSaasMetrics'] });
      toast.success('Data saved successfully');
    } catch (error) {
      toast.error('Failed to save data');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExtract = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    const exportData = [
      ['Company name', companyName],
      ['Industry', industry],
      ['Country', country],
      [],
      ['#', 'Category', 'Metric', 'Description', 'Calculation formula / method', 'Value', 'Comments'],
      ...metricsData.map(m => [
        m.id,
        m.category,
        m.metric,
        m.description,
        m.formula,
        metrics[m.id]?.value || '',
        metrics[m.id]?.comments || ''
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SaaS Metrics');
    XLSX.writeFile(wb, `SaaS_Metrics_${companyName || 'Dashboard'}_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('File downloaded successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <LoginPromptMetricsDialog 
        open={showLoginPrompt} 
        onOpenChange={setShowLoginPrompt}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-6 mt-12 sm:mt-16">
          <Link to={createPageUrl('SaaSMetricsIntro')}>
            <Button variant="ghost" size="icon" className="hover:bg-slate-100">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">SaaS Metrics Dashboard</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="text-lg font-semibold text-slate-900">Company Information</div>
            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                disabled={!user || isSaving}
                className={`${!user ? 'bg-slate-300 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800'}`}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
              <Button
                onClick={handleExtract}
                disabled={!user}
                variant="outline"
                className={!user ? 'border-slate-300 text-slate-400 cursor-not-allowed' : ''}
              >
                <Download className="h-4 w-4 mr-2" />
                Extract to Excel
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Company name
              </label>
              <Input
                value={companyName}
                onChange={(e) => user ? setCompanyName(e.target.value) : setShowLoginPrompt(true)}
                onFocus={() => !user && setShowLoginPrompt(true)}
                placeholder="Enter company name"
                disabled={!user}
                className={!user ? 'bg-slate-100 cursor-not-allowed' : ''}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Industry
              </label>
              <Input
                value={industry}
                onChange={(e) => user ? setIndustry(e.target.value) : setShowLoginPrompt(true)}
                onFocus={() => !user && setShowLoginPrompt(true)}
                placeholder="Enter industry"
                disabled={!user}
                className={!user ? 'bg-slate-100 cursor-not-allowed' : ''}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Country
              </label>
              <Input
                value={country}
                onChange={(e) => user ? setCountry(e.target.value) : setShowLoginPrompt(true)}
                onFocus={() => !user && setShowLoginPrompt(true)}
                placeholder="Enter country"
                disabled={!user}
                className={!user ? 'bg-slate-100 cursor-not-allowed' : ''}
              />
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Metrics Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { id: 5, label: "# of current customers" },
                { id: 7, label: "Customer Retention rate" },
                { id: 8, label: "Churn rate" },
                { id: 11, label: "CAC" },
                { id: 12, label: "Customer LTV" },
                { id: 17, label: "Gross margin" },
                { id: 18, label: "Net margin" },
                { id: 20, label: "CAC payback time" },
                { id: 23, label: "Monthly Recurring Revenue (MRR)" },
                { id: 26, label: "Gross Revenue Retention (GRR)" }
              ].map(metric => {
                const value = metrics[metric.id]?.value;
                return (
                  <div key={metric.id} className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                    <div className="text-xs font-medium text-slate-500 mb-1 line-clamp-2 min-h-[2rem]">{metric.label}</div>
                    <div className="text-lg font-bold text-slate-900 truncate">{value || '-'}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-8">
            {['Market size & Opportunity', 'Customer base', 'Product / market fit', 'Customer Acquisition', 'Financials', 'Growth & Retention', 'Brand equity & positionning'].map(category => {
              const categoryMetrics = metricsData.filter(m => m.category === category);
              return (
                <div key={category} className="overflow-x-auto">
                  <h2 className="text-xl font-semibold text-slate-900 mb-4">{category}</h2>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b-2 border-slate-300">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border border-slate-300">#</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border border-slate-300 w-40">Metric</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border border-slate-300 w-48">Description</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border border-slate-300 w-48">Calculation formula / method</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border border-slate-300 bg-yellow-50 w-56">Value</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border border-slate-300 bg-yellow-50 w-64">Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryMetrics.map((metric, index) => (
                        <tr key={metric.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="px-4 py-3 text-sm text-slate-600 border border-slate-200">{metric.id}</td>
                          <td className="px-4 py-3 text-sm font-bold text-slate-900 border border-slate-200">{metric.metric}</td>
                          <td className="px-4 py-3 text-sm text-slate-600 border border-slate-200">{metric.description}</td>
                          <td className="px-4 py-3 text-sm text-slate-600 border border-slate-200">{metric.formula}</td>
                          <td className="px-4 py-3 border border-slate-200 bg-yellow-50">
                            <Input
                              value={metrics[metric.id]?.value || ''}
                              onChange={(e) => handleMetricChange(metric.id, 'value', e.target.value)}
                              onFocus={() => !user && setShowLoginPrompt(true)}
                              placeholder="Enter value"
                              disabled={!user}
                              className={`text-sm ${!user ? 'bg-slate-100 cursor-not-allowed' : 'bg-white'}`}
                            />
                          </td>
                          <td className="px-4 py-3 border border-slate-200 bg-yellow-50">
                            <Textarea
                              value={metrics[metric.id]?.comments || ''}
                              onChange={(e) => handleMetricChange(metric.id, 'comments', e.target.value)}
                              onFocus={() => !user && setShowLoginPrompt(true)}
                              placeholder="Add comments"
                              disabled={!user}
                              className={`text-sm min-h-[60px] resize-none ${!user ? 'bg-slate-100 cursor-not-allowed' : 'bg-white'}`}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}