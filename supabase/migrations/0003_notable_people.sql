-- Phase 8: Pride of Assam
--
-- A "notable_people" table for figures worth knowing about from Assam,
-- plus a seed of 5 verified, factual entries. Run once in the Supabase
-- SQL Editor, same as the previous migrations.
--
-- Photo attribution note: unlike the Explore Assam photos (Pixabay,
-- no attribution required), these are sourced from Wikimedia Commons
-- under licenses (CC BY-SA, GODL-India) that DO legally require visible
-- credit -- hence the photo_credit/photo_license/photo_license_url
-- columns, surfaced in the UI itself, not just recorded internally.

create table public.notable_people (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  field text not null,
  lifespan text not null,
  short_description text not null,
  description text not null,
  photo_path text not null,
  photo_credit text not null,
  photo_license text not null,
  photo_license_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.notable_people enable row level security;

create policy "Notable people are publicly viewable"
  on public.notable_people for select
  using (true);

create trigger on_notable_person_updated
  before update on public.notable_people
  for each row execute function public.handle_updated_at();

insert into public.notable_people
  (slug, name, field, lifespan, short_description, description, photo_path, photo_credit, photo_license, photo_license_url)
values
(
  'bhupen-hazarika',
  'Bhupen Hazarika',
  'Music & Cinema',
  '1926–2011',
  'Legendary singer, lyricist and filmmaker whose songs of humanity and brotherhood made him one of India''s most beloved musical voices.',
  'Bhupen Hazarika (1926–2011), widely known as Sudha Kantha (''nectar-voiced''), was a singer, songwriter, writer, filmmaker, and politician from Assam. Writing primarily in Assamese, his songs carried themes of humanity and universal brotherhood, and were translated into numerous languages including Bengali and Hindi. He was posthumously awarded the Bharat Ratna, India''s highest civilian honor, in 2019.',
  '/images/pride/bhupen-hazarika.jpg',
  'Utpal Baruah / UB Photos',
  'CC BY-SA 3.0',
  'https://creativecommons.org/licenses/by-sa/3.0/'
),
(
  'lachit-borphukan',
  'Lachit Borphukan',
  'Military History',
  '1622–1672',
  'Ahom army general whose victory at the Battle of Saraighat (1671) is remembered as a defining stand against Mughal expansion into Assam.',
  'Lachit Borphukan (1622–1672) was a general of the Ahom kingdom, best known for commanding the Ahom army to victory in the naval Battle of Saraighat in 1671, which halted a much larger Mughal invasion force led by Ramsingh I. He remains a celebrated symbol of valor in Assam, and the National Defence Academy awards the Lachit Borphukan Gold Medal to its best all-round cadet each year. (Pictured: a statue depiction — no contemporary portraits survive from his lifetime.)',
  '/images/pride/lachit-borphukan.jpg',
  'বিকাশ দিহিঙ্গীয়া (Bikash Dihingia)',
  'CC BY-SA 4.0',
  'https://creativecommons.org/licenses/by-sa/4.0/'
),
(
  'srimanta-sankardev',
  'Srimanta Sankardev',
  'Spirituality & Arts',
  '1449–1568',
  '15th–16th century polymath — saint, scholar, poet and reformer — whose Ekasarana Bhakti movement reshaped Assamese religion, art and performance.',
  'Srimanta Sankardev (1449–1568) was an Assamese polymath: a saint-scholar, poet, playwright, dancer, musician, and social-religious reformer. He founded the Ekasarana Dharma tradition within the Bhakti movement and is credited with originating enduring Assamese cultural forms including Borgeet (devotional songs), Sattriya dance, and Ankiya Naat theatre — traditions still practiced in Assam''s satras (monasteries) today. (Pictured: a traditional painted depiction — he lived centuries before photography.)',
  '/images/pride/srimanta-sankardev.jpg',
  'Jrkalita',
  'Public Domain',
  null
),
(
  'hima-das',
  'Hima Das',
  'Sports',
  'b. 2000',
  'Sprinter nicknamed the ''Dhing Express,'' the first Indian to win gold in a track event at the World U20 Championships.',
  'Hima Das (b. 2000) is an Indian sprinter who holds the national record in the 400m, clocked at the 2018 Asian Games. In 2018 she became the first Indian athlete to win a gold medal in a track event at the IAAF World U20 Championships. She has received the Arjuna Award and was appointed Deputy Superintendent of Police under Assam''s Integrated Sports Policy.',
  '/images/pride/hima-das.jpg',
  'Sesuajd',
  'CC BY-SA 4.0',
  'https://creativecommons.org/licenses/by-sa/4.0/'
),
(
  'jyoti-prasad-agarwala',
  'Jyoti Prasad Agarwala',
  'Cinema & Literature',
  '1903–1951',
  'Playwright, poet and filmmaker revered as the ''Rupkonwar'' of Assamese culture, and regarded as the founder of Assamese cinema.',
  'Jyoti Prasad Agarwala (1903–1951) was a playwright, songwriter, poet, writer and filmmaker from Assam, popularly known as the Rupkonwar (''Prince of Beauty'') of Assamese culture. He directed Joymoti (1935), regarded as the first Assamese-language film, and was also active in India''s independence movement, participating in the Quit India Movement. (Pictured: a 2004 Indian postage stamp issued in his honor.)',
  '/images/pride/jyoti-prasad-agarwala.jpg',
  'India Post, Government of India',
  'GODL-India',
  'https://data.gov.in/sites/default/files/Gazette_Notification_OGDL.pdf'
);
