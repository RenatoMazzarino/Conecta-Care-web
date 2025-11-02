

'use client';

import * as React from 'react';
import type { Patient } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { User, Phone, Mail, Calendar, Home, Building, Dog, Ambulance, Stethoscope, Pill, Plus, X, Briefcase, Link as LinkIcon, FileText, NotebookTabs, Wallet, Users, ShieldCheck, FolderOpen, History, MessageCircle, Edit, Save, BadgeCheck, BadgeAlert, Gavel, FileWarning } from 'lucide-react';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { EditMode } from './patient-details-panel';
import { Badge } from '@/components/ui/badge';

// Define a simple SVG icon for WhatsApp
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 32 32" {...props}><path d=" M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.63-.63c0-1.562 1.432-2.822 2.822-2.822a2.822 2.822 0 0 1 2.822 2.822c0 .372-.258.63-.63.63a1.518 1.518 0 0 1-1.518-1.39zm-2.708.272c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.63-.63c0-1.562 1.432-2.822 2.822-2.822a2.822 2.822