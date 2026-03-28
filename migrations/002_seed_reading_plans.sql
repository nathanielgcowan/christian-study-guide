-- Seed reading plans into the database

INSERT INTO public.reading_plans (
  name, 
  description, 
  plan_type, 
  duration_days, 
  entries
) VALUES
(
  'The Bible in 365 Days',
  'Read through the entire Bible in one year with daily passages from the Old Testament, New Testament, and Psalms.',
  'general',
  365,
  jsonb_build_array(
    jsonb_build_object('day', 1, 'reference', 'Genesis 1, Matthew 1, Psalm 1', 'notes', 'Beginning of God''s story'),
    jsonb_build_object('day', 2, 'reference', 'Genesis 2-3, Matthew 2, Psalm 2', 'notes', 'Creation and the Fall'),
    jsonb_build_object('day', 3, 'reference', 'Genesis 4-5, Matthew 3, Psalm 3', 'notes', 'Cain and Abel, Jesus'' baptism')
  )
),
(
  'The Life and Teaching of Jesus',
  'Deep dive into the four gospels to understand the life, miracles, parables, and teachings of Jesus Christ.',
  'theology',
  90,
  jsonb_build_array(
    jsonb_build_object('day', 1, 'reference', 'Matthew 1-2', 'notes', 'The birth of Jesus'),
    jsonb_build_object('day', 2, 'reference', 'Matthew 3-4', 'notes', 'Baptism and temptation'),
    jsonb_build_object('day', 3, 'reference', 'Matthew 5-7', 'notes', 'The Sermon on the Mount')
  )
),
(
  'Paul''s Letters: Foundational Theology',
  'Study the epistles of Paul to understand grace, salvation, faith, and Christian living.',
  'theology',
  60,
  jsonb_build_array(
    jsonb_build_object('day', 1, 'reference', 'Romans 1-2', 'notes', 'God''s righteousness revealed'),
    jsonb_build_object('day', 2, 'reference', 'Romans 3-4', 'notes', 'Justification by faith'),
    jsonb_build_object('day', 3, 'reference', 'Romans 5-6', 'notes', 'Life in Christ')
  )
),
(
  'Psalms & Prayers: The Psalter',
  'Journey through the Psalms to explore prayer, worship, lament, and praise in Scripture.',
  'topical',
  150,
  jsonb_build_array(
    jsonb_build_object('day', 1, 'reference', 'Psalm 1-10', 'notes', 'Foundations of wisdom'),
    jsonb_build_object('day', 2, 'reference', 'Psalm 11-20', 'notes', 'Trust and protection'),
    jsonb_build_object('day', 3, 'reference', 'Psalm 21-30', 'notes', 'Praise and thanksgiving')
  )
),
(
  'Major Old Testament Stories',
  'Explore foundational narratives: Adam & Eve, Noah, Abraham, Moses, David, Solomon, and the prophets.',
  'topical',
  75,
  jsonb_build_array(
    jsonb_build_object('day', 1, 'reference', 'Genesis 1-3', 'notes', 'Creation and the Fall'),
    jsonb_build_object('day', 2, 'reference', 'Genesis 6-9', 'notes', 'The Flood and Noah'),
    jsonb_build_object('day', 3, 'reference', 'Genesis 12-15', 'notes', 'Abraham''s call and faith')
  )
),
(
  '30-Day New Testament Overview',
  'A quick survey of the New Testament in one month, covering the gospels, Acts, letters, and Revelation.',
  'general',
  30,
  jsonb_build_array(
    jsonb_build_object('day', 1, 'reference', 'Matthew 1-5', 'notes', 'The Sermon on the Mount'),
    jsonb_build_object('day', 2, 'reference', 'Mark 1-3', 'notes', 'Jesus'' ministry begins'),
    jsonb_build_object('day', 3, 'reference', 'Luke 1-2', 'notes', 'Birth narratives')
  )
),
(
  'The Armor of God: Spiritual Warfare',
  'Study Scripture on spiritual protection, prayer, and standing firm in faith against spiritual forces.',
  'topical',
  45,
  jsonb_build_array(
    jsonb_build_object('day', 1, 'reference', 'Ephesians 6:10-20', 'notes', 'The full armor of God'),
    jsonb_build_object('day', 2, 'reference', '1 Peter 5:6-11', 'notes', 'Resisting the devil'),
    jsonb_build_object('day', 3, 'reference', '2 Corinthians 10:3-6', 'notes', 'Mighty weapons of spiritual warfare')
  )
),
(
  'Love, Grace, and Forgiveness',
  'Discover Scripture passages that explore God''s love, grace, forgiveness, and reconciliation.',
  'topical',
  40,
  jsonb_build_array(
    jsonb_build_object('day', 1, 'reference', 'John 3:16, Romans 5:8', 'notes', 'God''s love demonstrated'),
    jsonb_build_object('day', 2, 'reference', 'Ephesians 2:4-10', 'notes', 'Grace and mercy'),
    jsonb_build_object('day', 3, 'reference', 'Colossians 3:13', 'notes', 'Forgiveness')
  )
);
