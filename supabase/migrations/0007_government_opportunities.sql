-- Phase 11 addendum: Government Job & Exam Notifications
--
-- A separate curated table from "jobs" (which stays user-generated).
-- These are seeded by us, public read-only, same governance as
-- Explore/Pride/Learn -- but UNLIKE those, this content is genuinely
-- time-sensitive (exam/application dates), not evergreen. Each row
-- carries info_verified_on so the UI can visibly show "as of" currency
-- and point to the official source, rather than presenting dates as
-- permanently guaranteed-accurate.
--
-- Researched 2026-08-08: search results were dominated by unofficial
-- coaching/aggregator sites, several of which disagreed with each
-- other; official .gov.in sources were verified directly where
-- possible (Assam TET confirmed via scert.assam.gov.in /
-- ssa.assam.gov.in). Where only secondary sources were available,
-- confidence is noted in code comments below, not in the data itself.
-- This table needs periodic re-verification -- there's no admin UI yet
-- to do that easily (Phase 15), so treat entries as due for a refresh
-- well before anyone would rely on the exact dates.

create table public.government_opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  organization text not null,
  listing_type text not null,
  key_dates text not null,
  description text not null,
  source_url text not null,
  info_verified_on date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.government_opportunities enable row level security;

create policy "Government opportunities are publicly viewable"
  on public.government_opportunities for select
  using (true);

create trigger on_government_opportunity_updated
  before update on public.government_opportunities
  for each row execute function public.handle_updated_at();

insert into public.government_opportunities
  (title, organization, listing_type, key_dates, description, source_url, info_verified_on)
values
(
  -- Moderate confidence: consistent across multiple secondary sources,
  -- not independently verified against apsc.nic.in directly (site was
  -- unreachable from this tool due to a certificate error).
  'Combined Competitive Examination (CCE) 2026 — Mains',
  'Assam Public Service Commission (APSC)',
  'Competitive Exam',
  'Preliminary exam results released July 30, 2026. Main Examination online application window: August 4–24, 2026 (fee payment deadline August 26, 2026).',
  'Assam''s flagship state civil services exam, recruiting for positions including Assam Civil Service and Assam Police Service (Junior Grade), through a three-stage process: Preliminary Examination, Main Examination, and Personal Interview.',
  'https://apsc.nic.in',
  '2026-08-08'
),
(
  -- Moderate confidence: consistent across multiple secondary sources.
  'Combined Graduate Level (CGL) 2026',
  'Staff Selection Commission (SSC)',
  'Competitive Exam',
  'Notification released May 21, 2026 for 12,256 vacancies. Application window closed June 22, 2026. Tier 1 exam scheduled for August–September 2026; Tier 2 expected December 2026.',
  'Recruits for Group B and Group C posts across central government ministries and departments — one of India''s largest annual government recruitment exams, open nationwide including to candidates from Assam.',
  'https://ssc.gov.in',
  '2026-08-08'
),
(
  -- Moderate confidence: consistent across multiple secondary sources.
  'Clerk Recruitment (CRP CSA-XVI) 2026',
  'Institute of Banking Personnel Selection (IBPS)',
  'Job Recruitment',
  'Notification released August 1, 2026 for 11,403 vacancies. Online applications open August 1–21, 2026. Preliminary exam scheduled for October 10–11, 2026; Mains scheduled for December 27, 2026.',
  'Recruits for clerical cadre positions across public sector banks nationwide, through a Preliminary and Mains examination — a widely used entry route into public sector banking.',
  'https://ibps.in',
  '2026-08-08'
),
(
  -- Moderate confidence: consistent across multiple secondary sources.
  'Act Apprentice Recruitment 2026',
  'Northeast Frontier Railway (NFR)',
  'Job Recruitment',
  'Notification released July 14, 2026 for 6,777 apprentice training slots. Online applications open July 20 – August 19, 2026.',
  'Trade apprenticeship training across NFR''s divisions and workshops in Assam, West Bengal, and Bihar. Selection is based on qualifications, without a written exam.',
  'https://nfr.indianrailways.gov.in',
  '2026-08-08'
),
(
  -- High confidence: verified directly against scert.assam.gov.in and
  -- ssa.assam.gov.in, both official Government of Assam pages.
  'Special TET 2026 (Bodo, Garo, Manipuri & Hmar medium)',
  'State Council of Educational Research and Training (SCERT), Govt. of Assam',
  'Competitive Exam',
  'Notification issued January 7, 2026, with a subsequent corrigendum adding examination centers. Apply via sebaonline.org.',
  'A special Teacher Eligibility Test for Lower Primary and Upper Primary teaching positions in Bodo, Garo, Manipuri, and Hmar medium schools in Assam. The certificate is valid for life but doesn''t itself guarantee appointment — separate recruitment processes follow.',
  'https://scert.assam.gov.in',
  '2026-08-08'
);
