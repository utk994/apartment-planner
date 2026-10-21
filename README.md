# Room by room — apartment interiors planner

A buildless apartment interiors planner for living, dining, kitchen and utility. Compare dimension-matched furniture, real product links, cabinetry studies and saved room layouts.

## GitHub Pages

Publish this folder as the repository root. In repository **Settings → Pages**, choose **Deploy from a branch**, then **main / (root)**. The included `.nojekyll` serves the plain files directly; no build or package installation is needed.

The site works beneath a project URL such as `https://USERNAME.github.io/apartment-planner/`. All dependencies, images and textures are included locally.

The included `workspace.json` supplies the saved starting designs. Subsequent changes save in the visitor's browser on that device; they do not update GitHub, sync across devices or change another visitor's workspace. Use **Export backup** and **Import backup** to move edits between devices or bring them back into the local planning project. A newer published snapshot wins over an older browser copy by its saved timestamp; export before replacing the published snapshot.

## Local editing

The Codex review copy runs at `http://127.0.0.1:8766/` with local file saving. The server source is included as `serve.py`; from this folder run:

```sh
python3 serve.py
```

Open the printed local URL. All images, libraries and textures are local. No installation or build is required. Keep the local server running while using the workspace.

For a generic static server, the planner falls back to browser storage plus JSON export/import. The custom local server additionally saves `workspace.json` in this folder so Codex can pick up the latest choices during the next conversation.

## Explore

- **Overall plan** opens a full-width top-down view of the complete apartment, with room names, builder dimensions, 1.2 m wall sections and the current saved layout from each furnished room. It is read-only; choose Living, Dining or Kitchen + utility above the plan to edit that room. Bedrooms and bathrooms are shown unfurnished. Use Room plan, 3D cutaway or Eye level to return to the active room.

- Start with Airy everyday, Laid-back lounge or Timber & company. Changing layouts preserves the other arrangements.
- **Passage options** compares no ottoman (recommended), a 45 cm movable pouf, and a slim C-table. Variations retain the original lounge and include a short custom jali.
- **Custom furniture** tracks the made-to-order jali: concept dimensions, material, design, finish, fixing notes, progress, maker, quote and decisions. Edit its brief directly; placed jali dimensions follow the room inspector. Quotes are tracked separately from the product subtotal.
- **Electronics** keeps product links, statuses and notes separately from furniture. The LG C5 65-inch size reference can be viewed on the wall or its stand; its price remains open.
- Use Plan, 3D cutaway or Eye level. Drag empty space to orbit/look; scroll or pinch to zoom in plan/cutaway.
- Product links appear directly in the room list and selected-item inspector. Unmatched placeholders are labelled “no product chosen.”
- Tiles are confirmed everywhere except the main bedroom. Warm ivory 60 × 60 cm tiles are currently an illustrative study; the main-bedroom finish remains unconfirmed.
- Select furniture through the room or list. Drag to move; arrow keys nudge 5 cm; R rotates 15°. Use the inspector for exact positions, dimensions and rotation.
- Published product dimensions are locked. “Make size study” turns that placed copy into an adjustable, unpriced study; the original product remains in the shortlist.
- Save named layout variations, add products by link and dimensions, keep shortlist statuses and notes, and finalise/reopen the room.
- Export and import a full JSON workspace backup. Undo retains the last 30 edits in the current session.

Position fields refer to the furniture footprint centre, measured from the left inside wall and the balcony-side inside wall. Product widths are their local furniture widths, which rotate with the object.

## Planning accuracy

The builder room dimensions are provisionally used as internal clear dimensions; this is not a site survey. The balcony opening is estimated by scaling the image. Footprint checks detect room-boundary crossings, overlaps and occupation of a 60 cm balcony guide and a 90 cm foyer-to-dining guide; chaise checks use an L-shaped footprint. These are layout aids, not complete comfort, circulation or accessibility checks. Furniture is represented by dimension-matched proxies; manufacturer photos and links provide styling reference. Finishes are illustrative.

The ₹15–20L budget shown is for all interiors. The priced subtotal covers only priced pieces placed in the active living-room layout, with unpriced studies separately counted. It is not a complete living-room quote.

See `CREDITS.md` for real project references, product URLs, checked prices, texture sources and licenses.

## Dining workspace

Use the **Living / Dining** switch to return to each room's last layout. Furniture variants, room notes and finalisation progress are retained by room; the Electronics and Custom furniture records remain shared across the flat. The dining shortlist includes linked IKEA tables and chairs, with daily four-seat and temporary six-seat configurations. Furniture in the adjacent room is shown as non-editable context; switch rooms to adjust it.

Dining checks use a 90 cm southern passage guide, estimated doorway approaches, and a dashed 35 cm chair pull-back study. They are planning aids based on the builder dimensions, not site verification. Read `CREDITS.md` for the exact source dimensions and remaining assumptions.

## Complete dining ideas

The Dining view now opens three whole-room schemes. Each has crockery storage, lighting, art and finishing touches as well as the table and chairs. **Room details** keeps material direction, storage limitations, lighting-height studies, product links and pricing exclusions together. The room list is grouped into dining/seating, crockery storage, lighting and art/styling. **Saved layouts & size studies** retains earlier comparisons. The two extendable schemes have a reversible **Six-seat check / Back to four seats** control, saved as separate arrangements. Scheme identity, hanging heights and guest-study links are included in backups.

## Kitchen + utility · modular concepts

Three new alternatives share the kitchen (13′2″ × 8′10″) and utility (8′5″ × 6′0″): **Open parallel**, **L-worktop + pantry** and **Prep island**. Countertop alterations are permitted. All joinery is proposed. The original scene's fixed counters / return have been replaced with the selected kitchen layout, so an island or breakfast bar is never implied to exist already.

