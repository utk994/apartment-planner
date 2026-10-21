# Planner verification

Verified in local Chrome on 20 October 2026.

- All three starter layouts: no registered footprint overlaps, room-boundary crossings or objects in the 60 cm access guide.
- Actual canvas selection/drag moves the intended item.
- Published product dimensions stay locked; adjustable copies accept size changes, and Undo restores previous values.
- Named layout variations and custom product links save separately.
- Shortlist status and notes survive a reload. The real local saving endpoint was exercised; later UI checks isolated test data from the user workspace.
- Full JSON backup export and validated import work.
- Finalise/reopen actions work.
- Phone touch emulation at 390 × 844: layout and view controls respond to taps, with no page-wide horizontal overflow.
- No console/page errors.

Screenshots cover plan, cutaway and eye-level views for each direction. Furniture models are dimension-matched proxies and materials are illustrative. Geometry is based on builder dimensions and scaled estimates, not a site survey. Physical phones and retailer delivery availability were not tested.

## Product links and tile update

Verified the refreshed built-in browser shows retailer links in the active room list and selected-item details, with clear labels for unlinked size studies. The selected lounge and furniture positions are retained. The measurement dialog records tiles everywhere except the main bedroom, with a 60 cm warm ivory tile study explicitly marked provisional. Flooring metadata is included in the saved workspace. JavaScript syntax checks pass.

## Passage, LG C5 and electronics update

All three saved passage alternatives pass the registered floor-footprint and circulation-guide checks, including the new 90 cm foyer-to-dining guide. The recommended arrangement leaves approximately 106 cm at the dining turn in the current model. The jali remains a provisional joinery study.

Verified LG size-reference geometry settings for wall and tabletop modes, manufacturer links, separate electronics notes/status, custom electronics, export/import, and phone layout without horizontal overflow. No browser errors. Original furniture dimensions and positions were compared with the pre-update saved workspace and preserved.

A temporary verification note was detected in the live electronics card and removed. Subsequent editing checks ran on a separate local origin and scratch workspace; the user workspace was rechecked afterward and contains no test products or notes.

## Custom furniture tracker

Verified on the isolated scratch preview: maker, quote, status, notes and edited specification survive reload; custom furniture records are retained in JSON export/import. The four section tabs fit the phone layout without page overflow. No browser errors. The live workspace contains the jali concept record with blank maker and pending quote.

## Dining update — 20 October 2026

- Browser checked on isolated local port 8767; QA notes saved only to `work/room-planner/qa-workspace.json`.
- Room switching retains the living arrangement, its original note and finalised progress; dining has its own note and progress. Dining selection and test note survived reload.
- Focused geometry checks: both daily variants have four chairs, no placed / pulled-back overlaps or boundary issues, and over 90 cm southern clearance. The six-seat variant has six chairs and an explicit 82 cm passage warning. Moving test furniture beyond the boundary or into another piece produces the expected issues.
- Table and chair prices sum to ₹50,790 / ₹52,790 / ₹68,690 in the three alternatives. Published dimensions and current prices verified on official IKEA India pages.
- Export/import normalisation preserves dining layout identifiers, product fields, room notes, independent progress, shared electronics and custom joinery records.
- Updated JavaScript syntax checks pass. No new mobile viewport check was performed in this update.

## Complete dining schemes — 20 October 2026

- Three daily schemes checked for placed and pulled-back furniture collisions, room bounds, estimated door approaches, 91 cm southern passage and 60 cm cupboard-front access. All pass the model checks; this is not site verification.
- Intentional cupboard-access conflict produces a storage warning. Overhead fixtures, art and accessories on cupboards do not create false floor collisions.
- All schemes include a cupboard, pendant, table lamp, real linked art and four chairs. Product subtotals are ₹61,350 / ₹87,050 / ₹86,850. Art pairs count once.
- Isolated browser preview on port 8767: all three furnished models inspected; Room details and manufacturer links checked; plan view shows chair and cabinet access guides while overhead shades hide; six-seat comparison and return to four work. Guest choice / scheme metadata / elevation survived reload.
- Export/import normalisation checked for new item types, scheme metadata, guest source links, prices, hanging heights and image names containing digits. Existing layouts, living finalisation, electronics and custom joinery retained.
- JavaScript syntax checks pass. No new mobile viewport check was performed. User data was kept separate from the QA workspace.

## Kitchen + utility addition · 20 October 2026

- Syntax checked all edited JavaScript as ES modules. Revision 7 migration adds three kitchen / utility layouts and six custom package records, preserving prior living / dining layouts and room notes / finalisation decisions.
- Geometry checks pass all three seeded alternatives and the optional breakfast study. Computed gaps: parallel / pantry 266.32 cm; island working side 126.54 cm, utility end 99 cm; utility 120.54 cm. Countertop plans use builder dimensions as provisional clear internal dimensions.
- Negative checks detect a shifted island narrowing / overlapping the working aisle, an island blocking the utility approach, and raised storage exceeding the wall height.
- Backup normalisation retains kitchen scheme, module zone / role / elevation / dimensions / transforms, custom maker / quote / notes / progress and breakfast-variation linkage. Room package envelopes remain independent of individual module size edits.
- Isolated preview at 8767 verified all three layout switches, the live cabinet schedule, kitchen / utility focus, plan and 3D views, optional breakfast return navigation, module inspector, keyboard movement and undo (127 cm gap became 122 cm after a 5 cm nudge), custom record navigation, maker input / progress and earlier-room restoration. Living remained finalised; dining returned to Quiet modern and retained its note. No QA maker or test notes are copied into the live workspace.
- Scope limits: no new mobile viewport test; appliance models / installation, occupied stool geometry, window movement, service locations and fabrication details remain unverified. Plan view hides raised storage and shadows for footprint clarity.

