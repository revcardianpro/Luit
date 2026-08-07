-- Phase 7: Explore Assam
--
-- A "destinations" table for places worth discovering in Assam, plus a
-- seed of real, factual entries. Run once in the Supabase SQL Editor,
-- same as 0001_profiles_and_avatars.sql.

-- 0001 named this function after "profiles" specifically, but it's
-- actually a generic "set updated_at to now() on any row update"
-- helper -- destinations needs the exact same behavior. Renaming here
-- rather than duplicating it; safe to do because Postgres triggers
-- reference a function by its OID, not its name, so the existing
-- trigger on profiles keeps working unchanged after this rename.
alter function public.handle_profile_updated_at() rename to handle_updated_at;

create table public.destinations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null,
  district text not null,
  short_description text not null,
  description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Public content: readable by anyone, including signed-out visitors --
-- that's the whole point of "Explore Assam". No insert/update/delete
-- policy for regular users -- until Phase 15 (Admin Dashboard) gives
-- admins a CRUD UI, content is only ever added via a migration/SQL
-- Editor session like this one, not through the app itself.
alter table public.destinations enable row level security;

create policy "Destinations are publicly viewable"
  on public.destinations for select
  using (true);

create trigger on_destination_updated
  before update on public.destinations
  for each row execute function public.handle_updated_at();

-- Seed data. Kept deliberately factual and conservative on specific
-- numbers (e.g. wildlife counts) since those change year to year.
insert into public.destinations (slug, name, category, district, short_description, description) values
(
  'kaziranga-national-park',
  'Kaziranga National Park',
  'national_park',
  'Golaghat & Nagaon districts',
  'A UNESCO World Heritage Site and home to the majority of the world''s one-horned rhinoceroses.',
  'Kaziranga National Park stretches along the banks of the Brahmaputra River and is best known as the stronghold of the greater one-horned rhinoceros, home to the majority of the world''s population. Beyond rhinos, the park supports tigers, wild elephants, and wild water buffalo across its grasslands, wetlands, and forests. It was declared a UNESCO World Heritage Site in 1985 in recognition of its exceptional biodiversity.'
),
(
  'majuli',
  'Majuli',
  'island',
  'Majuli district',
  'One of the world''s largest river islands, and the heart of Assam''s Vaishnavite monastery culture.',
  'Sitting in the middle of the Brahmaputra, Majuli is widely cited as one of the largest river islands in the world. It has long been the center of Assamese Vaishnavite culture, home to numerous satras (monasteries) founded in the tradition of the 15th-16th century saint-reformer Srimanta Sankardev. The island is also home to Mishing and other indigenous communities, and is known for traditional mask-making and pottery crafts.'
),
(
  'kamakhya-temple',
  'Kamakhya Temple',
  'temple',
  'Kamrup Metropolitan district (Guwahati)',
  'One of the oldest and most significant Shakti Peethas, set atop Nilachal Hill in Guwahati.',
  'Kamakhya Temple sits atop Nilachal Hill overlooking Guwahati and is one of the oldest of the 51 Shakti Peethas of Hindu tradition, and a major center of Tantric worship. The temple complex in its current form dates largely to the 16th century, built after the reconstruction of an earlier structure. It draws large numbers of pilgrims year-round, especially during the annual Ambubachi Mela.'
),
(
  'sivasagar',
  'Sivasagar',
  'historical_site',
  'Sivasagar district',
  'The former capital of the six-centuries-long Ahom kingdom, dotted with palaces and monuments.',
  'Sivasagar was the capital of the Ahom kingdom, which ruled the Brahmaputra valley for roughly 600 years before the region came under British administration. The town is home to a cluster of Ahom-era monuments, including Rang Ghar, often cited as one of the oldest amphitheaters in Asia, the Talatal Ghar palace complex, and the towering Sivasagar Sivadol temple.'
),
(
  'manas-national-park',
  'Manas National Park',
  'national_park',
  'Chirang, Baksa & Bongaigaon districts',
  'A UNESCO World Heritage Site and tiger reserve on the Indo-Bhutan border, known for rare species.',
  'Manas National Park lies along the Indo-Bhutan border and is both a UNESCO World Heritage Site and a designated Tiger Reserve, Elephant Reserve, and Biosphere Reserve. Its forests and grasslands are known for exceptional biodiversity, including species found in few other places, such as the golden langur and pygmy hog.'
),
(
  'umananda-island',
  'Umananda Island',
  'island',
  'Kamrup Metropolitan district (Guwahati)',
  'A small island in the Brahmaputra at Guwahati, home to a Shiva temple and often cited among the smallest inhabited river islands.',
  'Umananda Island sits in the middle of the Brahmaputra River at Guwahati and is often cited as one of the smallest inhabited river islands in the world. It is home to the Umananda Temple, dedicated to Shiva, built in the 17th century by the Ahom king Gadadhar Singha. The island is reachable by a short ferry ride from the city.'
);
