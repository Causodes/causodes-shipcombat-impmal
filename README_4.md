# Four-Player Crew Reference

**Guides**

[![Docs: Main Guide](https://img.shields.io/badge/Docs-Main_Guide-57606a?style=flat-square)](README.md)
[![Crew Guide: 3 Players](https://img.shields.io/badge/Crew_Guide-3_Players-0969da?style=flat-square)](README_3.md)
[![Crew Guide: 4 Players](https://img.shields.io/badge/Crew_Guide-4_Players-1f883d?style=flat-square)](README_4.md)
[![Crew Guide: 5 Players](https://img.shields.io/badge/Crew_Guide-5_Players-b35900?style=flat-square)](README_5.md)
[![Crew Guide: 6 Players](https://img.shields.io/badge/Crew_Guide-6_Players-c21f39?style=flat-square)](README_6.md)

**Stations**

[![Station: Supreme Commander](https://img.shields.io/badge/Station-Supreme_Commander-8250df?style=flat-square)](#supreme-commander)
[![Station: Engineer](https://img.shields.io/badge/Station-Engineer-1f883d?style=flat-square)](#engineer)
[![Station: Helmsman](https://img.shields.io/badge/Station-Helmsman-b35900?style=flat-square)](#helmsman)
[![Station: Gunnery Officer](https://img.shields.io/badge/Station-Gunnery_Officer-c21f39?style=flat-square)](#gunnery-officer)

| Role | Player Skill | Station |
|------|-------------|---------|
| Supreme Commander | Presence (Leadership) | Command Bridge |
| Engineer | Tech (Engineering) | Reactor Status |
| Helmsman | Reflexes (Major Ship) | Navigation Bridge |
| Gunnery Officer | Ranged (Ordnance) | Ordnance Deck |

---

## Supreme Commander
*Skill: Presence (Leadership)*

The Supreme Commander tab manages damage control, sensor operations, and the **Standing Orders** deck - a hand of tactical order cards drawn each round.

### Initiative

Click the d20 icon to roll ship initiative for the combat tracker: `1d10 + Leadership skill total / 100`. The fractional part acts as a tiebreaker.

### Command Allocation

Roll Presence (Leadership) once per round. Allocate the SL to:

| Track | Effect per SL |
|-------|--------------|
| Inspire | +1 to next round's starting hand limit |
| Resolve | +1 mulligan this round |
| Initiative | +1 to next round's combat-tracker initiative |

### Damage Control

Each repair action steps one ship condition down one tier, costing 10% of maximum Auxiliary Power. The allotment is always 2 per round.

### Sensor Radar

The Supreme Commander also operates the **Sensor Radar**: an interactive canvas overlay plotting all ship tokens as blips. The primary task is building and maintaining **Sensor Locks** on enemy contacts.

### Sensor Locks

| Tier | Action | AP Cost | Information Revealed |
|------|--------|---------|----------------------|
| 0 | Passive trace | - | Bearing only; not visible to crew |
| 1 | Active Ping | 3 | Ship class; enables Gunnery Officer targeting |
| 2 | Breach Analysis | 6 | Shield percentages per sector |
| 3 | Deep Scan | 10 | Armour, shields, hull, fire arcs per sector |
| 4 | Targeting Solution | 15 | +10 accuracy for Gunnery Officer; reveals active conditions |

Locks decay by one tier each round unless refreshed.

> **Autoscan bonus:** Targets within the auto-scan range are automatically locked at Tier 2 and grant a **doubled base hit chance** on weapon attacks (e.g. 50% → 75%).

### Battle Damage Assessment (Post-Fire)

After the Gunnery Officer fires, the Supreme Commander may perform one BDA correction (rolled with Leadership):

| Correction | Effect |
|-----------|--------|
| Adjust Bearing | +10 to hit on the next attack against this target |
| Target Weak Point | +SL armour penetration on the next attack |
| Fire for Effect | Crit threshold reduced by SL percentage points (e.g. SL 3: 10% → 7% of hull max) |
| Break Off, Reallocate | Drop target to Lock 0; grant 20% max AP |

### Targeted Utility Actions (require Lock 1)

| Action | Effect |
|--------|--------|
| Sensor Disruption | Target suffers –10 to all rolls for 1 round |
| Sensor Overcharge | Target weapon accuracy –20 for 2 rounds |
| Designate Torpedo | Freeze a hostile torpedo's helming for 1 round, or double a friendly torpedo's speed this turn |

### Global Actions (click own ship on radar; no lock required)

| Action | Effect |
|--------|--------|
| Lock Harmonics | Freeze all lock decay timers for 1 round |
| Range Amplifier | Double auto-scan range for 2 rounds |

### Standing Orders Deck

The 19-card deck is shuffled at combat start. The base starting hand limit is 3. At the start of each round, unplayed orders are retained up to the new limit and enough orders are drawn to refill the hand. Inspire raises the *next* round's limit by 1 per SL; without renewed Inspire, excess orders are discarded when the following round returns to the base limit. Playing an order removes that slot for the rest of the current round.

The Supreme Commander has 1 mulligan each round, plus 1 per SL allocated to Resolve. A mulligan discards one selected order and immediately draws a replacement into the same slot; the same slot can be mulliganed repeatedly while uses remain. The first mulligan locks command allocation for the round. The header projects this lifecycle as `(current cards/current limit) → (next cards/next limit)`.

If a non-empty draw pile contains too few orders to refill the hand, it is exhausted and that round begins below the limit. If a round would draw zero because the draw pile starts empty, the entire discard pile is shuffled into the draw pile before drawing normally.

Cards fall into four categories:

- **Boost**: grant Power Cores or bonuses to a specific role; played by dragging or clicking Play on the card
- **Shipwide**: broad tactical effects that apply to the whole vessel
- **Reaction**: played in response to incoming threats (outside your normal turn)
- **Gambit**: set a combat stance; takes effect at the start of the *next* round

---

## Engineer
*Skill: Tech (Engineering)*

The Engineer manages the reactor, distributing **Power Cores** to the other roles and keeping heat and internal fire under control, and manages the ship's void shields.

### Void Shield Management

Allocate available void flux across the four sectors (Bow, Stern, Port, Starboard) each round. Flux is generated by the Engineer's core dispatch. *Flux to AP* (free action): spend 1 flux for 1 Auxiliary Power.

### Core Distribution

Stage cores individually for crew stations, void shields, or Auxiliary Power conversion, then dispatch them all at once. A station Core joins the receiving operator's shared pool and can unlock that operator's Power Core actions. Cores committed to Auxiliary Power convert at the start of the next round.

*Overclock*: roll Engineering, gain +1 heat; on success gain one bonus Power Core for this round.

### System Heat

Heat accumulates from weapon fire and reactor events.

| Action | Effect |
|--------|--------|
| Rite of Cooling | Spend AP, roll Engineering; vent heat equal to AP spent + SL (minimum 1) |
| Emergency Vent | Instantly clear all heat; start Internal Fire equal to heat vented; locks core distribution next round |
| Hull Repair | Spend AP, roll Engineering; restore hull equal to AP spent + SL (minimum 1); costs +1 heat per HP; blocked while internal fire is active |
| Suppress Fire | Spend AP, roll Engineering; reduce fire by AP spent + SL (minimum 1) |

### Voidshield Flux

Each dispatched Power Core generates void flux the following round, which the Engineer allocates across the four shield sectors.

---

## Helmsman
*Skill: Reflexes (Major Ship)*

The Helmsman controls movement via the **Helm Control** panel, with a live canvas overlay showing the projected path, turning arc, and minimum-move zone.

### Helm Allocation

Roll Reflexes (Major Ship) once per round. Allocate SL to:

| Track | Effect per SL |
|-------|--------------|
| Speed | +1 void unit of movement this round |
| Maneuverability | +1 degree of bearing change this round |
| Evasion | −5% hit chance on all incoming weapon attacks this round |

### Helm Control

Commit thrust using the power bar slider (0–100%). Auxiliary Power can be diverted to extend the power bar maximum, at a conversion rate set by the engine component.

A **minimum move obligation** applies each round: you must move at least half of last round's distance (rounded up). The overlay shades the zone where the ship cannot stop.

### Power Core Actions

| Action | Effect |
|--------|--------|
| Full Plasma Burn | +100% power bar capacity this round |
| Flip and Burn | Rotate 180° in place, then burn sternward at half effective speed; requires ≥50% power remaining |
| Strafe | Translate sideways without changing heading |
| Retrograde | Fire bow thrusters; cancel forward momentum or push sternward |

### Ramming

Click the **Ram** button in the Helm Control panel (greyed out if no valid targets are in range with Lock ≥ 1). A popup lists all reachable enemies. Select a target and confirm.

- The ship moves to the target position
- Hull damage is dealt to both ships based on ramming speed; the struck quadrant is determined by the impact angle
- The ramming ship soaks incoming damage with its bow armour
- Post-ram: bow ordnance is locked and helm allocation is locked for the remainder of the round

---

## Gunnery Officer
*Skill: Ranged (Ordnance)*

The Gunnery Officer fires the ship's weapon batteries and manages crew logistics and ordnance deployment. Hostiles can only be targeted and damage can only be assessed with the assistance of the Supreme Commander.

### Gunnery Allocation

Roll Ranged (Ordnance) once per round. Allocate SL to:

| Track | Effect per SL |
|-------|--------------|
| Accuracy | +5 to hit |
| Penetration | +1 armour penetration |
| Firepower | +1 damage per hit |

### Weapon Battery Resource Types

| Type | Notes |
|------|-------|
| Ammo | Multiple fire modes: Salvo through Devastating Broadside |
| Auxiliary Power | Draws from AP; 4 intensity tiers |
| Heat | Shares the Engineer's heat track |

### Auxiliary Power Weapon Tiers

| Tier | Name | Damage Multiplier |
|------|------|-------------------|
| 1 | Glancing | 0.5× |
| 2 | Standard | 1× |
| 3 | Focused | 1.5× |
| 4 | Full Discharge | 2× |

### Main Actions

Crew are committed to a task and complete it after N rounds. Multiple actions can run simultaneously up to the crew limit.

| Action | Effect |
|--------|--------|
| Arm Torpedo | Prepares one torpedo for launch |
| Arm Strike Craft | Prepares one strike craft flight for launch |
| Launch Torpedo | Deploys one armed torpedo immediately |
| Launch Strike Craft | Deploys one ready strike craft immediately |
| Recall Craft | Recovers a strike craft within 3 VU |
| Load Ammo | Restores 20% of maximum ready rounds |
| Generate Power | Produces +5 Auxiliary Power |
| Damage Control | Reduces internal fire by 1 |
| Hull Repair Party | Restores +2 hull integrity |

### Power Core Actions

The Core Actions grid shows gunner and ordnance core actions in a 3-column layout.

| Action | Effect |
|--------|--------|
| Directed Fire | For every crit scored this round, the Gunnery Officer nominates the hit location instead of rolling |
| Extend Range | Double the sensor band size for the next weapon attack |
| Emergency Resupply | Immediately restore 25% of maximum ready rounds |
| Combat Recovery | Step destroyed, partial, or recovering strike craft airframes forward through repair stages |
| Shock Loading Rotation | Instantly complete one active crew commitment; effect applied immediately |
| Deck Conscription | +25% of max manpower as temporary crew this round, OR restore 10% of permanently lost crew |

### Deployed Ordnance Panel

The Deployed Ordnance panel lists all deployed torpedoes and strike craft. Each can be panned to on the canvas, and their turn completion can be toggled.
