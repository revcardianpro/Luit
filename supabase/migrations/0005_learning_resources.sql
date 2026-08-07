-- Phase 10: Learning Hub
--
-- A "learning_resources" table for curated external learning
-- opportunities -- scholarships, skill development, technology
-- education, and entrepreneurship support. Same pattern as
-- destinations/notable_people: seeded by us, public read-only, no
-- self-serve submission yet (see supabase/migrations/0002 and 0003 for
-- the same reasoning).
--
-- Descriptions are deliberately evergreen -- no specific deadlines or
-- award amounts, which change yearly -- with a link out to the
-- authoritative source for current details. All URLs verified live
-- before this migration was written.

create table public.learning_resources (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  provider text not null,
  category text not null,
  short_description text not null,
  description text not null,
  url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.learning_resources enable row level security;

create policy "Learning resources are publicly viewable"
  on public.learning_resources for select
  using (true);

create trigger on_learning_resource_updated
  before update on public.learning_resources
  for each row execute function public.handle_updated_at();

insert into public.learning_resources
  (slug, title, provider, category, short_description, description, url)
values
(
  'national-scholarship-portal',
  'National Scholarship Portal',
  'Government of India',
  'Scholarships',
  'The Government of India''s centralized portal for applying to merit-based and welfare scholarships across states, including Assam.',
  'The National Scholarship Portal is a one-stop platform where students can browse, apply for, and track central and state government scholarships in one place, spanning pre-matric, post-matric, merit-based, and welfare schemes. Many scholarships relevant to Assamese students, including state-specific ones, are processed through this portal. Eligibility criteria and application windows vary by scheme and change each academic year — check the portal directly for what''s currently open.',
  'https://scholarships.gov.in'
),
(
  'nptel',
  'NPTEL',
  'IITs & IISc',
  'Technology & Learning',
  'Free video courses from IITs and IISc covering engineering, science, and technology, with optional certification exams.',
  'NPTEL (National Programme on Technology Enhanced Learning) is a joint initiative of the IITs and IISc offering free video-based courses across engineering, science, humanities, and management. Course content is free to access; certification requires a separate proctored exam for a fee. It''s one of India''s most widely used platforms for structured, credible technical learning outside a formal degree program.',
  'https://nptel.ac.in'
),
(
  'swayam',
  'SWAYAM',
  'Government of India',
  'Technology & Learning',
  'India''s national platform for free online courses from school level through postgraduate, with credits recognized by many universities.',
  'SWAYAM (Study Webs of Active Learning for Young Aspiring Minds) is the Government of India''s platform hosting free courses from school board level through postgraduate study, taught by faculty from top Indian institutions. Many SWAYAM courses carry academic credit that participating universities recognize, making it useful both for independent learning and for formal credit transfer.',
  'https://swayam.gov.in'
),
(
  'assam-skill-development-mission',
  'Assam Skill Development Mission',
  'Government of Assam',
  'Skill Development',
  'The Assam government''s nodal agency for free skill training programs aimed at improving youth employability across the state.',
  'The Assam Skill Development Mission (ASDM) is the state government''s apex body coordinating skill development and livelihood programs for Assam''s youth. It runs and partners on free short-term training programs across various trades and sectors, aimed at improving employability and, where relevant, connecting graduates to placement opportunities.',
  'https://asdm.assam.gov.in'
),
(
  'pmkvy',
  'Pradhan Mantri Kaushal Vikas Yojana (PMKVY)',
  'Ministry of Skill Development & Entrepreneurship',
  'Skill Development',
  'A national free skill-training scheme offering short-term courses and certification across a wide range of trades.',
  'Pradhan Mantri Kaushal Vikas Yojana (PMKVY) is the Ministry of Skill Development and Entrepreneurship''s flagship scheme, implemented by the National Skill Development Corporation. It offers free short-term skill training and certification (including Recognition of Prior Learning for those with existing informal skills) across a wide range of sectors, available nationwide including in Assam.',
  'https://pmkvyproject.org'
),
(
  'startup-assam',
  'Startup Assam',
  'Government of Assam',
  'Entrepreneurship',
  'The Assam government''s startup initiative — recognition, incubation support, and policy backing for entrepreneurs building in the state.',
  'Startup Assam is a Government of Assam initiative to build a startup ecosystem in the state, offering official startup recognition (MASI — My Assam Startup ID), incubation support through ''Assam Startup — the Nest'' in Guwahati, and policy incentives for entrepreneurs. It''s the state''s primary channel for founders seeking official recognition and support within Assam.',
  'https://startup.assam.gov.in'
);
