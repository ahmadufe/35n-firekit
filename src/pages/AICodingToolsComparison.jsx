import React, { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AICodingToolsComparison() {
  const [columnFilters, setColumnFilters] = useState({});

  const comparisonData = [
    {'Tool': 'Lovable', 'Best for': 'Fastest MVP creation; beautiful UI with Supabase backend; GitHub export', 'Target user': 'Non-technical founders, agencies, developers wanting rapid prototyping', 'Paradigm': 'AI code-generation platform (full export, owns code)', 'Stack transparency': 'Very High (code visible + GitHub export)', 'Typical stack / languages': 'React, Vite, TypeScript, Tailwind CSS; Supabase (PostgreSQL)', 'Code export': 'Yes', 'GitHub sync': 'Yes', 'Self-hosting possible': 'Yes', 'Visual editor': 'Limited (select tool)', 'Code editor': 'Yes', 'Prompt + manual editing': 'Yes', 'System-level instructions': 'Yes (project instructions, style prefs)', 'Figma / design import': 'Can reference images', 'Styling control level': 'High', 'Built-in database': 'No', 'External DB support': 'Yes (Supabase native)', 'Auth built-in': 'Via Supabase', 'RBAC': 'Via Supabase', 'Workflows / background jobs': 'Via Supabase/external', 'Webhooks': 'Via external', 'Payments': 'Via Stripe/external', 'Email / SMS': 'Via external', 'Integrations (highlights)': 'Supabase, GitHub, any API', 'Hosting included': 'Yes (Lovable Cloud)', 'Custom domain': 'Yes', 'Pricing model': 'Credit-based messages', 'Free tier': 'Yes (5/day, 25/month)', 'Paid tiers from (USD/mo)': '$21 (Pro)', 'Included credits (examples)': 'Pro: 100/month; rollover', 'Overage / payg': 'Upgrade tier', 'Ease of use': 'Very High', 'Lock-in risk': 'Low-Medium', 'Reviews—highlights': '£13.50M ARR in 3 months; beautiful UI; GPT Engineer creators; fastest growth', 'Reviews—pain points': 'Credit burn on iterations; breaks when complex; frontend-focused', 'Official pricing': 'https://lovable.dev/pricing', 'Official docs/features': 'https://docs.lovable.dev/', 'Last checked': '2026-01-19', 'Key sources': 'Official docs, Reddit, G2, Product Hunt', 'Prototype fit': 'Very High', 'MVP fit': 'Very High', 'SaaS fit': 'High'},
    {'Tool': 'Replit', 'Best for': 'Complete cloud IDE with AI Agent; multi-language; educational', 'Target user': 'Developers, students, technical PMs, teams', 'Paradigm': 'Cloud IDE + AI agent + hosting', 'Stack transparency': 'Very High', 'Typical stack / languages': 'Python, JS, TS, Java, C++, Go, Rust, all languages', 'Code export': 'Yes (Git-based)', 'GitHub sync': 'Yes', 'Self-hosting possible': 'Yes', 'Visual editor': 'No (code-first)', 'Code editor': 'Yes (full IDE)', 'Prompt + manual editing': 'Yes', 'System-level instructions': 'Agent instructions', 'Figma / design import': 'No', 'Styling control level': 'Very High (code)', 'Built-in database': 'Yes (PostgreSQL)', 'External DB support': 'Yes (any)', 'Auth built-in': 'Via libraries', 'RBAC': 'Via code', 'Workflows / background jobs': 'Via code', 'Webhooks': 'Via code', 'Payments': 'Via code (Stripe, etc.)', 'Email / SMS': 'Via code', 'Integrations (highlights)': 'ChatGPT, PostgreSQL, any API, npm', 'Hosting included': 'Yes', 'Custom domain': 'Yes', 'Pricing model': 'Subscription + effort-based usage', 'Free tier': 'Yes (limited Agent, 10 apps)', 'Paid tiers from (USD/mo)': '$20 (Core)', 'Included credits (examples)': 'Core: $25/month; Teams: $40/user', 'Overage / payg': 'Yes (usage-based)', 'Ease of use': 'Medium (full IDE)', 'Lock-in risk': 'Very Low', 'Reviews—highlights': 'Complete environment; great for learning; real-time collab; Agent powerful', 'Reviews—pain points': 'Unpredictable costs; effort-based confusing; can get expensive', 'Official pricing': 'https://replit.com/pricing', 'Official docs/features': 'https://docs.replit.com/', 'Last checked': '2026-01-19', 'Key sources': 'Official docs, blog, user reviews', 'Prototype fit': 'High', 'MVP fit': 'Very High', 'SaaS fit': 'High'},
    {'Tool': 'Bolt.new', 'Best for': 'Browser-based full-stack prototyping; zero-setup; hackathons', 'Target user': 'Developers, designers, hackathon participants', 'Paradigm': 'Browser code generation + WebContainers', 'Stack transparency': 'Very High', 'Typical stack / languages': 'React, Node.js, Tailwind, Vite, Next.js, Astro, Svelte, Vue', 'Code export': 'Yes (GitHub, Vercel/Netlify)', 'GitHub sync': 'Yes', 'Self-hosting possible': 'Yes', 'Visual editor': 'Some (prompt + preview)', 'Code editor': 'Yes (browser-based)', 'Prompt + manual editing': 'Yes', 'System-level instructions': 'Discussion Mode', 'Figma / design import': 'Not primary', 'Styling control level': 'High (Tailwind)', 'Built-in database': 'No', 'External DB support': 'Yes (Supabase, Firebase)', 'Auth built-in': 'External', 'RBAC': 'Implementation dependent', 'Workflows / background jobs': 'Via code/external', 'Webhooks': 'Via code', 'Payments': 'Stripe supported', 'Email / SMS': 'Via integrations', 'Integrations (highlights)': 'Supabase, Netlify, n8n.io, Stripe, GitHub', 'Hosting included': 'Yes (preview + deploy)', 'Custom domain': 'Via platform', 'Pricing model': 'Token-based', 'Free tier': 'Yes (150K/day, 1M/month)', 'Paid tiers from (USD/mo)': '$20 (10M tokens)', 'Included credits (examples)': '$20: 10M; $60: 30M; $200: 120M', 'Overage / payg': 'Token reloads ($30/10M)', 'Ease of use': 'Very High', 'Lock-in risk': 'Low', 'Reviews—highlights': 'Zero-setup; WebContainers impressive; great for demos; StackBlitz', 'Reviews—pain points': 'Token costs spike; struggles >15-20 components; 31% success on enterprise features', 'Official pricing': 'https://bolt.new/pricing', 'Official docs/features': 'https://support.bolt.new/', 'Last checked': '2026-01-19', 'Key sources': 'StackBlitz docs, user reviews', 'Prototype fit': 'Very High', 'MVP fit': 'High', 'SaaS fit': 'Medium'},
    {'Tool': 'Base44', 'Best for': 'All-in-one business apps; built-in DB/auth/email; non-technical users', 'Target user': 'Non-technical builders, business operators', 'Paradigm': 'Integrated AI app builder platform', 'Stack transparency': 'Medium-High', 'Typical stack / languages': 'React, TypeScript, Tailwind (managed)', 'Code export': 'Yes (GitHub, Builder+)', 'GitHub sync': 'Yes (Builder+)', 'Self-hosting possible': 'Limited (code export enables)', 'Visual editor': 'Prompt + platform UI', 'Code editor': 'Yes (paid tiers)', 'Prompt + manual editing': 'Yes', 'System-level instructions': 'Discussion Mode, styling instructions', 'Figma / design import': 'Can reference', 'Styling control level': 'Medium', 'Built-in database': 'Yes', 'External DB support': 'Some connectors', 'Auth built-in': 'Yes', 'RBAC': 'Yes', 'Workflows / background jobs': 'Yes', 'Webhooks': 'Via integrations', 'Payments': 'Yes (Stripe)', 'Email / SMS': 'Yes (built-in)', 'Integrations (highlights)': 'Salesforce, Notion, Slack, GDrive, Sheets, Zapier, Stripe', 'Hosting included': 'Yes', 'Custom domain': 'Yes', 'Pricing model': 'Message + Integration credits', 'Free tier': 'Yes (5/day, 25/month, 500 integration)', 'Paid tiers from (USD/mo)': '$16-20 (Starter)', 'Included credits (examples)': 'Starter: 100 msg + 2K int; Builder: 250 + 10K; Pro: 500 + 20K', 'Overage / payg': 'Upgrade tier', 'Ease of use': 'Very High', 'Lock-in risk': 'Medium-High', 'Reviews—highlights': 'Complete solution; Wix acquired for ~$80M; business-ready; no external deps', 'Reviews—pain points': 'Platform coupling; integration credits surprise; UI less polished initially', 'Official pricing': 'https://base44.com/pricing', 'Official docs/features': 'https://base44.com/features', 'Last checked': '2026-01-19', 'Key sources': 'Official docs, acquisition news', 'Prototype fit': 'High', 'MVP fit': 'Very High', 'SaaS fit': 'High'},
    {'Tool': 'Cursor', 'Best for': 'AI-native code editor; codebase-aware; multi-model support', 'Target user': 'Developers, power users, VS Code lovers', 'Paradigm': 'AI-native IDE (VS Code fork)', 'Stack transparency': 'Very High', 'Typical stack / languages': 'All languages (VS Code support)', 'Code export': 'Yes (full access)', 'GitHub sync': 'Yes (deep integration)', 'Self-hosting possible': 'Yes', 'Visual editor': 'No (code-first)', 'Code editor': 'Yes (full IDE)', 'Prompt + manual editing': 'Yes', 'System-level instructions': 'Codebase indexing, @ mentions', 'Figma / design import': 'No', 'Styling control level': 'Very High (code)', 'Built-in database': 'No', 'External DB support': 'Via code', 'Auth built-in': 'No', 'RBAC': 'No', 'Workflows / background jobs': 'Via code', 'Webhooks': 'Via code', 'Payments': 'Via code', 'Email / SMS': 'Via code', 'Integrations (highlights)': 'GitHub, GPT-4.1, Claude Opus 4.1, Sonnet 4.5, Gemini 2.5', 'Hosting included': 'No (developer choice)', 'Custom domain': 'N/A (IDE tool)', 'Pricing model': 'Subscription + usage pool', 'Free tier': 'Yes (2K completions, 50 slow)', 'Paid tiers from (USD/mo)': '$20 (Pro)', 'Included credits (examples)': 'Pro: $20 pool; Pro+: $60; Ultra: $200; Teams: $40/user', 'Overage / payg': 'Yes (at API rates)', 'Ease of use': 'Medium-High', 'Lock-in risk': 'Very Low', 'Reviews—highlights': 'Powerful codebase awareness; multi-model; VS Code familiarity; frontier models', 'Reviews—pain points': 'Pricing confusion (June 2025); learning curve; unpredictable costs; Max Mode expensive', 'Official pricing': 'https://cursor.com/pricing', 'Official docs/features': 'https://cursor.com/blog/', 'Last checked': '2026-01-19', 'Key sources': 'Official docs, Reddit, user reviews', 'Prototype fit': 'High', 'MVP fit': 'Very High', 'SaaS fit': 'Very High'},
    {'Tool': 'v0 by Vercel', 'Best for': 'UI component generation; frontend-first; Vercel ecosystem', 'Target user': 'Frontend developers, designers, Vercel users', 'Paradigm': 'AI component generator + preview', 'Stack transparency': 'Very High', 'Typical stack / languages': 'React, Next.js, Tailwind CSS, shadcn/ui', 'Code export': 'Yes', 'GitHub sync': 'Via Vercel', 'Self-hosting possible': 'Yes', 'Visual editor': 'Preview + variations', 'Code editor': 'Yes', 'Prompt + manual editing': 'Yes', 'System-level instructions': 'Limited', 'Figma / design import': 'Can reference', 'Styling control level': 'Very High', 'Built-in database': 'No', 'External DB support': 'Via Next.js', 'Auth built-in': 'No', 'RBAC': 'No', 'Workflows / background jobs': 'Via Next.js', 'Webhooks': 'Via code', 'Payments': 'Via code', 'Email / SMS': 'Via code', 'Integrations (highlights)': 'Vercel deployment, shadcn/ui', 'Hosting included': 'Via Vercel', 'Custom domain': 'Via Vercel', 'Pricing model': 'Credit-based generations', 'Free tier': 'Yes (200 credits)', 'Paid tiers from (USD/mo)': '$20 (Premium)', 'Included credits (examples)': 'Premium: 5,000 credits', 'Overage / payg': 'Upgrade tier', 'Ease of use': 'Very High', 'Lock-in risk': 'Low', 'Reviews—highlights': 'Beautiful components; Vercel polish; variations helpful', 'Reviews—pain points': 'Frontend-only; limited full-app; Vercel ecosystem lock', 'Official pricing': 'https://v0.dev/pricing', 'Official docs/features': 'https://v0.dev/', 'Last checked': '2026-01-19', 'Key sources': 'Official site, user reviews', 'Prototype fit': 'Very High', 'MVP fit': 'Medium', 'SaaS fit': 'Medium'},
    {'Tool': 'Windsurf', 'Best for': 'Agentic IDE; copilot++; deep codebase understanding', 'Target user': 'Developers, power coders', 'Paradigm': 'AI-native IDE (VS Code fork)', 'Stack transparency': 'Very High', 'Typical stack / languages': 'All languages', 'Code export': 'Yes (full access)', 'GitHub sync': 'Yes', 'Self-hosting possible': 'Yes', 'Visual editor': 'No', 'Code editor': 'Yes (full IDE)', 'Prompt + manual editing': 'Yes', 'System-level instructions': 'Cascade (agentic flow)', 'Figma / design import': 'No', 'Styling control level': 'Very High', 'Built-in database': 'No', 'External DB support': 'Via code', 'Auth built-in': 'No', 'RBAC': 'No', 'Workflows / background jobs': 'Via code', 'Webhooks': 'Via code', 'Payments': 'Via code', 'Email / SMS': 'Via code', 'Integrations (highlights)': 'Codeium models, VS Code extensions', 'Hosting included': 'No', 'Custom domain': 'N/A', 'Pricing model': 'Subscription', 'Free tier': 'Yes (unlimited basic)', 'Paid tiers from (USD/mo)': '$10 (Pro)', 'Included credits (examples)': 'Pro: faster models, higher context', 'Overage / payg': 'No overage', 'Ease of use': 'Medium-High', 'Lock-in risk': 'Very Low', 'Reviews—highlights': 'Cascade mode powerful; fast; good UX; Codeium backing', 'Reviews—pain points': 'New tool; smaller community; less mature', 'Official pricing': 'https://codeium.com/windsurf', 'Official docs/features': 'https://codeium.com/windsurf', 'Last checked': '2026-01-19', 'Key sources': 'Official site, reviews', 'Prototype fit': 'High', 'MVP fit': 'Very High', 'SaaS fit': 'Very High'},
    {'Tool': 'GitHub Copilot Workspace', 'Best for': 'GitHub-native AI development; planning + coding', 'Target user': 'Developers, GitHub users', 'Paradigm': 'AI development environment', 'Stack transparency': 'Very High', 'Typical stack / languages': 'All languages (GitHub support)', 'Code export': 'Yes (GitHub native)', 'GitHub sync': 'Yes (native)', 'Self-hosting possible': 'Yes', 'Visual editor': 'No', 'Code editor': 'Yes (browser + IDE)', 'Prompt + manual editing': 'Yes', 'System-level instructions': 'Task-based specifications', 'Figma / design import': 'No', 'Styling control level': 'Very High', 'Built-in database': 'No', 'External DB support': 'Via code', 'Auth built-in': 'No', 'RBAC': 'No', 'Workflows / background jobs': 'GitHub Actions', 'Webhooks': 'GitHub webhooks', 'Payments': 'Via code', 'Email / SMS': 'Via code', 'Integrations (highlights)': 'GitHub ecosystem, Actions, Issues', 'Hosting included': 'No', 'Custom domain': 'N/A', 'Pricing model': 'Technical Preview (free)', 'Free tier': 'Yes (Technical Preview)', 'Paid tiers from (USD/mo)': 'TBD', 'Included credits (examples)': 'N/A (preview)', 'Overage / payg': 'TBD', 'Ease of use': 'Medium', 'Lock-in risk': 'Low', 'Reviews—highlights': 'Planning mode excellent; GitHub integration seamless', 'Reviews—pain points': 'Early stage; limited availability; pricing unknown', 'Official pricing': 'https://github.com/features/copilot', 'Official docs/features': 'https://githubnext.com/projects/copilot-workspace', 'Last checked': '2026-01-19', 'Key sources': 'GitHub Next, user reviews', 'Prototype fit': 'High', 'MVP fit': 'Very High', 'SaaS fit': 'Very High'},
    {'Tool': 'Webflow', 'Best for': 'Visual website builder; design-first; marketing sites', 'Target user': 'Designers, agencies, marketers', 'Paradigm': 'Visual website builder + CMS', 'Stack transparency': 'Low (visual, no code access)', 'Typical stack / languages': 'Proprietary (outputs HTML/CSS/JS)', 'Code export': 'Limited (Enterprise)', 'GitHub sync': 'No', 'Self-hosting possible': 'No', 'Visual editor': 'Yes (primary)', 'Code editor': 'Custom code embeds', 'Prompt + manual editing': 'No AI (design-first)', 'System-level instructions': 'N/A', 'Figma / design import': 'Limited plugins', 'Styling control level': 'Very High (visual)', 'Built-in database': 'Yes (CMS)', 'External DB support': 'Via integrations', 'Auth built-in': 'Yes (memberships)', 'RBAC': 'Yes', 'Workflows / background jobs': 'Via Zapier/Make', 'Webhooks': 'Yes', 'Payments': 'Yes (Stripe, ecommerce)', 'Email / SMS': 'Via integrations', 'Integrations (highlights)': 'Zapier, Google Analytics, Mailchimp, Stripe', 'Hosting included': 'Yes', 'Custom domain': 'Yes', 'Pricing model': 'Site-based subscription', 'Free tier': 'Yes (2 projects, webflow.io)', 'Paid tiers from (USD/mo)': '$14 (Basic site)', 'Included credits (examples)': 'Basic: 1 site; CMS: 2K items; Business: 10K', 'Overage / payg': 'Upgrade tier', 'Ease of use': 'High (designers)', 'Lock-in risk': 'Very High', 'Reviews—highlights': 'Best visual builder; design control; CMS powerful; agencies love it', 'Reviews—pain points': 'No code export (most tiers); expensive scaling; heavy platform lock-in', 'Official pricing': 'https://webflow.com/pricing', 'Official docs/features': 'https://university.webflow.com/', 'Last checked': '2026-01-19', 'Key sources': 'Official docs, design community', 'Prototype fit': 'High (web only)', 'MVP fit': 'High (web only)', 'SaaS fit': 'Medium'},
    {'Tool': 'Bubble', 'Best for': 'No-code full-stack apps; visual workflows; MVP builders', 'Target user': 'Non-technical founders, citizen developers', 'Paradigm': 'Visual no-code platform', 'Stack transparency': 'Very Low (visual, no code)', 'Typical stack / languages': 'Proprietary (no code access)', 'Code export': 'No', 'GitHub sync': 'No', 'Self-hosting possible': 'No', 'Visual editor': 'Yes (primary)', 'Code editor': 'Plugins only', 'Prompt + manual editing': 'No (visual workflows)', 'System-level instructions': 'N/A', 'Figma / design import': 'Manual recreation', 'Styling control level': 'Medium (visual)', 'Built-in database': 'Yes', 'External DB support': 'Via plugins', 'Auth built-in': 'Yes', 'RBAC': 'Yes', 'Workflows / background jobs': 'Yes (visual)', 'Webhooks': 'Yes', 'Payments': 'Yes (Stripe)', 'Email / SMS': 'Yes', 'Integrations (highlights)': 'Stripe, SendGrid, AWS, plugins marketplace', 'Hosting included': 'Yes', 'Custom domain': 'Yes', 'Pricing model': 'Workload units + capacity', 'Free tier': 'Yes (development only)', 'Paid tiers from (USD/mo)': '$29 (Starter)', 'Included credits (examples)': 'Starter: basic capacity; Growth: higher; Team/Production scale', 'Overage / payg': 'Additional capacity units', 'Ease of use': 'Medium (learning curve)', 'Lock-in risk': 'Very High', 'Reviews—highlights': 'Powerful no-code; full-stack; large community; marketplace', 'Reviews—pain points': 'Steep learning curve; performance issues at scale; locked in; workload units confusing', 'Official pricing': 'https://bubble.io/pricing', 'Official docs/features': 'https://bubble.io/how-to-build', 'Last checked': '2026-01-19', 'Key sources': 'Official docs, no-code community', 'Prototype fit': 'High', 'MVP fit': 'High', 'SaaS fit': 'Medium'},
    {'Tool': 'Zapier Interfaces', 'Best for': 'Simple internal tools; automation-connected UIs', 'Target user': 'Business users, operations teams', 'Paradigm': 'Form/page builder + automation', 'Stack transparency': 'Very Low', 'Typical stack / languages': 'Proprietary (no code)', 'Code export': 'No', 'GitHub sync': 'No', 'Self-hosting possible': 'No', 'Visual editor': 'Yes (drag-drop)', 'Code editor': 'No', 'Prompt + manual editing': 'AI assistant (limited)', 'System-level instructions': 'N/A', 'Figma / design import': 'No', 'Styling control level': 'Low (templates)', 'Built-in database': 'Yes (Tables)', 'External DB support': 'Via Zapier connections', 'Auth built-in': 'Basic (links, passwords)', 'RBAC': 'Limited', 'Workflows / background jobs': 'Yes (Zapier automation)', 'Webhooks': 'Yes (Zapier)', 'Payments': 'Via integrations', 'Email / SMS': 'Yes (Zapier)', 'Integrations (highlights)': '7,000+ Zapier apps', 'Hosting included': 'Yes', 'Custom domain': 'No (zapier.app)', 'Pricing model': 'Interface + automation tasks', 'Free tier': 'Yes (limited)', 'Paid tiers from (USD/mo)': '$20 (Starter)', 'Included credits (examples)': 'Starter: 750 tasks; Pro: 2K; Team: 50K', 'Overage / payg': 'Task packs', 'Ease of use': 'Very High', 'Lock-in risk': 'Very High', 'Reviews—highlights': 'Easy internal tools; Zapier integrations; fast setup', 'Reviews—pain points': 'Limited customization; not for customer-facing; basic UI; expensive tasks', 'Official pricing': 'https://zapier.com/pricing', 'Official docs/features': 'https://zapier.com/interfaces', 'Last checked': '2026-01-19', 'Key sources': 'Official docs, user reviews', 'Prototype fit': 'High (internal)', 'MVP fit': 'Low-Medium', 'SaaS fit': 'Low'},
    {'Tool': 'FlutterFlow', 'Best for': 'Mobile-first apps; cross-platform; Firebase native', 'Target user': 'Mobile developers, agencies, startups', 'Paradigm': 'Visual Flutter builder', 'Stack transparency': 'High (Flutter code)', 'Typical stack / languages': 'Flutter (Dart)', 'Code export': 'Yes', 'GitHub sync': 'Yes (Pro+)', 'Self-hosting possible': 'Yes', 'Visual editor': 'Yes (primary)', 'Code editor': 'Custom code support', 'Prompt + manual editing': 'AI features (limited)', 'System-level instructions': 'Limited', 'Figma / design import': 'Yes (plugin)', 'Styling control level': 'High (visual + code)', 'Built-in database': 'No', 'External DB support': 'Yes (Firebase, Supabase)', 'Auth built-in': 'Via Firebase', 'RBAC': 'Via Firebase', 'Workflows / background jobs': 'Via backend', 'Webhooks': 'Via backend', 'Payments': 'Yes (Stripe, RevenueCat)', 'Email / SMS': 'Via integrations', 'Integrations (highlights)': 'Firebase, Supabase, Stripe, RevenueCat, APIs', 'Hosting included': 'Via platforms (Firebase, etc.)', 'Custom domain': 'Via Firebase/web', 'Pricing model': 'Subscription (projects)', 'Free tier': 'Yes (1 project, no export)', 'Paid tiers from (USD/mo)': '$30 (Standard)', 'Included credits (examples)': 'Standard: 5 projects; Pro: 15; Teams: org features', 'Overage / payg': 'Add projects', 'Ease of use': 'Medium', 'Lock-in risk': 'Low-Medium', 'Reviews—highlights': 'Best for mobile; Flutter output; Figma import; mature platform', 'Reviews—pain points': 'Learning curve; mobile-focused; web support limited', 'Official pricing': 'https://flutterflow.io/pricing', 'Official docs/features': 'https://docs.flutterflow.io/', 'Last checked': '2026-01-19', 'Key sources': 'Official docs, Flutter community', 'Prototype fit': 'High (mobile)', 'MVP fit': 'Very High (mobile)', 'SaaS fit': 'High (mobile)'},
    {'Tool': 'Retool', 'Best for': 'Internal tools; dashboards; CRUD apps; enterprise', 'Target user': 'Developers, ops teams, enterprises', 'Paradigm': 'Low-code internal tool builder', 'Stack transparency': 'Medium (components + JS)', 'Typical stack / languages': 'React components + JavaScript', 'Code export': 'No', 'GitHub sync': 'No', 'Self-hosting possible': 'Yes (Enterprise)', 'Visual editor': 'Yes (drag-drop)', 'Code editor': 'JavaScript expressions', 'Prompt + manual editing': 'Limited AI', 'System-level instructions': 'N/A', 'Figma / design import': 'No', 'Styling control level': 'Medium', 'Built-in database': 'Yes (Retool DB)', 'External DB support': 'Yes (extensive)', 'Auth built-in': 'Yes', 'RBAC': 'Yes (detailed)', 'Workflows / background jobs': 'Yes', 'Webhooks': 'Yes', 'Payments': 'Via integrations', 'Email / SMS': 'Via integrations', 'Integrations (highlights)': 'PostgreSQL, MySQL, MongoDB, REST, GraphQL, AWS, 100+', 'Hosting included': 'Yes (cloud)', 'Custom domain': 'Yes (paid)', 'Pricing model': 'Per-user + usage', 'Free tier': 'Yes (5 users, limited)', 'Paid tiers from (USD/mo)': '$10/user (Team)', 'Included credits (examples)': 'Team: $10/user; Business: $50/user; Enterprise: custom', 'Overage / payg': 'Additional users', 'Ease of use': 'Medium-High', 'Lock-in risk': 'High', 'Reviews—highlights': 'Best for internal tools; DB connectors excellent; enterprise features', 'Reviews—pain points': 'Not for customer-facing; expensive at scale; lock-in', 'Official pricing': 'https://retool.com/pricing', 'Official docs/features': 'https://docs.retool.com/', 'Last checked': '2026-01-19', 'Key sources': 'Official docs, enterprise reviews', 'Prototype fit': 'High (internal)', 'MVP fit': 'Medium (internal)', 'SaaS fit': 'Low'},
    {'Tool': 'Framer', 'Best for': 'Design-to-live websites; marketing sites; portfolios', 'Target user': 'Designers, agencies, creatives', 'Paradigm': 'Design tool + website builder', 'Stack transparency': 'Low (design-first)', 'Typical stack / languages': 'React (hidden), Framer Motion', 'Code export': 'No', 'GitHub sync': 'No', 'Self-hosting possible': 'No', 'Visual editor': 'Yes (design canvas)', 'Code editor': 'Code overrides', 'Prompt + manual editing': 'AI site generator', 'System-level instructions': 'Limited', 'Figma / design import': 'Limited copy/paste', 'Styling control level': 'Very High (design)', 'Built-in database': 'Yes (CMS)', 'External DB support': 'Via plugins', 'Auth built-in': 'No', 'RBAC': 'No', 'Workflows / background jobs': 'No', 'Webhooks': 'Limited', 'Payments': 'Via embeds', 'Email / SMS': 'Via integrations', 'Integrations (highlights)': 'Mailchimp, Google Analytics, embeds', 'Hosting included': 'Yes', 'Custom domain': 'Yes', 'Pricing model': 'Site-based', 'Free tier': 'Yes (framer.website)', 'Paid tiers from (USD/mo)': '$5 (Mini)', 'Included credits (examples)': 'Mini: 1 site; Basic: 3; Pro: 10; unlimited pages', 'Overage / payg': 'Add sites', 'Ease of use': 'Very High (designers)', 'Lock-in risk': 'Very High', 'Reviews—highlights': 'Beautiful output; designer-friendly; fast prototyping', 'Reviews—pain points': 'Limited functionality; marketing-focused; no backend; lock-in', 'Official pricing': 'https://www.framer.com/pricing/', 'Official docs/features': 'https://www.framer.com/features/', 'Last checked': '2026-01-19', 'Key sources': 'Official site, design community', 'Prototype fit': 'Very High (web)', 'MVP fit': 'Medium (web)', 'SaaS fit': 'Low'},
    {'Tool': 'Make (Integromat)', 'Best for': 'Visual automation; complex workflows; integrations', 'Target user': 'Business users, ops teams, power users', 'Paradigm': 'Visual automation platform', 'Stack transparency': 'Very Low', 'Typical stack / languages': 'Proprietary (visual)', 'Code export': 'No', 'GitHub sync': 'No', 'Self-hosting possible': 'No', 'Visual editor': 'Yes (flow builder)', 'Code editor': 'No', 'Prompt + manual editing': 'No', 'System-level instructions': 'N/A', 'Figma / design import': 'No', 'Styling control level': 'N/A (automation)', 'Built-in database': 'Yes (Data store)', 'External DB support': 'Via connectors', 'Auth built-in': 'N/A', 'RBAC': 'Team features', 'Workflows / background jobs': 'Yes (core feature)', 'Webhooks': 'Yes', 'Payments': 'Via integrations', 'Email / SMS': 'Yes', 'Integrations (highlights)': '1,800+ apps, HTTP, custom APIs', 'Hosting included': 'Yes', 'Custom domain': 'N/A', 'Pricing model': 'Operations-based', 'Free tier': 'Yes (1K ops/month)', 'Paid tiers from (USD/mo)': '$9 (Core)', 'Included credits (examples)': 'Core: 10K ops; Pro: 10K base; Teams: 10K/user', 'Overage / payg': 'Additional ops packs', 'Ease of use': 'Medium', 'Lock-in risk': 'High', 'Reviews—highlights': 'Powerful workflows; better than Zapier for complex; visual debugging', 'Reviews—pain points': 'Steeper learning curve; operations pricing confusing', 'Official pricing': 'https://www.make.com/en/pricing', 'Official docs/features': 'https://www.make.com/en/help', 'Last checked': '2026-01-19', 'Key sources': 'Official docs, automation community', 'Prototype fit': 'Low (automation)', 'MVP fit': 'Low (automation)', 'SaaS fit': 'Low (automation)'},
    {'Tool': 'Glide', 'Best for': 'Simple apps from spreadsheets; non-technical builders', 'Target user': 'Business users, educators, small teams', 'Paradigm': 'Spreadsheet-to-app builder', 'Stack transparency': 'Very Low', 'Typical stack / languages': 'Proprietary (no code)', 'Code export': 'No', 'GitHub sync': 'No', 'Self-hosting possible': 'No', 'Visual editor': 'Yes (template-based)', 'Code editor': 'No', 'Prompt + manual editing': 'AI features (limited)', 'System-level instructions': 'N/A', 'Figma / design import': 'No', 'Styling control level': 'Low (templates)', 'Built-in database': 'Yes (Glide Tables)', 'External DB support': 'Google Sheets, Excel, Airtable', 'Auth built-in': 'Yes', 'RBAC': 'Yes', 'Workflows / background jobs': 'Limited (actions)', 'Webhooks': 'Yes', 'Payments': 'Via integrations', 'Email / SMS': 'Via integrations', 'Integrations (highlights)': 'Google Sheets, Airtable, Stripe, Zapier, Make', 'Hosting included': 'Yes', 'Custom domain': 'Yes (paid)', 'Pricing model': 'User + updates-based', 'Free tier': 'Yes (limited)', 'Paid tiers from (USD/mo)': '$25 (Maker)', 'Included credits (examples)': 'Maker: unlimited users; Team: more updates; Business: white label', 'Overage / payg': 'Update packs', 'Ease of use': 'Very High', 'Lock-in risk': 'High', 'Reviews—highlights': 'Easiest no-code; spreadsheet-native; fast setup', 'Reviews—pain points': 'Limited customization; mobile-first (web basic); update limits confusing', 'Official pricing': 'https://www.glideapps.com/pricing', 'Official docs/features': 'https://www.glideapps.com/', 'Last checked': '2026-01-19', 'Key sources': 'Official docs, no-code community', 'Prototype fit': 'High (simple)', 'MVP fit': 'Medium (simple)', 'SaaS fit': 'Low'},
    {'Tool': 'Airtable', 'Best for': 'Database + simple interfaces; team collaboration', 'Target user': 'Business users, teams, project managers', 'Paradigm': 'Collaborative database + interfaces', 'Stack transparency': 'Very Low', 'Typical stack / languages': 'Proprietary', 'Code export': 'No', 'GitHub sync': 'No', 'Self-hosting possible': 'No', 'Visual editor': 'Yes (interface builder)', 'Code editor': 'Scripts (limited)', 'Prompt + manual editing': 'AI features (limited)', 'System-level instructions': 'N/A', 'Figma / design import': 'No', 'Styling control level': 'Low (templates)', 'Built-in database': 'Yes (core feature)', 'External DB support': 'Via sync/integrations', 'Auth built-in': 'Yes', 'RBAC': 'Yes', 'Workflows / background jobs': 'Yes (automations)', 'Webhooks': 'Yes', 'Payments': 'Via integrations', 'Email / SMS': 'Via automations', 'Integrations (highlights)': 'Slack, Google, Salesforce, Zapier, APIs', 'Hosting included': 'Yes', 'Custom domain': 'No', 'Pricing model': 'Per-user + records', 'Free tier': 'Yes (1K records/base)', 'Paid tiers from (USD/mo)': '$20/user (Team)', 'Included credits (examples)': 'Team: 50K records; Business: 125K; Enterprise: 500K+', 'Overage / payg': 'Upgrade tier', 'Ease of use': 'Very High', 'Lock-in risk': 'Very High', 'Reviews—highlights': 'Best collaborative database; easy to use; great for teams', 'Reviews—pain points': 'Limited app-building; not for customer-facing; expensive at scale', 'Official pricing': 'https://airtable.com/pricing', 'Official docs/features': 'https://support.airtable.com/', 'Last checked': '2026-01-19', 'Key sources': 'Official docs, productivity community', 'Prototype fit': 'Medium', 'MVP fit': 'Low', 'SaaS fit': 'Very Low'}
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
      <div className="max-w-[1600px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link to={createPageUrl('Dashboard')}>
            <Button variant="ghost" className="mb-4">
              ← Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            AI Coding Tools Comparison (18 tools)
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
                    <th key={column} className="text-left p-3 min-w-[200px] max-w-[300px]">
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
                      <td key={column} className="p-3 text-sm text-slate-700 min-w-[200px] max-w-[300px]">
                        <div className="line-clamp-3">
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