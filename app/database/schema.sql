-- =============================================================================
-- FORZA HORIZON 6 — WIKI DATABASE SCHEMA (SQLite)
-- =============================================================================
-- Covers: Cars · Manufacturers · Engines · Drivetrain · Performance Stats ·
--         Upgrade Parts · Tuning · Car Divisions/Classes · Availability ·
--         Events · Expansions · Car Collections · Media
-- =============================================================================

PRAGMA foreign_keys = ON;
-- PRAGMA journal_mode = WAL;

-- =============================================================================
-- SECTION 1: REFERENCE / LOOKUP TABLES
-- =============================================================================

CREATE TABLE IF NOT EXISTS countries (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL UNIQUE,
    code        TEXT    NOT NULL UNIQUE,   -- ISO 3166-1 alpha-2
    region      TEXT    -- e.g. 'Europe', 'North America', 'Asia'
);

CREATE TABLE IF NOT EXISTS expansions (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT    NOT NULL UNIQUE,
    slug            TEXT    NOT NULL UNIQUE,
    description     TEXT,
    release_date    TEXT,                  -- ISO 8601
    is_base_game    INTEGER NOT NULL DEFAULT 0  -- BOOLEAN
);

-- Performance index bands used in Forza
CREATE TABLE IF NOT EXISTS pi_classes (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    label       TEXT    NOT NULL UNIQUE,  -- 'D', 'C', 'B', 'A', 'S1', 'S2', 'X'
    pi_min      INTEGER NOT NULL,
    pi_max      INTEGER NOT NULL,
    sort_order  INTEGER NOT NULL
);

-- Car divisions (e.g. Modern Supercars, Classic Muscle, Hypercars …)
CREATE TABLE IF NOT EXISTS car_divisions (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL UNIQUE,
    slug        TEXT    NOT NULL UNIQUE,
    description TEXT
);

-- High-level body / type tags used in game filters
CREATE TABLE IF NOT EXISTS car_types (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    name    TEXT    NOT NULL UNIQUE  -- 'Coupe', 'Convertible', 'Truck', 'SUV', …
);

-- Aspiration variants
CREATE TABLE IF NOT EXISTS engine_aspirations (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    name    TEXT    NOT NULL UNIQUE
    -- 'Naturally Aspirated', 'Turbocharged', 'Supercharged',
    -- 'Twin-Turbocharged', 'Electric', 'Hybrid', 'Quad-Turbocharged'
);

-- Fuel / powertrain types
CREATE TABLE IF NOT EXISTS powertrain_types (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    name    TEXT    NOT NULL UNIQUE
    -- 'Petrol', 'Diesel', 'Full Electric', 'Hybrid', 'Hydrogen'
);

-- Drivetrain layouts
CREATE TABLE IF NOT EXISTS drivetrain_layouts (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    code        TEXT    NOT NULL UNIQUE,  -- 'FWD', 'RWD', 'AWD'
    description TEXT
);

-- Engine block layouts
CREATE TABLE IF NOT EXISTS engine_configs (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    code        TEXT    NOT NULL UNIQUE,
    description TEXT
    -- 'I4', 'I6', 'V6', 'V8', 'V10', 'V12', 'H4', 'H6', 'W12', 'W16',
    -- 'R4', 'Electric', 'Rotary'
);

-- Transmission types
CREATE TABLE IF NOT EXISTS transmission_types (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    name    TEXT    NOT NULL UNIQUE
    -- 'Manual', 'Automatic', 'DCT', 'CVT', 'Single-Speed'
);

-- =============================================================================
-- SECTION 2: MANUFACTURERS
-- =============================================================================

CREATE TABLE IF NOT EXISTS manufacturers (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT    NOT NULL UNIQUE,
    slug            TEXT    NOT NULL UNIQUE,
    country_id      INTEGER REFERENCES countries(id) ON DELETE SET NULL,
    founded_year    INTEGER,
    logo_url        TEXT,
    description     TEXT
);

-- =============================================================================
-- SECTION 3: CARS (core table)
-- =============================================================================

