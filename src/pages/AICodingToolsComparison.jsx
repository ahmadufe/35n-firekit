import React, { useState, useMemo, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AICodingToolsComparison() {
  const [columnFilters, setColumnFilters] = useState({});
  const [columnWidths, setColumnWidths] = useState({});
  const [resizing, setResizing] = useState(null);

  const comparisonData = [
    {'#': 1, 'Tool': 'Lovable', 'Best for': 'Fastest MVP creation; beautiful UI with Supabase backend; GitHub export', 'Target user': 'Non-technical founders, agencies, developers wanting rapid prototyping', 'Paradigm': 'AI code-generation platform (full export, owns code)', 'Stack transparency': 'Very High (code visible + GitHub export)', 'Typical stack / languages': 'React, Vite, TypeScript, Tailwind CSS; Supabase (PostgreSQL)', 'Code export': 'Yes', 'GitHub sync': 'Yes', 'Self-hosting possible': 'Yes', 'Visual editor': 'Limited (select tool)', 'Code editor': 'Yes', 'Prompt + manual editing': 'Yes', 'System-level instructions': 'Yes (project instructions, style prefs)', 'Figma / design import': 'Can reference images', 'Styling control level': 'High', 'Built-in database': 'No', 'External DB support': 'Yes (Supabase native)', 'Auth built-in': 'Via Supabase', 'RBAC': 'Via Supabase', 'Workflows / background jobs': 'Via Supabase/external', 'Webhooks': 'Via external', 'Payments': 'Via Stripe/external', 'Email / SMS': 'Via external', 'Integrations (highlights)': 'Supabase, GitHub, any API', 'Hosting included': 'Yes (Lovable Cloud)', 'Custom domain': 'Yes', 'Pricing model': 'Credit-based messages', 'Free tier': 'Yes (5/day, 25/month)', 'Paid tiers from (USD/mo)': '$21 (Pro)', 'Included credits (examples)': 'Pro: 100/month; rollover', 'Overage / payg': 'Upgrade tier', 'Ease of use': 'Very High', 'Lock-in risk': 'Low-Medium', 'Reviews—highlights': '£13.50M ARR in 3 months; beautiful UI; GPT Engineer creators; fastest growth', 'Reviews—pain points': 'Credit burn on iterations; breaks when complex; frontend-focused', 'Official pricing': 'https://lovable.dev/pricing', 'Official docs/features': 'https://docs.lovable.dev/', 'Last checked': '2026-01-19', 'Key sources': 'Official docs, Reddit, G2, Product Hunt', 'Prototype fit': 'Very High', 'MVP fit': 'Very High', 'SaaS fit': 'High'},
    {'#': 2, 'Tool': 'Replit', 'Best for': 'Complete cloud IDE with AI Agent; multi-language; educational', 'Target user': 'Developers, students, technical PMs, teams', 'Paradigm': 'Cloud IDE + AI agent + hosting', 'Stack transparency': 'Very High', 'Typical stack / languages': 'Python, JS, TS, Java, C++, Go, Rust, all languages', 'Code export': 'Yes (Git-based)', 'GitHub sync': 'Yes', 'Self-hosting possible': 'Yes', 'Visual editor': 'No (code-first)', 'Code editor': 'Yes (full IDE)', 'Prompt + manual editing': 'Yes', 'System-level instructions': 'Agent instructions', 'Figma / design import': 'No', 'Styling control level': 'Very High (code)', 'Built-in database': 'Yes (PostgreSQL)', 'External DB support': 'Yes (any)', 'Auth built-in': 'Via libraries', 'RBAC': 'Via code', 'Workflows / background jobs': 'Via code', 'Webhooks': 'Via code', 'Payments': 'Via code (Stripe, etc.)', 'Email / SMS': 'Via code', 'Integrations (highlights)': 'ChatGPT, PostgreSQL, any API, npm', 'Hosting included': 'Yes', 'Custom domain': 'Yes', 'Pricing model': 'Subscription + effort-based usage', 'Free tier': 'Yes (limited Agent, 10 apps)', 'Paid tiers from (USD/mo)': '$20 (Core)', 'Included credits (examples)': 'Core: $25/month; Teams: $40/user', 'Overage / payg': 'Yes (usage-based)', 'Ease of use': 'Medium (full IDE)', 'Lock-in risk': 'Very Low', 'Reviews—highlights': 'Complete environment; great for learning; real-time collab; Agent powerful', 'Reviews—pain points': 'Unpredictable costs; effort-based confusing; can get expensive', 'Official pricing': 'https://replit.com/pricing', 'Official docs/features': 'https://docs.replit.com/', 'Last checked': '2026-01-19', 'Key sources': 'Official docs, blog, user reviews', 'Prototype fit': 'High', 'MVP fit': 'Very High', 'SaaS fit': 'High'},
    {'#': 3, 'Tool': 'Bolt.new', 'Best for': 'Browser-based full-stack prototyping; zero-setup; hackathons', 'Target user': 'Developers, designers, hackathon participants', 'Paradigm': 'Browser code generation + WebContainers', 'Stack transparency': 'Very High', 'Typical stack / languages': 'React, Node.js, Tailwind, Vite, Next.js, Astro, Svelte, Vue', 'Code export': 'Yes (GitHub, Vercel/Netlify)', 'GitHub sync': 'Yes', 'Self-hosting possible': 'Yes', 'Visual editor': 'Some (prompt + preview)', 'Code editor': 'Yes (browser-based)', 'Prompt + manual editing': 'Yes', 'System-level instructions': 'Discussion Mode', 'Figma / design import': 'Not primary', 'Styling control level': 'High (Tailwind)', 'Built-in database': 'No', 'External DB support': 'Yes (Supabase, Firebase)', 'Auth built-in': 'External', 'RBAC': 'Implementation dependent', 'Workflows / background jobs': 'Via code/external', 'Webhooks': 'Via code', 'Payments': 'Stripe supported', 'Email / SMS': 'Via integrations', 'Integrations (highlights)': 'Supabase, Netlify, n8n.io, Stripe, GitHub', 'Hosting included': 'Yes (preview + deploy)', 'Custom domain': 'Via platform', 'Pricing model': 'Token-based', 'Free tier': 'Yes (150K/day, 1M/month)', 'Paid tiers from (USD/mo)': '$20 (10M tokens)', 'Included credits (examples)': '$20: 10M; $60: 30M; $200: 120M', 'Overage / payg': 'Token reloads ($30/10M)', 'Ease of use': 'Very High', 'Lock-in risk': 'Low', 'Reviews—highlights': 'Zero-setup; WebContainers impressive; great for demos; StackBlitz', 'Reviews—pain points': 'Token costs spike; struggles >15-20 components; 31% success on enterprise features', 'Official pricing': 'https://bolt.new/pricing', 'Official docs/features': 'https://support.bolt.new/', 'Last checked': '2026-01-19', 'Key sources': 'StackBlitz docs, user reviews', 'Prototype fit': 'Very High', 'MVP fit': 'High', 'SaaS fit': 'Medium'},
    {'#': 4, 'Tool': 'Base44', 'Best for': 'All-in-one business apps; built-in DB/auth/email; non-technical users', 'Target user': 'Non-technical builders, business operators', 'Paradigm': 'Integrated AI app builder platform', 'Stack transparency': 'Medium-High', 'Typical stack / languages': 'React, TypeScript, Tailwind (managed)', 'Code export': 'Yes (GitHub, Builder+)', 'GitHub sync': 'Yes (Builder+)', 'Self-hosting possible': 'Limited (code export enables)', 'Visual editor': 'Prompt + platform UI', 'Code editor': 'Yes (paid tiers)', 'Prompt + manual editing': 'Yes', 'System-level instructions': 'Discussion Mode, styling instructions', 'Figma / design import': 'Can reference', 'Styling control level': 'Medium', 'Built-in database': 'Yes', 'External DB support': 'Some connectors', 'Auth built-in': 'Yes', 'RBAC': 'Yes', 'Workflows / background jobs': 'Yes', 'Webhooks': 'Via integrations', 'Payments': 'Yes (Stripe)', 'Email / SMS': 'Yes (built-in)', 'Integrations (highlights)': 'Salesforce, Notion, Slack, GDrive, Sheets, Zapier, Stripe', 'Hosting included': 'Yes', 'Custom domain': 'Yes', 'Pricing model': 'Message + Integration credits', 'Free tier': 'Yes (5/day, 25/month, 500 integration)', 'Paid tiers from (USD/mo)': '$16-20 (Starter)', 'Included credits (examples)': 'Starter: 100 msg + 2K int; Builder: 250 + 10K; Pro: 500 + 20K', 'Overage / payg': 'Upgrade tier', 'Ease of use': 'Very High', 'Lock-in risk': 'Medium-High', 'Reviews—highlights': 'Complete solution; Wix acquired for ~$80M; business-ready; no external deps', 'Reviews—pain points': 'Platform coupling; integration credits surprise; UI less polished initially', 'Official pricing': 'https://base44.com/pricing', 'Official docs/features': 'https://base44.com/features', 'Last checked': '2026-01-19', 'Key sources': 'Official docs, acquisition news', 'Prototype fit': 'High', 'MVP fit': 'Very High', 'SaaS fit': 'High'},
    {'#': 5, 'Tool': 'Cursor', 'Best for': 'AI-native code editor; codebase-aware; multi-model support', 'Target user': 'Developers, power users, VS Code lovers', 'Paradigm': 'AI-native IDE (VS Code fork)', 'Stack transparency': 'Very High', 'Typical stack / languages': 'All languages (VS Code support)', 'Code export': 'Yes (full access)', 'GitHub sync': 'Yes (deep integration)', 'Self-hosting possible': 'Yes', 'Visual editor': 'No (code-first)', 'Code editor': 'Yes (full IDE)', 'Prompt + manual editing': 'Yes', 'System-level instructions': 'Codebase indexing, @ mentions', 'Figma / design import': 'No', 'Styling control level': 'Very High (code)', 'Built-in database': 'No', 'External DB support': 'Via code', 'Auth built-in': 'No', 'RBAC': 'No', 'Workflows / background jobs': 'Via code', 'Webhooks': 'Via code', 'Payments': 'Via code', 'Email / SMS': 'Via code', 'Integrations (highlights)': 'GitHub, GPT-4.1, Claude Opus 4.1, Sonnet 4.5, Gemini 2.5', 'Hosting included': 'No (developer choice)', 'Custom domain': 'N/A (IDE tool)', 'Pricing model': 'Subscription + usage pool', 'Free tier': 'Yes (2K completions, 50 slow)', 'Paid tiers from (USD/mo)': '$20 (Pro)', 'Included credits (examples)': 'Pro: $20 pool; Pro+: $60; Ultra: $200; Teams: $40/user', 'Overage / payg': 'Yes (at API rates)', 'Ease of use': 'Medium-High', 'Lock-in risk': 'Very Low', 'Reviews—highlights': 'Powerful codebase awareness; multi-model; VS Code familiarity; frontier models', 'Reviews—pain points': 'Pricing confusion (June 2025); learning curve; unpredictable costs; Max Mode expensive', 'Official pricing': 'https://cursor.com/pricing', 'Official docs/features': 'https://cursor.com/blog/', 'Last checked': '2026-01-19', 'Key sources': 'Official docs, Reddit, user reviews', 'Prototype fit': 'High', 'MVP fit': 'Very High', 'SaaS fit': 'Very High'},
    {'#': 6, 'Tool': 'Windsurf (Codeium)', 'Best for': 'Intuitive AI IDE; generous free tier; Cursor alternative', 'Target user': 'Developers wanting intuitive UX, multi-IDE support', 'Paradigm': 'Agentic AI-powered IDE', 'Stack transparency': 'Very High', 'Typical stack / languages': 'All languages, cross-IDE (VS Code, JetBrains, Vim)', 'Code export': 'Yes', 'GitHub sync': 'Yes', 'Self-hosting possible': 'Yes (air-gapped)', 'Visual editor': 'No', 'Code editor': 'Yes (full IDE)', 'Prompt + manual editing': 'Yes', 'System-level instructions': 'Cascade Memories, project rules', 'Figma / design import': 'No', 'Styling control level': 'Very High', 'Built-in database': 'No', 'External DB support': 'Via code', 'Auth built-in': 'No', 'RBAC': 'No', 'Workflows / background jobs': 'Via code', 'Webhooks': 'Via code', 'Payments': 'Via code', 'Email / SMS': 'Via code', 'Integrations (highlights)': 'GPT-5.2-Codex, Claude, Gemini, JetBrains, VS Code, Vim', 'Hosting included': 'No', 'Custom domain': '', 'Pricing model': 'Prompt credits', 'Free tier': 'Yes (25 credits + unlimited autocomplete)', 'Paid tiers from (USD/mo)': '$15 (Pro)', 'Included credits (examples)': 'Free: unlimited Tab autocomplete; Pro enhanced; Teams: $35/user', 'Overage / payg': 'Add-on credits', 'Ease of use': 'Very High (intuitive UX)', 'Lock-in risk': 'Very Low', 'Reviews—highlights': 'More intuitive than Cursor; generous free tier; SOC 2 Type 2; rapid growth; multi-IDE', 'Reviews—pain points': 'Newer (late 2024); smaller ecosystem; less mature than Cursor', 'Official pricing': 'https://windsurf.com/pricing', 'Official docs/features': 'https://windsurf.com/editor', 'Last checked': '2026-01-19', 'Key sources': 'Official docs, comparisons', 'Prototype fit': 'High', 'MVP fit': 'Very High', 'SaaS fit': 'Very High'},
    {'#': 7, 'Tool': 'Emergent', 'Best for': 'Conversation-driven apps; System Prompt editing on Pro', 'Target user': 'Creators, brands, teams wanting prompt governance', 'Paradigm': 'Vibe-coding platform + GitHub integration', 'Stack transparency': 'Medium', 'Typical stack / languages': 'Web & mobile (platform abstracts)', 'Code export': 'Tiered (GitHub integration)', 'GitHub sync': 'Yes (plan dependent)', 'Self-hosting possible': 'Possible if exported', 'Visual editor': 'Prompt-driven', 'Code editor': 'Some', 'Prompt + manual editing': 'Yes', 'System-level instructions': 'Yes (System Prompt Edit on Pro)', 'Figma / design import': 'Unclear', 'Styling control level': 'Medium', 'Built-in database': 'Platform positioning', 'External DB support': 'Unclear', 'Auth built-in': 'Platform positioning', 'RBAC': 'Unclear', 'Workflows / background jobs': 'Unclear', 'Webhooks': 'Unclear', 'Payments': 'Unclear', 'Email / SMS': 'Unclear', 'Integrations (highlights)': 'GitHub integration', 'Hosting included': 'Yes (private projects)', 'Custom domain': 'Unclear', 'Pricing model': 'Credits per month', 'Free tier': 'Yes (10 monthly credits)', 'Paid tiers from (USD/mo)': '$20 (Standard); $200 (Pro)', 'Included credits (examples)': 'Pro: 750 monthly credits', 'Overage / payg': 'Unclear', 'Ease of use': 'High', 'Lock-in risk': 'Medium-High', 'Reviews—highlights': 'System prompt edit valuable for consistent outputs', 'Reviews—pain points': 'Maturity varies; feature depth unclear; details sometimes sparse', 'Official pricing': 'https://emergent.sh/pricing', 'Official docs/features': 'https://emergent.sh/', 'Last checked': '2026-01-19', 'Key sources': 'Official docs (limited)', 'Prototype fit': 'High', 'MVP fit': 'Medium', 'SaaS fit': 'Low-Medium'},
    {'#': 8, 'Tool': 'Mocha', 'Best for': 'Non-technical founders; basic full-stack apps; fast publishing', 'Target user': 'Non-technical builders, SMB operators', 'Paradigm': 'AI app builder (hosted)', 'Stack transparency': 'Low-Medium', 'Typical stack / languages': 'Platform-abstracted', 'Code export': 'Unclear/limited', 'GitHub sync': 'Not core', 'Self-hosting possible': 'Unclear', 'Visual editor': 'Prompt + platform UI', 'Code editor': 'Limited', 'Prompt + manual editing': 'Some', 'System-level instructions': 'Basic prompting', 'Figma / design import': 'No', 'Styling control level': 'Low-Medium', 'Built-in database': 'Yes', 'External DB support': 'Limited', 'Auth built-in': 'Yes', 'RBAC': 'Limited', 'Workflows / background jobs': 'Some', 'Webhooks': 'Limited', 'Payments': 'Limited', 'Email / SMS': 'Limited', 'Integrations (highlights)': 'Fast publishing, custom domains', 'Hosting included': 'Yes', 'Custom domain': 'Yes', 'Pricing model': 'Credits', 'Free tier': 'Yes (120 credits)', 'Paid tiers from (USD/mo)': '$20 (Bronze)', 'Included credits (examples)': 'Free: 120; Bronze increases', 'Overage / payg': 'Higher tiers', 'Ease of use': 'Very High', 'Lock-in risk': 'High', 'Reviews—highlights': 'Fast time-to-live; simple', 'Reviews—pain points': 'Less suited to deep customization/scale', 'Official pricing': 'https://getmocha.com/pricing', 'Official docs/features': 'https://docs.getmocha.com/', 'Last checked': '2026-01-19', 'Key sources': 'Official docs', 'Prototype fit': 'High', 'MVP fit': 'Medium', 'SaaS fit': 'Low-Medium'},
    {'#': 9, 'Tool': 'Bubble', 'Best for': 'Production no-code apps; workflows + database; mature platform', 'Target user': 'No-code builders, product teams, agencies', 'Paradigm': 'Visual no-code platform + AI assist', 'Stack transparency': 'Medium (platform runtime)', 'Typical stack / languages': 'Bubble runtime (not standard JS)', 'Code export': 'No (generally)', 'GitHub sync': 'No (generally)', 'Self-hosting possible': 'No', 'Visual editor': 'Yes (best-in-class)', 'Code editor': 'Limited (plugins/custom)', 'Prompt + manual editing': 'AI + visual editor', 'System-level instructions': 'Limited (AI generation focus)', 'Figma / design import': 'Not core', 'Styling control level': 'Very High (Bubble editor)', 'Built-in database': 'Yes', 'External DB support': 'Yes (APIs/plugins)', 'Auth built-in': 'Yes', 'RBAC': 'Yes (privacy rules)', 'Workflows / background jobs': 'Yes', 'Webhooks': 'Yes (API connector)', 'Payments': 'Yes (Stripe/plugins)', 'Email / SMS': 'Yes (plugins)', 'Integrations (highlights)': 'Huge plugin ecosystem, API connector', 'Hosting included': 'Yes', 'Custom domain': 'Yes', 'Pricing model': 'Plan tiers + Workload Units', 'Free tier': 'Yes', 'Paid tiers from (USD/mo)': 'Varies (check Bubble)', 'Included credits (examples)': 'WU-based + plan limits', 'Overage / payg': 'WU overages', 'Ease of use': 'Medium (learning curve)', 'Lock-in risk': 'High', 'Reviews—highlights': 'Most powerful no-code for complex apps; mature ecosystem; workflows', 'Reviews—pain points': 'Learning curve; workload pricing confusing', 'Official pricing': 'https://bubble.io/pricing', 'Official docs/features': 'https://bubble.io/ai-features', 'Last checked': '2026-01-19', 'Key sources': 'Official docs', 'Prototype fit': 'Medium', 'MVP fit': 'Very High', 'SaaS fit': 'Very High'},
    {'#': 10, 'Tool': 'Figma Make', 'Best for': 'Design-to-interactive prototypes; designer workflows', 'Target user': 'Designers, product teams prototyping', 'Paradigm': 'Agentic prototype builder in Figma', 'Stack transparency': 'Medium (prototype focus)', 'Typical stack / languages': 'Prototype output (abstracted)', 'Code export': 'Unclear/limited', 'GitHub sync': 'No', 'Self-hosting possible': 'No', 'Visual editor': 'Yes (Figma native)', 'Code editor': 'Limited', 'Prompt + manual editing': 'Yes', 'System-level instructions': 'Prompt-based, model choice', 'Figma / design import': 'Native (core differentiator)', 'Styling control level': 'Very High (design fidelity)', 'Built-in database': 'No', 'External DB support': 'No', 'Auth built-in': 'No', 'RBAC': 'No', 'Workflows / background jobs': 'No', 'Webhooks': 'No', 'Payments': 'No', 'Email / SMS': 'No', 'Integrations (highlights)': 'Figma files/images, Figma AI suite', 'Hosting included': 'No (publishing gated)', 'Custom domain': 'No', 'Pricing model': 'AI credits per Figma plan', 'Free tier': 'Yes (limited prompts, drafts only)', 'Paid tiers from (USD/mo)': 'Depends on Figma plan', 'Included credits (examples)': 'Starter: daily AI credits; Full seats: higher monthly', 'Overage / payg': 'Purchasable credits', 'Ease of use': 'Very High (for designers)', 'Lock-in risk': 'High (Figma ecosystem)', 'Reviews—highlights': 'Best for design fidelity; fast prototyping for designers', 'Reviews—pain points': 'Not full SaaS builder; publishing restricted by plan', 'Official pricing': 'https://www.figma.com/pricing/', 'Official docs/features': 'https://www.figma.com/blog/figma-make-general-availability/', 'Last checked': '2026-01-19', 'Key sources': 'Figma official', 'Prototype fit': 'Very High', 'MVP fit': 'Low-Medium', 'SaaS fit': 'Low'},
    {'#': 11, 'Tool': 'GitHub Copilot', 'Best for': 'Code completion; GitHub/Microsoft ecosystem integration', 'Target user': 'Developers in GitHub/MS ecosystem', 'Paradigm': 'AI coding assistant (IDE extension)', 'Stack transparency': 'High', 'Typical stack / languages': 'All languages', 'Code export': 'N/A (assists in your code)', 'GitHub sync': 'Native', 'Self-hosting possible': 'N/A (IDE tool)', 'Visual editor': 'No', 'Code editor': 'Works in your IDE', 'Prompt + manual editing': 'Yes', 'System-level instructions': 'Limited', 'Figma / design import': 'No', 'Styling control level': 'High (code)', 'Built-in database': 'No', 'External DB support': '', 'Auth built-in': 'No', 'RBAC': 'No', 'Workflows / background jobs': 'Via code', 'Webhooks': 'Via code', 'Payments': 'Via code', 'Email / SMS': 'Via code', 'Integrations (highlights)': 'GitHub, VS Code, JetBrains, massive training data', 'Hosting included': 'No', 'Custom domain': '', 'Pricing model': 'Subscription', 'Free tier': 'Limited/students', 'Paid tiers from (USD/mo)': '$10 (Individual); $19/user (Business)', 'Included credits (examples)': 'Business: usage limits', 'Overage / payg': 'Pro+: $0.04/request overage', 'Ease of use': 'High', 'Lock-in risk': 'Low', 'Reviews—highlights': 'Deep GitHub integration; massive training data; 26% productivity gains for newer devs', 'Reviews—pain points': 'Flat $10/month less flexible than usage-based; limited context vs newer tools', 'Official pricing': 'https://github.com/features/copilot', 'Official docs/features': 'https://docs.github.com/copilot', 'Last checked': '2026-01-19', 'Key sources': 'GitHub docs', 'Prototype fit': 'Medium', 'MVP fit': 'High', 'SaaS fit': 'High'},
    {'#': 12, 'Tool': 'ChatGPT (GPT-4/4.5)', 'Best for': 'General code generation; quick help; learning', 'Target user': 'Anyone coding, learners', 'Paradigm': 'Conversational AI', 'Stack transparency': 'High (shows code)', 'Typical stack / languages': 'All languages', 'Code export': 'Copy/paste', 'GitHub sync': 'No', 'Self-hosting possible': '', 'Visual editor': 'No', 'Code editor': 'No (chat interface)', 'Prompt + manual editing': 'Conversational', 'System-level instructions': 'Custom instructions', 'Figma / design import': 'Image input', 'Styling control level': '', 'Built-in database': 'No', 'External DB support': 'No', 'Auth built-in': 'No', 'RBAC': 'No', 'Workflows / background jobs': 'No', 'Webhooks': 'No', 'Payments': 'No', 'Email / SMS': 'No', 'Integrations (highlights)': 'Code Interpreter, plugins, web browsing', 'Hosting included': 'No', 'Custom domain': 'No', 'Pricing model': 'Subscription', 'Free tier': 'Yes (GPT-3.5)', 'Paid tiers from (USD/mo)': '$20 (Plus, GPT-4)', 'Included credits (examples)': 'Plus: GPT-4 access, higher limits', 'Overage / payg': 'Rate limits', 'Ease of use': 'Very High', 'Lock-in risk': 'Very Low', 'Reviews—highlights': 'Versatile; good for learning; quick code help; wide knowledge', 'Reviews—pain points': 'Not integrated IDE; copy/paste workflow; context limits', 'Official pricing': 'https://openai.com/pricing', 'Official docs/features': 'https://platform.openai.com/docs', 'Last checked': '2026-01-19', 'Key sources': 'OpenAI docs', 'Prototype fit': 'Medium', 'MVP fit': 'Low-Medium', 'SaaS fit': 'Low'},
    {'#': 13, 'Tool': 'Claude (Anthropic)', 'Best for': '200K context window; complex reasoning; long codebases', 'Target user': 'Developers with large codebases', 'Paradigm': 'Conversational AI', 'Stack transparency': 'High', 'Typical stack / languages': 'All languages', 'Code export': 'Copy/paste', 'GitHub sync': 'No', 'Self-hosting possible': '', 'Visual editor': 'No', 'Code editor': 'No (chat)', 'Prompt + manual editing': 'Conversational', 'System-level instructions': 'System prompts (API)', 'Figma / design import': 'Image input', 'Styling control level': '', 'Built-in database': 'No', 'External DB support': 'No', 'Auth built-in': 'No', 'RBAC': 'No', 'Workflows / background jobs': 'No', 'Webhooks': 'No', 'Payments': 'No', 'Email / SMS': 'No', 'Integrations (highlights)': 'Artifacts feature, 200K context, web search', 'Hosting included': 'No', 'Custom domain': 'No', 'Pricing model': 'Subscription', 'Free tier': 'Yes (limited)', 'Paid tiers from (USD/mo)': '$20 (Pro)', 'Included credits (examples)': 'Pro: higher usage limits', 'Overage / payg': 'Rate limits', 'Ease of use': 'Very High', 'Lock-in risk': 'Very Low', 'Reviews—highlights': 'Massive context window; excellent reasoning; developer-favorite for complex logic', 'Reviews—pain points': 'Not integrated IDE; conversational only', 'Official pricing': 'https://claude.ai/', 'Official docs/features': 'https://docs.anthropic.com/', 'Last checked': '2026-01-19', 'Key sources': 'Anthropic docs', 'Prototype fit': 'Medium', 'MVP fit': 'Low-Medium', 'SaaS fit': 'Low'},
    {'#': 14, 'Tool': 'Tabnine', 'Best for': 'Privacy-focused AI coding; on-premises deployment; no data training', 'Target user': 'Security-conscious enterprises, regulated industries', 'Paradigm': 'AI coding assistant (IDE extension)', 'Stack transparency': 'High', 'Typical stack / languages': 'All major languages', 'Code export': 'N/A (assists in code)', 'GitHub sync': 'Works with Git', 'Self-hosting possible': 'Yes (on-premises)', 'Visual editor': 'No', 'Code editor': 'Works in IDE', 'Prompt + manual editing': 'Yes', 'System-level instructions': 'Limited', 'Figma / design import': 'No', 'Styling control level': 'High (code)', 'Built-in database': 'No', 'External DB support': 'N/A', 'Auth built-in': 'No', 'RBAC': 'Enterprise features', 'Workflows / background jobs': 'Via code', 'Webhooks': 'Via code', 'Payments': 'Via code', 'Email / SMS': 'Via code', 'Integrations (highlights)': 'VS Code, JetBrains, on-prem deployment, private code models', 'Hosting included': 'No', 'Custom domain': 'N/A', 'Pricing model': 'Subscription', 'Free tier': 'Yes (basic)', 'Paid tiers from (USD/mo)': '$12 (Pro)', 'Included credits (examples)': 'Enterprise: custom on-prem', 'Overage / payg': 'N/A', 'Ease of use': 'High', 'Lock-in risk': 'Very Low', 'Reviews—highlights': 'Privacy-focused; no code training; on-premises option; SOC 2 compliant', 'Reviews—pain points': 'Fewer features than newer tools; smaller context vs Claude/GPT-4', 'Official pricing': 'https://www.tabnine.com/pricing', 'Official docs/features': 'https://www.tabnine.com/', 'Last checked': '2026-01-19', 'Key sources': 'Official docs', 'Prototype fit': 'Medium', 'MVP fit': 'High', 'SaaS fit': 'High'},
    {'#': 15, 'Tool': 'Continue', 'Best for': 'Open-source AI coding; local models; privacy-first', 'Target user': 'Privacy-focused developers, local LLM users', 'Paradigm': 'Open-source IDE extension', 'Stack transparency': 'Very High (open source)', 'Typical stack / languages': 'All languages', 'Code export': 'N/A', 'GitHub sync': 'Standard', 'Self-hosting possible': 'Yes (local models)', 'Visual editor': 'No', 'Code editor': 'Works in IDE', 'Prompt + manual editing': 'Yes', 'System-level instructions': 'Yes (customizable)', 'Figma / design import': 'No', 'Styling control level': 'High', 'Built-in database': 'No', 'External DB support': 'N/A', 'Auth built-in': 'No', 'RBAC': 'No', 'Workflows / background jobs': 'Via code', 'Webhooks': 'Via code', 'Payments': 'Via code', 'Email / SMS': 'Via code', 'Integrations (highlights)': 'Local models, Ollama, any LLM provider, VS Code', 'Hosting included': 'No', 'Custom domain': 'N/A', 'Pricing model': 'Free + BYOK (API)', 'Free tier': 'Yes (full features)', 'Paid tiers from (USD/mo)': 'Free (bring API keys)', 'Included credits (examples)': 'Use your own API keys', 'Overage / payg': 'N/A (your API costs)', 'Ease of use': 'Medium-High', 'Lock-in risk': 'Very Low', 'Reviews—highlights': 'Open-source; privacy-first; local models; fully customizable; no vendor lock-in', 'Reviews—pain points': 'Requires API key management; less polished than commercial tools', 'Official pricing': 'Free (open source)', 'Official docs/features': 'https://continue.dev/', 'Last checked': '2026-01-19', 'Key sources': 'GitHub, official docs', 'Prototype fit': 'Medium', 'MVP fit': 'High', 'SaaS fit': 'High'},
    {'#': 16, 'Tool': 'GitHub Spark', 'Best for': 'GitHub-native app building; rapid prototyping in GitHub ecosystem', 'Target user': 'GitHub users, teams in GitHub orgs', 'Paradigm': 'AI app builder (GitHub-integrated)', 'Stack transparency': 'High', 'Typical stack / languages': 'Web apps (GitHub-centric)', 'Code export': 'Yes (GitHub repos)', 'GitHub sync': 'Native (core feature)', 'Self-hosting possible': 'Yes', 'Visual editor': 'Some', 'Code editor': 'VS Code sync', 'Prompt + manual editing': 'Yes (hybrid)', 'System-level instructions': 'Prompting', 'Figma / design import': 'No', 'Styling control level': 'Medium-High', 'Built-in database': 'GitHub integration', 'External DB support': 'Via code', 'Auth built-in': 'GitHub OAuth', 'RBAC': 'GitHub permissions', 'Workflows / background jobs': 'GitHub Actions', 'Webhooks': 'GitHub webhooks', 'Payments': 'Via code', 'Email / SMS': 'Via code', 'Integrations (highlights)': 'GitHub Copilot, GitHub Actions, VS Code, Codespaces', 'Hosting included': 'GitHub Pages/workflows', 'Custom domain': 'Via GitHub', 'Pricing model': 'Requires Copilot Pro+', 'Free tier': 'No (needs Copilot subscription)', 'Paid tiers from (USD/mo)': '$39 (Copilot Pro+ required)', 'Included credits (examples)': 'Pro+: 374 Spark messages/month, 10 active apps', 'Overage / payg': 'Part of Copilot plan', 'Ease of use': 'Medium-High', 'Lock-in risk': 'Low (GitHub ecosystem)', 'Reviews—highlights': 'GitHub-native; secure in org; trackable; public preview (2025)', 'Reviews—pain points': 'Not mature yet; requires Copilot subscription; limited to GitHub users', 'Official pricing': 'Part of GitHub Copilot Pro+', 'Official docs/features': 'https://githubnext.com/projects/spark', 'Last checked': '2026-01-19', 'Key sources': 'GitHub Next, announcements', 'Prototype fit': 'High', 'MVP fit': 'Medium', 'SaaS fit': 'Medium'},
    {'#': 17, 'Tool': 'Superblocks (Clark AI)', 'Best for': 'Enterprise internal tools; AI with governance; secure app generation', 'Target user': 'Enterprise teams building internal apps', 'Paradigm': 'AI-native internal app builder with governance', 'Stack transparency': 'Medium-High', 'Typical stack / languages': 'Platform-managed with code access', 'Code export': 'Limited (platform focus)', 'GitHub sync': 'Yes (Git workflows)', 'Self-hosting possible': 'On-prem agent available', 'Visual editor': 'Yes (WYSIWYG + AI)', 'Code editor': 'Yes (synced with visual)', 'Prompt + manual editing': 'Yes (Clark AI + manual)', 'System-level instructions': 'Organizational standards/policies', 'Figma / design import': 'No', 'Styling control level': 'High', 'Built-in database': 'Connects to any', 'External DB support': 'Yes (any API/database)', 'Auth built-in': 'Yes (SSO, RBAC)', 'RBAC': 'Yes (enterprise-grade)', 'Workflows / background jobs': 'Yes', 'Webhooks': 'Yes', 'Payments': 'Via integrations', 'Email / SMS': 'Via integrations', 'Integrations (highlights)': 'Any API, databases, Git, CI/CD, SSO, audit logs, secret managers', 'Hosting included': 'Yes', 'Custom domain': 'Yes', 'Pricing model': 'Custom enterprise', 'Free tier': 'Demo available', 'Paid tiers from (USD/mo)': 'Custom (enterprise)', 'Included credits (examples)': 'Enterprise: unlimited within plan', 'Overage / payg': 'Custom contracts', 'Ease of use': 'Medium (enterprise focus)', 'Lock-in risk': 'Medium', 'Reviews—highlights': 'Enterprise governance; AI guardrails; SOC 2; centralized security; Clark AI agent', 'Reviews—pain points': 'Enterprise pricing; not for consumer apps; requires demo/sales', 'Official pricing': 'https://www.superblocks.com/pricing', 'Official docs/features': 'https://www.superblocks.com/', 'Last checked': '2026-01-19', 'Key sources': 'Official docs', 'Prototype fit': 'Low', 'MVP fit': 'Medium', 'SaaS fit': 'High (internal tools)'},
    {'#': 18, 'Tool': 'Devin (Cognition)', 'Best for': 'Autonomous AI software engineer; replacing junior dev tasks', 'Target user': 'Enterprise R&D, experimental teams', 'Paradigm': 'Autonomous AI software engineer', 'Stack transparency': 'High (learns codebase)', 'Typical stack / languages': 'All (learns from repos)', 'Code export': 'Yes (works in repos)', 'GitHub sync': 'Yes (integrates)', 'Self-hosting possible': 'Unclear', 'Visual editor': 'No', 'Code editor': 'Works with repos', 'Prompt + manual editing': 'Task-based instructions', 'System-level instructions': 'Task objectives', 'Figma / design import': 'No', 'Styling control level': 'Code-based', 'Built-in database': 'No', 'External DB support': 'Via code', 'Auth built-in': 'No', 'RBAC': 'No', 'Workflows / background jobs': 'Autonomous task execution', 'Webhooks': 'Via code', 'Payments': 'Via code', 'Email / SMS': 'Via code', 'Integrations (highlights)': 'Learns codebases, writes/debugs autonomously, runs terminal', 'Hosting included': 'No', 'Custom domain': 'N/A', 'Pricing model': 'Custom (enterprise/waitlist)', 'Free tier': 'No (limited access)', 'Paid tiers from (USD/mo)': 'Custom pricing', 'Included credits (examples)': 'Unclear (experimental)', 'Overage / payg': 'Custom', 'Ease of use': 'Complex (autonomous agent)', 'Lock-in risk': 'Low', 'Reviews—highlights': 'Autonomous coding; learns entire codebase; experimental cutting-edge', 'Reviews—pain points': 'Very limited access; experimental; high cost; not production-ready', 'Official pricing': 'https://www.cognition-labs.com/', 'Official docs/features': 'Limited public info', 'Last checked': '2026-01-19', 'Key sources': 'Announcements, demos', 'Prototype fit': 'Low', 'MVP fit': 'Low', 'SaaS fit': 'Low (experimental)'}
  ];

  const sourcesData = [
    {'Tool': 'Lovable', 'Primary official sources': 'Official docs, Reddit, G2, Product Hunt', 'Notes': 'Verified and merged: 2026-01-19'},
    {'Tool': 'Replit', 'Primary official sources': 'Official docs, blog, user reviews', 'Notes': 'Verified and merged: 2026-01-19'},
    {'Tool': 'Bolt.new', 'Primary official sources': 'StackBlitz docs, user reviews', 'Notes': 'Verified and merged: 2026-01-19'},
    {'Tool': 'Base44', 'Primary official sources': 'Official docs, acquisition news', 'Notes': 'Verified and merged: 2026-01-19'},
    {'Tool': 'Cursor', 'Primary official sources': 'Official docs, Reddit, user reviews', 'Notes': 'Verified and merged: 2026-01-19'},
    {'Tool': 'v0 by Vercel', 'Primary official sources': 'Official site, user reviews', 'Notes': 'Verified and merged: 2026-01-19'},
    {'Tool': 'Windsurf', 'Primary official sources': 'Official site, reviews', 'Notes': 'Verified and merged: 2026-01-19'},
    {'Tool': 'GitHub Copilot Workspace', 'Primary official sources': 'GitHub Next, user reviews', 'Notes': 'Verified and merged: 2026-01-19'},
    {'Tool': 'Webflow', 'Primary official sources': 'Official docs, design community', 'Notes': 'Verified and merged: 2026-01-19'},
    {'Tool': 'Bubble', 'Primary official sources': 'Official docs, no-code community', 'Notes': 'Verified and merged: 2026-01-19'},
    {'Tool': 'Zapier Interfaces', 'Primary official sources': 'Official docs, user reviews', 'Notes': 'Verified and merged: 2026-01-19'},
    {'Tool': 'FlutterFlow', 'Primary official sources': 'Official docs, Flutter community', 'Notes': 'Verified and merged: 2026-01-19'},
    {'Tool': 'Retool', 'Primary official sources': 'Official docs, enterprise reviews', 'Notes': 'Verified and merged: 2026-01-19'},
    {'Tool': 'Framer', 'Primary official sources': 'Official site, design community', 'Notes': 'Verified and merged: 2026-01-19'},
    {'Tool': 'Make (Integromat)', 'Primary official sources': 'Official docs, automation community', 'Notes': 'Verified and merged: 2026-01-19'},
    {'Tool': 'Glide', 'Primary official sources': 'Official docs, no-code community', 'Notes': 'Verified and merged: 2026-01-19'},
    {'Tool': 'Airtable', 'Primary official sources': 'Official docs, productivity community', 'Notes': 'Verified and merged: 2026-01-19'}
  ];

  const columns = Object.keys(comparisonData[0] || {});

  const handleFilterChange = (column, value) => {
    setColumnFilters(prev => ({
      ...prev,
      [column]: value
    }));
  };

  const clearFilter = (column) => {
    setColumnFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[column];
      return newFilters;
    });
  };

  const filteredData = useMemo(() => {
    return comparisonData.filter(row => {
      return Object.entries(columnFilters).every(([column, filterValue]) => {
        if (!filterValue) return true;
        const cellValue = String(row[column] || '').toLowerCase();
        return cellValue.includes(filterValue.toLowerCase());
      });
    });
  }, [columnFilters]);

  const activeFiltersCount = Object.values(columnFilters).filter(v => v).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-[1600px] mx-auto px-6 py-12 pt-24">
        {/* Header */}
        <div className="mb-8">
          <Link to={createPageUrl('Dashboard')}>
            <Button variant="ghost" className="mb-4">
              ← Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            AI Coding Tools Comparison
          </h1>
          <p className="text-slate-600">
            Comprehensive comparison of AI-powered development tools and platforms
          </p>
        </div>

        {/* Active Filters Summary */}
        {activeFiltersCount > 0 && (
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-slate-600">Active filters ({activeFiltersCount}):</span>
            {Object.entries(columnFilters).map(([column, value]) => 
              value && (
                <div key={column} className="flex items-center gap-1 bg-slate-200 px-3 py-1 rounded-full text-sm">
                  <span className="font-medium">{column}:</span>
                  <span>{value}</span>
                  <button
                    onClick={() => clearFilter(column)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setColumnFilters({})}
              className="text-xs"
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-slate-600">
            Showing {filteredData.length} of {comparisonData.length} tools
          </p>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                <tr>
                  {columns.map((column) => (
                    <th 
                      key={column} 
                      className={`text-left p-3 ${column === '#' ? 'w-16 min-w-[60px]' : 'min-w-[200px]'} resize-x overflow-auto`}
                      style={{ position: 'relative' }}
                    >
                      <div className="space-y-2">
                        <div className="font-semibold text-sm text-slate-900">
                          {column}
                        </div>
                        <div className="relative">
                          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                          <Input
                            type="text"
                            placeholder={`Filter ${column}...`}
                            value={columnFilters[column] || ''}
                            onChange={(e) => handleFilterChange(column, e.target.value)}
                            className="h-8 pl-7 pr-7 text-xs border-slate-200"
                          />
                          {columnFilters[column] && (
                            <button
                              onClick={() => clearFilter(column)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-slate-50 transition-colors">
                    {columns.map((column) => (
                      <td key={column} className={`p-3 text-sm text-slate-700 ${column === '#' ? 'w-16' : 'min-w-[200px]'}`}>
                        <div className={column === '#' ? '' : 'line-clamp-3'}>
                          {row[column] || '-'}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sources Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Sources</h2>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left p-4 font-semibold text-sm text-slate-900">Tool</th>
                    <th className="text-left p-4 font-semibold text-sm text-slate-900">Primary Official Sources</th>
                    <th className="text-left p-4 font-semibold text-sm text-slate-900">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sourcesData.map((row, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-sm font-medium text-slate-900">{row.Tool}</td>
                      <td className="p-4 text-sm text-slate-700">{row['Primary official sources']}</td>
                      <td className="p-4 text-sm text-slate-600">{row.Notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}