Use **Both spaces / Kitchen / Utility** to focus the model. **Plan** hides raised storage; **3D cutaway** and **Eye level** show it. Select modules to adjust dimensions, position, rotation, zone, purpose and raised mounting height. **Layout & cabinet brief** contains the live module schedule, storage and finish intent, references and unresolved measurements. **Add a cabinet module** adds an adjustable base, tall, upper or appliance reserve. The prep-island option has a separate optional breakfast variant with a 25 cm overhang and two study stools. The west seating side is not a protected through-route.

Six custom-furniture packages track each alternative's kitchen and utility separately. Their dimensions describe the room envelope, not a single cabinet. Module dimensions remain in the layout and its brief. Maker, specification, quote, progress and notes save locally and export in the workspace backup. Compare alternative quotes separately. All new prices are pending; no appliance products or costs have been assumed.

Clearance checks compare room envelopes, cabinet volumes / height, kitchen entry, the scaled utility approach, working gaps and 60 cm floor-cabinet opening allowances. The blind corner is reached via the proposed return; its hardware and final access need development. Nominal gaps: parallel / pantry 266 cm between deepest opposing units; island 127 cm working side / 99 cm utility end; utility 121 cm. These are provisional geometry checks, not a site survey or installation drawing. Appliance doors, ventilation, occupied seats, gas / plumbing / electrical / exhaust, window travel and floor traps remain unverified. The utility opening is approximately 105 cm scaled from the drawing. Existing countertop height and finished wall measurements still need checking.

## Utility-facing cooking + seven appliance requirements

A fourth, separate proposal, **Utility-facing cooking**, retains the existing doorway estimate and places a 75 cm-class cooktop allowance on a 90 cm base along the bottom kitchen wall, right of the utility entrance. This uses the wall continuation toward the service / shaft area: the part directly shared with utility is only about 64 cm right of the doorway (about 87 cm left of it) in the scaled model. Continuous backing, actual doorway and an installer-confirmed outside chimney route must be verified. No door relocation is assumed.

Left run: a 90 × 80 cm fridge bay, 65 cm outer tower for a dedicated oven and separate microwave, then a 110 cm countertop station for mixer grinder, juicer and coffee maker. The right run retains 90 cm of clear main prep, a 60 cm sink module and corner access. Proposed base depth is 65 cm. The appliance parking widths total 90 cm plus 20 cm combined gaps; these do not establish operating / jar / water-tank / cord space. Larger models, a side-by-side fridge or extra coffee equipment can require a redesign. The corner fitting remains unresolved.

All seven requirements are saved in **Electronics** as model-pending size allowances. They link to the planned cabinet location; the oven and microwave have separate positions within one tower. The selected appliances, installation niches, heat / ventilation / door clearances and circuits are still pending. Earlier kitchen alternatives and all prior-room decisions are retained. The new kitchen and utility have their own custom quotation records. The cabinet brief includes appliance allowances and the wall limitation. It is a concept study, not confirmation that any specific appliance set will fit.

## Cabinet colour previews

The Kitchen sidebar now offers **Sand + ivory**, **Light ash + white**, and **Walnut + ivory** on the same layout. Preview lower / tall and upper cabinets separately, with coordinated worktop studies. Sand + ivory is the initial neutral preview; changing a preview preserves module geometry and the seven appliance allocations. Each layout saves its own finish, including saved variations and backups. The matching custom package tracks the selected preview; manually edited finish specifications are preserved.

**Colours, materials & references** links the real manufacturer finish families and explains the material differences. IKEA front references are colour inspiration for the custom study, not an assumption that their doors fit the proposed modules. Greenlam laminates require the maker's substrate / edge specification. Colours and wood grain are approximations; countertop products, finish prices, local stock and physical samples remain to choose. Existing tile colour is still provisional.

## Utility · separate laundry, dishwasher and cleaning storage

**Laundry + cleaning utility** is a new layout based on the current kitchen arrangement. It retains the kitchen modules and finish, with a dedicated utility proposal. The user agreed to a separate dryer above a front-loading washer. The preceding layouts remain available.

The 256.5 × 182.9 cm utility contains a 70 × 80 × 185 cm washer / dryer stack envelope at the left front; a 65 × 65 × 90 cm dishwasher bay at the right rear; a shallow 60 × 50 × 90 cm sink / pull-out-bin module at the right front; a 60 × 25 × 170 cm mop / broom / dustpan hanging zone at the left rear, including a drip area; and a 125 × 30 × 65 cm upper cleaning-supply cupboard with its bottom at 155 cm. All are generic outer planning dimensions. Bin size / trap layout and actual internal storage are unresolved.

The opposing units leave a minimum closed aisle of 122.54 cm. Dashed 60 cm opening rectangles leave approximately 102.54 cm at the dishwasher and 62.54 cm at the laundry. The laundry opening narrows the front aisle; do not assume a usable bypass while loading. These are envelope comparisons, not actual appliance-door or occupant measurements. Clearances update as units move, using opposing units in the same depth band instead of comparing unrelated corners.

**Utility** focus prioritises utility items in the list and hides kitchen furniture for inspection. **Both spaces** restores the full view. **Utility layout brief** records functions, appliance allowances, installation limits and references. A new custom furniture record tracks this utility package; dishwasher, washer and separate dryer are added to Electronics as model-pending requirements. New cabinet modules default to the focused zone.

Confirm the selected front-load washer / separate dryer pairing and compatible manufacturer stacking kit, appliance / hose / ventilation / door clearances, dryer tank or drain access, electrical requirements, weather exposure, window movement, floor traps and measured doorway. The dryer is supported through its approved stacking system, not ordinary cabinetry. No appliance model or price has been chosen.