CREATE TABLE IF NOT EXISTS cars (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,

    manufacturer_id     INTEGER NOT NULL REFERENCES manufacturers(id) ON DELETE RESTRICT,
    model               TEXT    NOT NULL,
    variant             TEXT,
    year                INTEGER NOT NULL,

    full_name           TEXT NOT NULL,

    slug                TEXT GENERATED ALWAYS AS (
                            lower(
                                replace(
                                    replace(
                                        trim(full_name),
                                        ' ',
                                        '-'
                                    ),
                                    '--',
                                    '-'
                                )
                            )
                        ) STORED UNIQUE,

    car_pi_id           INTEGER REFERENCES pi_classes(id) ON DELETE SET NULL,
    car_type_id         INTEGER REFERENCES car_types(id) ON DELETE SET NULL,
    division_id         INTEGER REFERENCES car_divisions(id) ON DELETE SET NULL,
    is_dlc              INTEGER NOT NULL DEFAULT 0,
    expansion_id        INTEGER REFERENCES expansions(id) ON DELETE SET NULL,

    is_barn_find        INTEGER NOT NULL DEFAULT 0,
    is_exclusive        INTEGER NOT NULL DEFAULT 0,

    drivetrain_id       INTEGER REFERENCES drivetrain_layouts(id) ON DELETE SET NULL,
    powertrain_type_id  INTEGER REFERENCES powertrain_types(id) ON DELETE SET NULL,

    thumbnail_url       TEXT,
    image_url           TEXT,

    description         TEXT,

    created_at          TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_cars_manufacturer ON cars(manufacturer_id);
CREATE INDEX IF NOT EXISTS idx_cars_division      ON cars(division_id);
CREATE INDEX IF NOT EXISTS idx_cars_year          ON cars(year);

-- =============================================================================
-- SECTION 4: FACTORY ENGINE SPECS
-- =============================================================================

CREATE TABLE IF NOT EXISTS car_engines (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    car_id              INTEGER NOT NULL UNIQUE REFERENCES cars(id) ON DELETE CASCADE,

    -- Block
    engine_config_id    INTEGER REFERENCES engine_configs(id),
    displacement_cc     INTEGER,             -- cubic centimetres
    cylinders           INTEGER,
    aspiration_id       INTEGER REFERENCES engine_aspirations(id),

    -- Output (factory spec)
    power_hp            INTEGER,             -- bhp / PS — use hp for consistency
    torque_nm           INTEGER,             -- Newton-metres
    redline_rpm         INTEGER,
    max_torque_rpm      INTEGER,

    -- Position
    engine_position     TEXT,               -- 'Front', 'Mid', 'Rear'
    engine_orientation  TEXT                -- 'Longitudinal', 'Transverse'
);

-- =============================================================================
-- SECTION 5: FACTORY DRIVETRAIN / GEARBOX SPECS
-- =============================================================================

CREATE TABLE IF NOT EXISTS car_drivetrains (
    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    car_id                  INTEGER NOT NULL UNIQUE REFERENCES cars(id) ON DELETE CASCADE,

    transmission_type_id    INTEGER REFERENCES transmission_types(id),
    num_gears               INTEGER,
    final_drive_ratio       REAL,

    -- Weight
    kerb_weight_kg          INTEGER,
    weight_distribution_f   REAL,           -- front %, e.g. 47.0

    -- Dimensions (factory)
    wheelbase_mm            INTEGER,
    track_front_mm          INTEGER,
    track_rear_mm           INTEGER
);

-- =============================================================================
-- SECTION 6: IN-GAME PERFORMANCE STATS (base / stock)
-- =============================================================================

CREATE TABLE IF NOT EXISTS car_stats_stock (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    car_id          INTEGER NOT NULL UNIQUE REFERENCES cars(id) ON DELETE CASCADE,

    -- PI
    pi_value        INTEGER NOT NULL,
    pi_class_id     INTEGER REFERENCES pi_classes(id),

    -- Forza attribute bars (0.0 – 10.0)
    speed           REAL,
    handling        REAL,
    acceleration    REAL,
    launch          REAL,
    braking         REAL,
    offroad         REAL,

    -- Real-world benchmarks (in-game)
    top_speed_kmh   INTEGER,
    top_speed_mph   INTEGER GENERATED ALWAYS AS (ROUND(top_speed_kmh * 0.621371)) STORED,
    accel_0_60_mph  REAL,                   -- seconds
    accel_0_100_kmh REAL                    -- seconds
);

-- =============================================================================
-- SECTION 7: UPGRADE PART SYSTEM
-- =============================================================================

-- Top-level upgrade categories matching in-game menus
CREATE TABLE IF NOT EXISTS upgrade_categories (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL UNIQUE,    -- 'Engine', 'Platform & Handling', etc.
    slug        TEXT    NOT NULL UNIQUE,
    sort_order  INTEGER NOT NULL DEFAULT 0
);

-- Sub-categories within each top-level section
CREATE TABLE IF NOT EXISTS upgrade_subcategories (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id     INTEGER NOT NULL REFERENCES upgrade_categories(id) ON DELETE CASCADE,
    name            TEXT    NOT NULL,
    slug            TEXT    NOT NULL,
    sort_order      INTEGER NOT NULL DEFAULT 0,
    UNIQUE (category_id, slug)
);

-- Individual upgrade parts (e.g. "Race Camshaft", "Street Tires", …)
CREATE TABLE IF NOT EXISTS upgrades (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    subcategory_id      INTEGER NOT NULL REFERENCES upgrade_subcategories(id) ON DELETE CASCADE,
    name                TEXT    NOT NULL,
    tier                TEXT,              -- 'Street', 'Sport', 'Race', 'Rally', 'Offroad', 'Forza'
    sort_order          INTEGER NOT NULL DEFAULT 0,
    description         TEXT,

    -- Stat deltas this part typically provides (nullable — set per car in car_upgrade_effects)
    delta_power_hp      INTEGER,
    delta_torque_nm     INTEGER,
    delta_weight_kg     INTEGER,

    -- PI impact is car-specific, stored in car_upgrade_effects
    UNIQUE (subcategory_id, name, tier)
);

-- Compatibility: which upgrades are available for which car
CREATE TABLE IF NOT EXISTS car_upgrade_availability (
    car_id          INTEGER NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    upgrade_id      INTEGER NOT NULL REFERENCES upgrades(id) ON DELETE CASCADE,
    is_default      INTEGER NOT NULL DEFAULT 0,  -- comes pre-installed
    PRIMARY KEY (car_id, upgrade_id)
);

-- Per-car effect of each upgrade (PI delta, stat bar deltas)
CREATE TABLE IF NOT EXISTS car_upgrade_effects (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    car_id          INTEGER NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    upgrade_id      INTEGER NOT NULL REFERENCES upgrades(id) ON DELETE CASCADE,

    pi_delta        INTEGER,               -- PI change when installed
    speed_delta     REAL,
    handling_delta  REAL,
    accel_delta     REAL,
    launch_delta    REAL,
    braking_delta   REAL,
    offroad_delta   REAL,

    UNIQUE (car_id, upgrade_id)
);

-- =============================================================================
-- SECTION 8: ENGINE SWAPS
-- =============================================================================

CREATE TABLE IF NOT EXISTS engine_swaps (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    car_id              INTEGER NOT NULL REFERENCES cars(id) ON DELETE CASCADE,

    -- The new engine being swapped in
    swap_engine_config  INTEGER REFERENCES engine_configs(id),
    swap_aspiration_id  INTEGER REFERENCES engine_aspirations(id),
    swap_name           TEXT    NOT NULL,   -- e.g. '7.0L V8 Swap'
    swap_displacement_cc INTEGER,

    power_hp_stock      INTEGER,            -- power of swapped engine at base tune
    power_hp_max        INTEGER,            -- max potential after full upgrade
    pi_delta            INTEGER,
    description         TEXT
);

-- =============================================================================
-- SECTION 9: DRIVETRAIN CONVERSIONS
-- =============================================================================

CREATE TABLE IF NOT EXISTS drivetrain_conversions (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    car_id          INTEGER NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    target_drivetrain_id INTEGER NOT NULL REFERENCES drivetrain_layouts(id),
    pi_delta        INTEGER,
    description     TEXT,
    UNIQUE (car_id, target_drivetrain_id)
);

-- =============================================================================
-- SECTION 10: TUNING SETUPS
-- =============================================================================

CREATE TABLE IF NOT EXISTS tuning_setups (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    car_id          INTEGER NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    name            TEXT    NOT NULL,
    author          TEXT,
    share_code      TEXT,                   -- 12-char Forza share code
    pi_class_id     INTEGER REFERENCES pi_classes(id),
    pi_value        INTEGER,
    description     TEXT,
    is_meta         INTEGER NOT NULL DEFAULT 0,   -- community-voted meta tune
    created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- All tuneable parameters, stored as key-value for flexibility
CREATE TABLE IF NOT EXISTS tuning_parameters (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    setup_id        INTEGER NOT NULL REFERENCES tuning_setups(id) ON DELETE CASCADE,

    -- === TIRES ===
    tire_compound   TEXT,                   -- 'Street', 'Sport', 'Race Slick', etc.
    tire_width_f    INTEGER,                -- mm
    tire_width_r    INTEGER,
    tire_aspect_f   INTEGER,                -- aspect ratio %
    tire_aspect_r   INTEGER,
    rim_size_f      INTEGER,                -- inches
    rim_size_r      INTEGER,
    tire_pressure_f REAL,                   -- PSI
    tire_pressure_r REAL,

    -- === GEARING ===
    final_drive     REAL,
    gear_1          REAL,
    gear_2          REAL,
    gear_3          REAL,
    gear_4          REAL,
    gear_5          REAL,
    gear_6          REAL,
    gear_7          REAL,
    gear_8          REAL,
    gear_9          REAL,
    gear_10         REAL,

    -- === ALIGNMENT ===
    camber_f        REAL,                   -- degrees (negative = camber-in)
    camber_r        REAL,
    toe_f           REAL,                   -- degrees
    toe_r           REAL,
    caster          REAL,

    -- === ANTI-ROLL BARS ===
    arb_f           REAL,
    arb_r           REAL,

    -- === SPRINGS ===
    springs_f       REAL,                   -- kgf/mm
    springs_r       REAL,
    ride_height_f   REAL,                   -- cm
    ride_height_r   REAL,

    -- === DAMPERS ===
    bump_f          REAL,
    bump_r          REAL,
    rebound_f       REAL,
    rebound_r       REAL,

    -- === AERO ===
    downforce_f     INTEGER,                -- kg
    downforce_r     INTEGER,

    -- === DIFFERENTIAL ===
    diff_accel_f    REAL,                   -- % lock on acceleration
    diff_decel_f    REAL,
    diff_accel_r    REAL,
    diff_decel_r    REAL,
    diff_balance    REAL,                   -- % torque bias to rear (AWD)
    diff_accel_c    REAL,                   -- centre diff (AWD)
    diff_decel_c    REAL,

    -- === BRAKES ===
    brake_balance   REAL,                   -- % front
    brake_pressure  REAL,                   -- %

    -- === ENGINE ===
    boost_pressure  REAL,                   -- PSI (turbo cars)
    rev_limiter_rpm INTEGER,
    ignition_timing REAL,                   -- degrees
    fuel_air_ratio  REAL,

    -- === STABILITY AIDS ===
    abs_level       INTEGER,                -- 0=off, 1-10
    tcs_level       INTEGER,
    stm_level       INTEGER
);

-- =============================================================================
-- SECTION 11: LIVERIES & VISUAL CUSTOMISATION
-- =============================================================================

CREATE TABLE IF NOT EXISTS livery_designs (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    car_id      INTEGER NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    name        TEXT    NOT NULL,
    author      TEXT,
    share_code  TEXT,
    thumbnail_url TEXT,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Wheel catalogue
CREATE TABLE IF NOT EXISTS wheels (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    brand           TEXT    NOT NULL,
    model           TEXT    NOT NULL,
    style           TEXT,                   -- 'Multi-Spoke', 'Mesh', 'Split-Spoke' …
    min_size_inches INTEGER,
    max_size_inches INTEGER,
    thumbnail_url   TEXT
);

-- Body kits / aero body parts per car
CREATE TABLE IF NOT EXISTS car_body_kits (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    car_id      INTEGER NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    name        TEXT    NOT NULL,           -- e.g. 'RWB Wide Body Kit'
    kit_type    TEXT,                       -- 'Wide Body', 'Race', 'OEM+', 'Stance'
    description TEXT,
    image_url   TEXT
);

-- =============================================================================
-- SECTION 12: CAR AVAILABILITY & ACQUISITION
-- =============================================================================

CREATE TABLE IF NOT EXISTS acquisition_methods (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    name    TEXT    NOT NULL UNIQUE
    -- 'Autoshow', 'Auction House', 'Barn Find', 'Gift Drop', 'Forzathon Shop',
    -- 'EventLab Reward', 'Story Reward', 'Seasonal Reward', 'DLC', 'Horizon Promo'
);

CREATE TABLE IF NOT EXISTS car_availability (
    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    car_id                  INTEGER NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    acquisition_method_id   INTEGER NOT NULL REFERENCES acquisition_methods(id),
    expansion_id            INTEGER REFERENCES expansions(id),
    base_price_cr           INTEGER,        -- in-game credits (NULL if non-purchasable)
    notes                   TEXT,
    is_currently_available  INTEGER NOT NULL DEFAULT 1,
    UNIQUE (car_id, acquisition_method_id)
);

-- =============================================================================
-- SECTION 13: GAME WORLD — TRACKS & LOCATIONS
-- =============================================================================

CREATE TABLE IF NOT EXISTS world_regions (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL UNIQUE,
    description TEXT,
    expansion_id INTEGER REFERENCES expansions(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS tracks (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT    NOT NULL,
    slug            TEXT    NOT NULL UNIQUE,
    region_id       INTEGER REFERENCES world_regions(id) ON DELETE SET NULL,
    surface_type    TEXT,                   -- 'Asphalt', 'Dirt', 'Mixed', 'Snow'
    length_km       REAL,
    circuit         INTEGER NOT NULL DEFAULT 0,  -- BOOLEAN: is a circuit (loop)?
    num_routes      INTEGER NOT NULL DEFAULT 1,
    thumbnail_url   TEXT,
    description     TEXT
);

-- =============================================================================
-- SECTION 14: EVENTS & CHAMPIONSHIPS
-- =============================================================================

CREATE TABLE IF NOT EXISTS event_types (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    name    TEXT    NOT NULL UNIQUE
    -- 'Road Racing', 'Dirt Racing', 'Cross Country', 'Street Scene',
    -- 'Drag', 'Speed Zone', 'Trailblazer', 'Danger Sign', 'Drift Zone',
    -- 'Showcase', 'Story', 'Horizon Open', 'EventLab'
);

CREATE TABLE IF NOT EXISTS events (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT    NOT NULL,
    slug            TEXT    NOT NULL UNIQUE,
    event_type_id   INTEGER REFERENCES event_types(id),
    track_id        INTEGER REFERENCES tracks(id) ON DELETE SET NULL,
    expansion_id    INTEGER REFERENCES expansions(id) ON DELETE SET NULL,
    num_laps        INTEGER,
    description     TEXT,
    thumbnail_url   TEXT
);

-- Eligibility restrictions per event
CREATE TABLE IF NOT EXISTS event_restrictions (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id        INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    pi_class_id     INTEGER REFERENCES pi_classes(id),
    pi_max          INTEGER,
    division_id     INTEGER REFERENCES car_divisions(id),
    drivetrain_id   INTEGER REFERENCES drivetrain_layouts(id),
    car_type_id     INTEGER REFERENCES car_types(id)
);

-- Event series / championships
CREATE TABLE IF NOT EXISTS championships (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT    NOT NULL,
    slug            TEXT    NOT NULL UNIQUE,
    expansion_id    INTEGER REFERENCES expansions(id),
    description     TEXT
);

CREATE TABLE IF NOT EXISTS championship_events (
    championship_id INTEGER NOT NULL REFERENCES championships(id) ON DELETE CASCADE,
    event_id        INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    stage_order     INTEGER NOT NULL,
    PRIMARY KEY (championship_id, event_id)
);

-- Rewards for completing events / championships
CREATE TABLE IF NOT EXISTS rewards (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT    NOT NULL,
    reward_type     TEXT    NOT NULL,       -- 'Car', 'Credits', 'XP', 'Cosmetic', 'Wheelie'
    car_id          INTEGER REFERENCES cars(id) ON DELETE SET NULL,
    credits_amount  INTEGER,
    xp_amount       INTEGER,
    description     TEXT
);

CREATE TABLE IF NOT EXISTS event_rewards (
    event_id        INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    reward_id       INTEGER NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
    placement       TEXT    NOT NULL DEFAULT 'any',   -- '1st', '2nd', '3rd', 'any'
    PRIMARY KEY (event_id, reward_id)
);

CREATE TABLE IF NOT EXISTS championship_rewards (
    championship_id INTEGER NOT NULL REFERENCES championships(id) ON DELETE CASCADE,
    reward_id       INTEGER NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
    placement       TEXT    NOT NULL DEFAULT 'any',
    PRIMARY KEY (championship_id, reward_id)
);

-- =============================================================================
-- SECTION 15: SEASONAL CONTENT
-- =============================================================================

CREATE TABLE IF NOT EXISTS seasons (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT    NOT NULL,       -- 'Spring', 'Summer', 'Autumn', 'Winter'
    season_number   INTEGER NOT NULL,       -- global week counter
    start_date      TEXT    NOT NULL,       -- ISO 8601
    end_date        TEXT    NOT NULL,
    theme           TEXT,
    playlist_points_required INTEGER
);

CREATE TABLE IF NOT EXISTS seasonal_events (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    season_id       INTEGER NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
    event_id        INTEGER REFERENCES events(id),
    event_type      TEXT    NOT NULL,
    -- 'Trial', 'Playground Games', 'PR Stunt', 'Monthly Rivals', 'Festival Playlist'
    name            TEXT    NOT NULL,
    reward_id       INTEGER REFERENCES rewards(id)
);

-- =============================================================================
-- SECTION 16: HORIZON STORIES (Story Chapters)
-- =============================================================================

CREATE TABLE IF NOT EXISTS stories (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT    NOT NULL,
    slug            TEXT    NOT NULL UNIQUE,
    description     TEXT,
    expansion_id    INTEGER REFERENCES expansions(id),
    num_chapters    INTEGER,
    thumbnail_url   TEXT
);

CREATE TABLE IF NOT EXISTS story_chapters (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    story_id        INTEGER NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    chapter_number  INTEGER NOT NULL,
    name            TEXT    NOT NULL,
    event_id        INTEGER REFERENCES events(id),
    reward_id       INTEGER REFERENCES rewards(id),
    three_star_req  TEXT,
    UNIQUE (story_id, chapter_number)
);

-- =============================================================================
-- SECTION 17: ACCOLADES & ACHIEVEMENTS
-- =============================================================================

CREATE TABLE IF NOT EXISTS accolade_categories (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL UNIQUE,   -- 'Exploration', 'Racing', 'Stunts', …
    icon_url    TEXT
);

CREATE TABLE IF NOT EXISTS accolades (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id     INTEGER NOT NULL REFERENCES accolade_categories(id) ON DELETE CASCADE,
    name            TEXT    NOT NULL,
    description     TEXT,
    reward_xp       INTEGER DEFAULT 0,
    reward_cr       INTEGER DEFAULT 0,
    is_hidden       INTEGER NOT NULL DEFAULT 0,   -- secret accolade
    UNIQUE (category_id, name)
);

-- =============================================================================
-- SECTION 18: HORIZON OPEN / MULTIPLAYER CLASSES
-- =============================================================================

CREATE TABLE IF NOT EXISTS open_class_rules (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT    NOT NULL UNIQUE,
    pi_min          INTEGER,
    pi_max          INTEGER,
    notes           TEXT
);

-- =============================================================================
-- SECTION 19: CAR COLLECTIONS / TAGS (wiki-side grouping)
-- =============================================================================

CREATE TABLE IF NOT EXISTS tags (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    name    TEXT    NOT NULL UNIQUE,        -- 'JDM', 'Drift Car', 'Sleeper', …
    slug    TEXT    NOT NULL UNIQUE,
    color   TEXT                            -- hex color for badge UI
);

CREATE TABLE IF NOT EXISTS car_tags (
    car_id  INTEGER NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    tag_id  INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (car_id, tag_id)
);

-- =============================================================================
-- SECTION 20: WIKI METADATA (for the Next.js site)
-- =============================================================================

-- Free-form wiki articles (guides, lore, tips…)
CREATE TABLE IF NOT EXISTS wiki_articles (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    title           TEXT    NOT NULL,
    slug            TEXT    NOT NULL UNIQUE,
    content_md      TEXT,                   -- Markdown body
    category        TEXT,
    -- 'Guide', 'Update Notes', 'Meta', 'Car Spotlight', 'Event Recap'
    author          TEXT,
    published       INTEGER NOT NULL DEFAULT 0,
    created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Related cars pinned to a wiki article
CREATE TABLE IF NOT EXISTS article_cars (
    article_id  INTEGER NOT NULL REFERENCES wiki_articles(id) ON DELETE CASCADE,
    car_id      INTEGER NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, car_id)
);

-- Images / media assets
CREATE TABLE IF NOT EXISTS media_assets (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_type TEXT    NOT NULL,           -- 'car', 'track', 'event', 'article'
    entity_id   INTEGER NOT NULL,
    url         TEXT    NOT NULL,
    alt_text    TEXT,
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_media_entity ON media_assets(entity_type, entity_id);

-- =============================================================================
-- SECTION 21: SEED DATA — Reference tables
-- =============================================================================

-- PI Classes
INSERT INTO pi_classes (label, pi_min, pi_max, sort_order) VALUES
    ('D',  100, 500, 1),
    ('C',  501, 600, 2),
    ('B',  601, 700, 3),
    ('A',  701, 800, 4),
    ('S1', 801, 900, 5),
    ('S2', 901, 998, 6),
    ('X',  999, 999, 7);

-- Drivetrain layouts
INSERT INTO drivetrain_layouts (code, description) VALUES
    ('FWD', 'Front-Wheel Drive'),
    ('RWD', 'Rear-Wheel Drive'),
    ('AWD', 'All-Wheel Drive');

-- Engine aspirations
INSERT INTO engine_aspirations (name) VALUES
    ('Naturally Aspirated'),
    ('Turbocharged'),
    ('Twin-Turbocharged'),
    ('Quad-Turbocharged'),
    ('Supercharged'),
    ('Twincharged'),
    ('Electric'),
    ('Hybrid');

-- Powertrain types
INSERT INTO powertrain_types (name) VALUES
    ('Petrol'),
    ('Diesel'),
    ('Full Electric'),
    ('Hybrid'),
    ('Hydrogen');

-- Engine configurations
INSERT INTO engine_configs (code, description) VALUES
    ('I3',      'Inline 3-cylinder'),
    ('I4',      'Inline 4-cylinder'),
    ('I5',      'Inline 5-cylinder'),
    ('I6',      'Inline 6-cylinder'),
    ('V6',      'V6'),
    ('V8',      'V8'),
    ('V10',     'V10'),
    ('V12',     'V12'),
    ('V16',     'V16'),
    ('H4',      'Flat / Boxer 4-cylinder'),
    ('H6',      'Flat / Boxer 6-cylinder'),
    ('W12',     'W12'),
    ('W16',     'W16'),
    ('Rotary',  'Rotary (Wankel)'),
    ('Electric','Electric Motor');

-- Transmission types
INSERT INTO transmission_types (name) VALUES
    ('Manual'),
    ('Automatic'),
    ('Dual-Clutch (DCT)'),
    ('Sequential'),
    ('CVT'),
    ('Single-Speed Electric');

-- Upgrade top-level categories (matches in-game menu order)
INSERT INTO upgrade_categories (name, slug, sort_order) VALUES
    ('Engine',                  'engine',           1),
    ('Platform & Handling',     'platform-handling',2),
    ('Drivetrain',              'drivetrain',        3),
    ('Tires & Rims',            'tires-rims',       4),
    ('Aero & Appearance',       'aero-appearance',  5),
    ('Conversions',             'conversions',      6);

-- Engine sub-categories
INSERT INTO upgrade_subcategories (category_id, name, slug, sort_order) VALUES
    (1, 'Air Intake',           'air-intake',           1),
    (1, 'Fuel System',          'fuel-system',          2),
    (1, 'Ignition',             'ignition',             3),
    (1, 'Exhaust',              'exhaust',              4),
    (1, 'Camshaft',             'camshaft',             5),
    (1, 'Valves',               'valves',               6),
    (1, 'Displacement',         'displacement',         7),
    (1, 'Pistons / Compression','pistons-compression',  8),
    (1, 'Turbo',                'turbo',                9),
    (1, 'Twin Turbo',           'twin-turbo',          10),
    (1, 'Supercharger',         'supercharger',        11),
    (1, 'Intercooler',          'intercooler',         12),
    (1, 'Oil Cooling',          'oil-cooling',         13),
    (1, 'Flywheel',             'flywheel',            14),
    (1, 'Engine Block',         'engine-block',        15);

-- Platform & Handling sub-categories
INSERT INTO upgrade_subcategories (category_id, name, slug, sort_order) VALUES
    (2, 'Brakes',               'brakes',               1),
    (2, 'Springs & Dampers',    'springs-dampers',      2),
    (2, 'Anti-Roll Bars',       'anti-roll-bars',       3),
    (2, 'Chassis Reinforcement','chassis-reinforcement',4),
    (2, 'Weight Reduction',     'weight-reduction',     5),
    (2, 'Roll Cage',            'roll-cage',            6);

-- Drivetrain sub-categories
INSERT INTO upgrade_subcategories (category_id, name, slug, sort_order) VALUES
    (3, 'Clutch',               'clutch',               1),
    (3, 'Transmission',         'transmission',         2),
    (3, 'Driveline',            'driveline',            3),
    (3, 'Differential',         'differential',         4);

-- Tires & Rims sub-categories
INSERT INTO upgrade_subcategories (category_id, name, slug, sort_order) VALUES
    (4, 'Compound',             'compound',             1),
    (4, 'Width',                'width',                2),
    (4, 'Rims',                 'rims',                 3);

-- Aero & Appearance sub-categories
INSERT INTO upgrade_subcategories (category_id, name, slug, sort_order) VALUES
    (5, 'Front Bumper',         'front-bumper',         1),
    (5, 'Rear Bumper',          'rear-bumper',          2),
    (5, 'Side Skirts',          'side-skirts',          3),
    (5, 'Front Wing / Splitter','front-wing',           4),
    (5, 'Rear Wing',            'rear-wing',            5),
    (5, 'Hood',                 'hood',                 6),
    (5, 'Roll Bar',             'roll-bar',             7),
    (5, 'Wide Body Kit',        'wide-body-kit',        8);

-- Conversions sub-categories
INSERT INTO upgrade_subcategories (category_id, name, slug, sort_order) VALUES
    (6, 'Engine Swap',          'engine-swap',          1),
    (6, 'Drivetrain Conversion','drivetrain-conversion',2),
    (6, 'Aspiration Conversion','aspiration-conversion',3);

-- Common upgrade tiers (example parts for Tires compound)
INSERT INTO upgrades (subcategory_id, name, tier, sort_order) VALUES
    -- Tire compounds (subcategory_id = 19, slug = 'compound')
    (19, 'Stock',           'Stock',    1),
    (19, 'Street Tires',    'Street',   2),
    (19, 'Sport Tires',     'Sport',    3),
    (19, 'Race Tires',      'Race',     4),
    (19, 'Drag Tires',      'Race',     5),
    (19, 'Drift Tires',     'Race',     6),
    (19, 'Rally Tires',     'Rally',    7),
    (19, 'Offroad Tires',   'Offroad',  8),
    (19, 'Dirt Tires',      'Offroad',  9),
    (19, 'Snow Tires',      'Offroad', 10),
    (19, 'Semi-Slick Tires','Race',    11),
    (19, 'Slick Tires',     'Forza',   12);

-- Acquisition methods
INSERT INTO acquisition_methods (name) VALUES
    ('Autoshow'),
    ('Auction House'),
    ('Barn Find'),
    ('Gift Drop'),
    ('Forzathon Shop'),
    ('Festival Playlist Reward'),
    ('Story Reward'),
    ('EventLab Reward'),
    ('Seasonal Reward'),
    ('DLC Pack'),
    ('Horizon Promo'),
    ('Wheelspins');

-- Car types
INSERT INTO car_types (name) VALUES
    ('Coupe'),
    ('Sedan / Saloon'),
    ('Convertible / Roadster'),
    ('Hatchback'),
    ('Estate / Wagon'),
    ('SUV / Crossover'),
    ('Pickup Truck'),
    ('Van / Utility'),
    ('Buggy / Off-Roader'),
    ('Supercar'),
    ('Hypercar'),
    ('Muscle Car'),
    ('Drift Car'),
    ('Drag Car'),
    ('Race Car'),
    ('Classic / Vintage'),
    ('Truck');

-- Car divisions
INSERT INTO car_divisions (name, slug) VALUES
    ('Modern Supercars',            'modern-supercars'),
    ('Retro Supercars',             'retro-supercars'),
    ('Hypercars',                   'hypercars'),
    ('GT Cars',                     'gt-cars'),
    ('Super GT',                    'super-gt'),
    ('Extreme Track Toys',          'extreme-track-toys'),
    ('Forza GT',                    'forza-gt'),
    ('Vintage Racers',              'vintage-racers'),
    ('Retro Racers',                'retro-racers'),
    ('Modern Race Cars',            'modern-race-cars'),
    ('Touring Cars',                'touring-cars'),
    ('Super Saloons',               'super-saloons'),
    ('Classic Muscle',              'classic-muscle'),
    ('Modern Muscle',               'modern-muscle'),
    ('Retro Muscle',                'retro-muscle'),
    ('Sports Cars',                 'sports-cars'),
    ('Classic Sports Cars',         'classic-sports-cars'),
    ('Modern Sports Cars',          'modern-sports-cars'),
    ('Retro Sports Cars',           'retro-sports-cars'),
    ('Super Hot Hatch',             'super-hot-hatch'),
    ('Retro Hot Hatch',             'retro-hot-hatch'),
    ('Pickup Trucks',               'pickup-trucks'),
    ('Vans & Utility',              'vans-and-utility'),
    ('Sports Utility Heroes',       'sports-utility-heroes'),
    ('Extreme Offroad',             'extreme-offroad'),
    ('Offroad Buggies',             'offroad-buggies'),
    ('Classic Rally',               'classic-rally'),
    ('Rally Monsters',              'rally-monsters'),
    ('Cult Cars',                   'cult-cars'),
    ('Rare Classics',               'rare-classics'),
    ('Drift Cars',                  'drift-cars'),
    ('Drag Cars',                   'drag-cars');

-- Event types
INSERT INTO event_types (name) VALUES
    ('Road Racing'),
    ('Dirt Racing'),
    ('Cross Country'),
    ('Street Scene'),
    ('Drag Strip'),
    ('Drift Zone'),
    ('Speed Zone'),
    ('Danger Sign'),
    ('Trailblazer'),
    ('Speed Trap'),
    ('Showcase Remix'),
    ('Horizon Story'),
    ('Horizon Open'),
    ('Team Adventure'),
    ('EventLab Custom');

-- Base game expansion
INSERT INTO expansions (name, slug, is_base_game) VALUES
    ('Base Game', 'base', 1);

-- =============================================================================
-- SECTION 22: VIEWS (handy queries for the Next.js API layer)
-- =============================================================================

-- Full car card view with all key info joined
CREATE VIEW IF NOT EXISTS v_car_summary AS
SELECT
    c.id,
    c.slug,
    c.year,
    m.name              AS manufacturer,
    c.model,
    c.variant,
    c.full_name,
    ct.name             AS car_type,
    cd.name             AS division,
    dl.code             AS drivetrain,
    pt.name             AS powertrain_type,
    ec.code             AS engine_config,
    ea.name             AS aspiration,
    ce.displacement_cc,
    ce.power_hp,
    ce.torque_nm,
    cs.pi_value,
    pc.label            AS pi_class,
    cs.speed,
    cs.handling,
    cs.acceleration,
    cs.launch,
    cs.braking,
    cs.offroad,
    cs.top_speed_kmh,
    cs.top_speed_mph,
    cs.accel_0_60_mph,
    c.is_dlc,
    c.is_barn_find,
    c.is_exclusive,
    exp.name            AS expansion,
    c.thumbnail_url
FROM cars c
LEFT JOIN manufacturers m           ON m.id  = c.manufacturer_id
LEFT JOIN car_types ct              ON ct.id = c.car_type_id
LEFT JOIN car_divisions cd          ON cd.id = c.division_id
LEFT JOIN drivetrain_layouts dl     ON dl.id = c.drivetrain_id
LEFT JOIN powertrain_types pt       ON pt.id = c.powertrain_type_id
LEFT JOIN car_engines ce            ON ce.car_id = c.id
LEFT JOIN engine_configs ec         ON ec.id = ce.engine_config_id
LEFT JOIN engine_aspirations ea     ON ea.id = ce.aspiration_id
LEFT JOIN car_stats_stock cs        ON cs.car_id = c.id
LEFT JOIN pi_classes pc             ON pc.id = cs.pi_class_id
LEFT JOIN expansions exp            ON exp.id = c.expansion_id;

-- Upgrade parts with full hierarchy labels
CREATE VIEW IF NOT EXISTS v_upgrades_full AS
SELECT
    u.id,
    uc.name     AS category,
    us.name     AS subcategory,
    u.name      AS upgrade_name,
    u.tier,
    u.description,
    u.delta_power_hp,
    u.delta_torque_nm,
    u.delta_weight_kg
FROM upgrades u
JOIN upgrade_subcategories us ON us.id = u.subcategory_id
JOIN upgrade_categories uc    ON uc.id = us.category_id;

-- Cars and how to acquire them
CREATE VIEW IF NOT EXISTS v_car_acquisition AS
SELECT
    c.id                AS car_id,
    c.slug,
    c.full_name,
    am.name             AS acquisition_method,
    ca.base_price_cr,
    ca.is_currently_available,
    ca.notes,
    exp.name            AS expansion
FROM car_availability ca
JOIN cars c                  ON c.id  = ca.car_id
JOIN acquisition_methods am  ON am.id = ca.acquisition_method_id
LEFT JOIN expansions exp      ON exp.id = ca.expansion_id;

-- =============================================================================
-- END OF SCHEMA
-- =============================================================================