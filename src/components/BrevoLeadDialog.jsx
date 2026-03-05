import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BREVO_ACTION = "https://88dccfee.sibforms.com/serve/MUIFANExnvU9_rWAco0TEs4oLabjMynvBX-mCC4FNy9y5KKsGoSvVOBdsyepePSoQd9KWm8f42ZHi7sRWZEks0HP9aBavM5WpGkmzNwYxHfMqdK-AklRdV27EYlyby88WXirMv8ecgqXpuPdGcfemmZZeita8cyEhCq1tOofM-y1u370CFDbDN8k-iVjQpDxhCqTKzFnVxjYPq3uFw==";
const LS_KEY = 'firekit_lead';

export function hasSubmittedLead() {
  try {
    return !!localStorage.getItem(LS_KEY);
  } catch {
    return false;
  }
}

export default function BrevoLeadDialog({ open, onSuccess, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Please fill in both fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError('');

    // Submit to Brevo via hidden iframe (avoids CORS / page redirect)
    const iframe = document.createElement('iframe');
    iframe.name = 'brevo-hidden';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = BREVO_ACTION;
    form.target = 'brevo-hidden';

    const fields = {
      FIRSTNAME: name.trim(),
      EMAIL: email.trim(),
      email_address_check: '',
      locale: 'en'
    };

    Object.entries(fields).forEach(([key, val]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = val;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();

    // Save to localStorage and proceed (regardless of Brevo response)
    setTimeout(() => {
      localStorage.setItem(LS_KEY, JSON.stringify({ name: name.trim(), email: email.trim() }));
      document.body.removeChild(form);
      document.body.removeChild(iframe);
      setLoading(false);
      onSuccess();
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen && onClose) onClose(); }}>
      <DialogContent className="max-w-md p-0 overflow-hidden" hideCloseButton>
        {/* Header */}
        <div className="bg-black px-8 pt-8 pb-6 text-white">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695a4c3829d04b83a5c959f0/928d5846e_VenturesBlack.png"
            alt="35N Ventures"
            className="h-7 object-contain mb-5 invert"
          />
          <h2 className="text-2xl font-bold mb-1">Welcome to FireKit</h2>
          <p className="text-white/70 text-sm">Enter your details to get free access to all resources.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
          <div>
            <Label className="text-slate-700 font-medium text-sm mb-1.5 block">Full Name</Label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              required
              disabled={loading}
            />
          </div>

          <div>
            <Label className="text-slate-700 font-medium text-sm mb-1.5 block">Email Address</Label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-slate-800 text-white font-semibold py-2.5 h-auto mt-2"
          >
            {loading ? 'Getting access...' : 'Get Free Access →'}
          </Button>

          <p className="text-xs text-slate-400 text-center">We respect your privacy. No spam, ever.</p>
        </form>
      </DialogContent>
    </Dialog>
  );
}