## Utility-facing cooking / appliance brief · revision 8

- Added one independent proposal and two quotation packages. Migration preserves earlier layouts, room records, furniture shortlist and existing electronics. No prior proposal is overwritten.
- Seven user requirements each map to exactly one planned cabinet host. Dedicated oven and separate microwave share a tower without being conflated. Model-pending state, appliance-to-host IDs and the new scheme survive backup normalisation.
- Geometry checks pass the seeded proposal: utility-facing hob is oriented 180° against the bottom kitchen wall at Z = 8.89 m; opposing deepest-unit working gap is 256.32 cm, utility gap remains 120.54 cm. A 90 cm main prep run is reserved. The estimated utility doorway remains clear. Deliberately enlarged tower / relocated hob produce conflicts.
- Model detail checks: 65 cm outer oven / microwave tower, 110 cm small-appliance station, generic hob / hood volumes and provisional 75 cm vertical hood separation. These are concepts, not selected product installation dimensions.
- Isolated browser preview verified the fourth proposal, all eight Electronics entries including the earlier LG TV, explicit model-pending labels, full appliance brief / wall caveat, plan labels, and 3D tower / station / cooktop representation. No browser console errors observed. New camera and wall cutaway expose the tower and cooking run; eye-level retains full walls.
- Limitation is explicit: only about 64 cm of the right wall is directly shared with utility. The cooktop uses its continuation toward the service area; actual continuous backing, doorway, duct outlet, heat / operating clearances, corner fitting and appliance models remain unverified. No new mobile viewport test or site survey.
- Live preview confirmed the new proposal and eight Electronics entries. The plan camera now fits both room width and height in the existing narrow, tall viewport; appliance labels remain visible without clipping the room edges. Plan shadows are disabled, and utility-only labels are suppressed in kitchen focus.

## Cabinet finishes · revision 9

- Added three reversible colour previews with actual manufacturer reference links. Initial kitchen studies now use Sand + ivory unless a finish is already saved. No module dimensions, transforms, appliance requirements, notes, quoted amounts or suppliers are changed by applying a preview.
- Isolated browser preview verified Sand, light ash and walnut switching; base / tall and upper colours update independently and wood-effect palettes display illustrative grain. Selected palette name, thumbnails, room brief and reference dialog agree.
- Palette selection persists after reload; manufacturer links and material caveats display in the finish dialog and cabinet brief. Custom package records retain their selected preview separately from any manually edited finish specification. No browser console errors observed.
- Syntax checks passed edited JS modules. The existing native viewport was inspected; no new mobile viewport test. Colour / grain is approximate and cannot replace a physical sample. Worktop material products and finish pricing remain pending.

## Complete utility study · revision 10

- New layout retains the source kitchen geometry and selected finish, adds the agreed separate washer / dryer stack, separate dishwasher, sink / bin module, mop / broom / dustpan hanging / drip area and upper cleaning cupboard. Earlier layouts, room notes / finalisation, existing electronics and quote / supplier records remain intact.
- Geometry checks pass all new utility units and the inherited kitchen. Minimum closed opposing aisle 122.54 cm; a 60 cm opening allowance leaves 102.54 cm at the staggered dishwasher and 62.54 cm at the laundry. The scaled doorway approach remains clear. Deliberately moving the dishwasher into the doorway triggers a conflict; increasing the stack above wall height triggers a height issue.
- Appliance requirements each map to their cabinet / stack host. Three separate Electronics records are added, bringing the flat-wide list to eleven including TV and prior kitchen requirements. A new custom utility package tracks the specification and pending quote without duplicating the kitchen quote.
- Isolated browser preview verified Utility focus, 3D stacked appliance / cleaning rack proxies, all five utility list entries, the complete utility brief including 123 / 103 / 63 cm rounded clearance values, and plan labels / dashed opening rectangles. Reload retains the new layout and utility metadata. Utility focus hides kitchen furniture and prioritises utility items in the inspector list; Both spaces restores context.
- Syntax checks passed edited modules. Actual models, stacking compatibility / kit, installation clearances, bin / trap fit, services, weather exposure and window movement remain pending. No site survey or new mobile-viewport test was performed. Opening rectangles do not establish simultaneous appliance loading or an accessible bypass at the washer.


## Whole-apartment overview — 21 October 2026

Added the full apartment shell from the original model coordinates, including three bedrooms, three bathrooms, two balconies, foyer, living, dining, kitchen and utility. Current room variants are reused without changing furniture coordinates. The orthographic overview sections walls at 1.2 m and hides raised storage / pendants for floor readability. Door positions remain drawing-scaled studies. No bedroom or bathroom furniture is invented. Main bedroom flooring stays an unconfirmed neutral study.

Verified full-plan framing, labels, persisted overview after reload, navigation back to the room editor and return to overview. Furniture drag and keyboard movement are disabled in overview. Syntax checks passed for changed JavaScript. Static browser preview was used, leaving the real workspace JSON unchanged.
