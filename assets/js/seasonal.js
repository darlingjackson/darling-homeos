document.addEventListener("DOMContentLoaded", ()=>{
    "use strict";const SeasonalApp={
        VERSION:4, SEASON_ORDER:["spring", "summer", "fall", "winter"], SEASONS:{
            spring:{
                name:"Spring Renewal", short:"SP", description:"Fresh air, decluttering, detailed cleaning and opening the home back up.", message:"Refresh, release and reset the home after winter.", range:"MAR 01 — MAY 31", prepMessage:"Spring is approaching. Start with decluttering, lighter linens, windows and the first outdoor reset."
            }, summer:{
                name:"Summer Reset", short:"SU", description:"Outdoor living, lighter routines, entertaining and warm-weather home care.", message:"Keep the home light, functional and ready for summer living.", range:"JUN 01 — AUG 31", prepMessage:"Summer is approaching. Shift the home toward lighter routines, cold storage, outdoor living and easy hosting."
            }, fall:{
                name:"Fall Refresh", short:"FA", description:"Cooler-weather preparation, deeper cleaning, cozy spaces and hosting readiness.", message:"Prepare the home for cooler weather, gathering and cozy living.", range:"SEP 01 — NOV 30", prepMessage:"Fall is approaching. Start rotating linens, checking cooler-weather storage, staging hosting areas and planning the first cozy details."
            }, winter:{
                name:"Winter Reset", short:"WI", description:"Winter comfort, protection, Christmas-ready spaces and year-end home care.", message:"Protect, warm and prepare the home for winter and the Christmas season.", range:"DEC 01 — FEB 28/29", prepMessage:"Winter is approaching. Focus on warmth, protection, holiday-ready spaces and year-end home care."
            }
        }, TASK_LIBRARY:{
            resetPrep:["Gather trash bags", "Bring in a donation box or bin", "Bring in a basket for items that belong somewhere else in the house", "Clear enough floor and surface space to work safely", "Remove obvious trash and recycling", "Return obvious items to their correct rooms", "Take dirty washable textiles to the laundry room", "Gather cleaning supplies in one place", "Have microfiber cloths available", "Have a small detail brush or toothbrush available", "Have labels or a temporary marker available while reorganizing", "Take quick before pictures if you want a reset comparison", "Create Keep Here, Relocate, Donate and Trash/Recycle sorting categories", "Work one contained section at a time so the whole zone does not explode at once"],

            bedroom:["Clear nightstands, dressers and visible surfaces", "Remove cups, papers, chargers and items that belong elsewhere", "Wipe furniture tops, fronts, sides, legs and handles", "Empty and wipe nightstand drawers one section at a time", "Declutter dresser drawers one section at a time", "Dust headboard and bed frame", "Dust lamps and shades", "Clean mirrors and glass", "Dust picture frames and decor before returning them", "Clean electronics and charging areas appropriately", "Vacuum beneath bed", "Review under-bed storage and remove items that do not belong", "Dust upper corners and vents", "Clean doors, handles and trim", "Spot-clean wall scuffs and fingerprints", "Clean switch plates and outlet covers carefully", "Clean baseboards including top lip and corners", "Remove anything that makes the room feel visually cluttered"],

            bedding:["Strip beds completely", "Wash sheets and pillowcases", "Wash mattress protectors if care instructions allow", "Wash or refresh comforters, duvets or quilts as appropriate", "Wash removable pillow covers and shams", "Vacuum mattress surfaces and seams", "Rotate mattresses if recommended", "Wipe bed frames and accessible supports", "Vacuum beneath beds thoroughly", "Review spare pillows and blankets", "Remake beds with clean seasonal bedding"],

            closet:["Work one closet section at a time", "Remove clothing that is stained, damaged or no longer worn", "Create a donation pile for usable clothing no longer needed", "Review shoes for fit and condition", "Review bags, belts and accessories", "Return empty hangers to one area", "Group clothing by type and the color system that works for your household", "Move current-season clothing to easiest access", "Move off-season clothing to secondary storage as appropriate", "Wipe closet shelves", "Dust closet rods and upper corners", "Clean storage bins and baskets", "Review labels", "Vacuum closet floors and edges", "Clean closet doors, handles and trim", "Return only items with a defined home"],

            bathroom:["Remove toiletries and countertop items", "Discard expired, empty or unused personal-care products", "Clean vanity countertop and backsplash", "Clean sink basin, drain, faucet and faucet base", "Clean mirrors edge to edge", "Empty and wipe vanity drawers and cabinets one section at a time", "Clean drawer organizers before returning products", "Clean shower or tub walls and corners", "Clean shower door, tracks and hardware if present", "Clean shower head and fixtures", "Clean grout lines as needed", "Clean toilet exterior, seat, hinges, bowl and surrounding floor", "Clean towel bars, hooks and toilet-paper holder", "Wash bath mats", "Wash or replace shower liner if needed", "Clean bathroom vent cover", "Wipe light fixtures and switch plates", "Clean doors, trim and baseboards", "Vacuum or sweep edges before mopping", "Mop floor last", "Restock toilet paper, hand soap and frequently used toiletries"],

            windows:["Vacuum window tracks before wiping", "Clean interior window glass", "Wipe window frames and sills", "Clean locks and trim", "Dust blinds or shades", "Wipe blind slats, wands and high-touch areas", "Wash or refresh curtains according to care instructions", "Dust curtain rods and finials", "Check screens for visible debris or damage"],

            details:["Clean room doors and handles", "Clean door frames and top edges", "Spot-clean wall scuffs and fingerprints", "Clean switch plates and outlet covers without saturating them", "Dust ceiling fans and light fixtures", "Dust vents and return-air grilles", "Dust smoke detector exterior", "Dust upper corners and remove cobwebs", "Clean all baseboards including corners"],

            carpetFloors:["Pick up floors completely", "Vacuum room perimeters and baseboard edges", "Vacuum under accessible furniture", "Vacuum closets", "Vacuum carpet slowly in overlapping passes", "Spot-treat carpet stains when appropriate", "Deep clean carpet on the seasonal schedule if needed", "Leave pathways completely clear"],

            hardFloors:["Pick up floors completely", "Vacuum or sweep edges and corners", "Vacuum beneath accessible furniture or storage", "Detail along baseboards and toe kicks", "Mop hard floors last", "Allow floors to dry before replacing movable items"],

            kidsRooms:["Remove broken toys and damaged items", "Return favorite toys to defined storage", "Sort books and remove damaged or outgrown titles", "Reset desk and homework surfaces", "Review school papers and artwork", "Review clothing sizes", "Remove outgrown clothing", "Review shoes for fit", "Review backpacks and activity bags", "Keep everyday clothing at child-appropriate access", "Create hand-me-down or donation piles", "Label bins where useful"],

            den:["Sort toys by category", "Remove broken toys and incomplete sets", "Identify toys that are no longer used", "Return game pieces to correct boxes", "Sort art and craft supplies", "Discard dried markers, empty glue and unusable supplies", "Wipe toy bins, baskets and shelves", "Clean electronics and remotes appropriately", "Reset charging area", "Organize blankets and soft items", "Keep frequently used activities easiest to reach", "Clear floor for safe play"],

            laundry:["Empty washer", "Clean detergent dispenser compartments", "Wipe inside washer lid or door", "Clean rubber gasket carefully", "Clean washer exterior and controls", "Run manufacturer-appropriate washer cleaning cycle", "Leave washer open afterward to dry when appropriate", "Empty dryer", "Clean lint screen", "Vacuum lint-screen cavity if safely accessible", "Wipe dryer drum and door", "Clean dryer exterior and controls", "Remove lint buildup around dryer base", "Vacuum behind or beside machines where safely accessible", "Do not disconnect or alter unsafe electrical, gas or vent connections"],

            linen:["Work one linen shelf at a time", "Remove worn or excess linens", "Match sheet sets", "Group bedding by bed size or room", "Fold towels consistently", "Group bath towels, hand towels and washcloths", "Group spare blankets", "Wipe shelves and corners", "Clean bins and baskets", "Label categories where useful", "Keep everyday linens at eye level", "Move bulky backstock higher", "Vacuum closet floor", "Clean closet door and handle"],

            living:["Remove everything that does not belong in the living area", "Clear coffee and side tables", "Wipe furniture tops, sides, legs and shelves", "Dust television and media equipment appropriately", "Clean remotes and high-touch electronics appropriately", "Vacuum sofa and chair cushions", "Vacuum beneath removable cushions", "Vacuum upholstery seams", "Move lightweight furniture and clean beneath it where safe", "Dust lamps and shades", "Dust picture frames and decor", "Clean glass and mirrors", "Organize media, games and chargers", "Organize blankets", "Remove decor that creates visual clutter"],

            dining:["Clear dining table completely", "Clean tabletop, edges, base and legs", "Clean dining chairs including backs, legs and seats", "Spot-clean or vacuum upholstered seats", "Clean sideboard, buffet or dining storage", "Dust serving pieces before returning them", "Clean chandelier or pendant carefully", "Clean wall art and frames", "Review table linens", "Review serving pieces", "Vacuum or clean beneath table and chairs", "Leave table mostly open before seasonal styling"],

            entry:["Remove shoes that do not belong in daily rotation", "Wipe shoe rack or entry storage", "Clean entry mirror", "Clear and wipe entry console", "Clean front door interior and handle", "Clean door frame and top edge", "Spot-clean fingerprints and scuffs", "Clean switch plates", "Clean entry baseboards", "Vacuum corners and edges", "Mop hard floor if applicable", "Return only intentional entry decor"],

            storage:["Work one storage section at a time", "Create Keep, Relocate, Donate and Trash categories", "Group items by category", "Remove empty boxes and packaging", "Wipe shelves", "Clean storage totes and bins", "Replace unreadable labels", "Keep heavy items on stable lower shelving", "Keep frequently used items easiest to reach", "Keep seasonal bins grouped", "Keep floor storage contained", "Do not block utilities, doors or access panels"],

            basementLiving:["Remove household items that belong upstairs", "Clear tables and furniture surfaces", "Dust electronics appropriately", "Clean remotes", "Vacuum upholstery and cushions", "Dust lamps and decor", "Clean glass and mirrors", "Organize blankets", "Organize media, controllers and chargers", "Sort games and return pieces to boxes", "Remove broken or incomplete games", "Sort hobby and activity supplies", "Clear walking paths", "Create defined homes for frequently used activities"],

            outdoor:["Remove loose debris and trash", "Sweep deck or porch thoroughly", "Clean railings, posts and balusters", "Clean outdoor tables", "Clean seating frames", "Clean cushions according to care instructions", "Clean outdoor rugs", "Clean planters and remove dead plant material", "Clean exterior door thresholds", "Clean outdoor light fixtures", "Check furniture for loose hardware", "Remove broken outdoor items", "Review toys and outdoor activity items", "Check gates and latches", "Organize garden tools and hose storage", "Clear pathways", "Review outdoor serving pieces", "Clean coolers", "Review grill tools", "Clean grill according to manufacturer guidance when due", "Store weather-sensitive items appropriately", "Reset furniture layout"],

            garage:["Clear one safe walking lane first", "Remove obvious trash and empty packaging", "Work one garage section at a time", "Create Keep, Relocate, Donate and Trash categories", "Group sports equipment", "Group outdoor tools", "Group automotive supplies", "Group home-maintenance supplies", "Group seasonal storage", "Wipe shelving", "Clean storage totes", "Replace unreadable labels", "Keep heavy items on stable lower shelving", "Keep frequently used items easiest to reach", "Clear workbench", "Return hand tools to defined locations", "Organize batteries and chargers", "Organize extension cords", "Keep electrical panels, shutoffs and exits accessible", "Remove trip hazards", "Sweep garage edges and corners", "Clean thresholds", "Return only intentional floor storage"],

            inventoryFinal:["Review actual backstock before shopping", "Mark genuine shortages", "Avoid buying organizers before you know what they must hold", "Move donations out of the zone", "Move relocation items to their correct rooms", "Empty trash and replace liners", "Return cleaning supplies to their homes", "Stand at the entrance and remove anything that still reads as clutter", "Return only intentional decor", "Leave the zone ready for normal daily life"]

        }, ZONE_BLUEPRINTS:{

            z01:[{
                id:"prep", code:"01", title:"Reset Prep + Sorting", sources:["resetPrep"], extras:["Clear nightstands, dresser tops, vanity surfaces and bathroom counters"]
            }, {
                id:"bedroom", code:"02", title:"Master Bedroom Deep Reset", sources:["bedroom"]
            }, {
                id:"bedding", code:"03", title:"Bed + Bedding", sources:["bedding"]
            }, {
                id:"bathroom", code:"04", title:"Master Bathroom", sources:["bathroom"]
            }, {
                id:"closets", code:"05", title:"Both Walk-In Closets", sources:["closet"], extras:["Review accessories and seasonal clothing for both closets separately"]
            }, {
                id:"windows", code:"06", title:"Windows + Window Treatments", sources:["windows"]
            }, {
                id:"details", code:"07", title:"Doors + Walls + Fixtures", sources:["details"]
            }, {
                id:"floors", code:"08", title:"Floor Care", sources:["carpetFloors", "hardFloors"]
            }, {
                id:"final", code:"09", title:"Inventory + Final Styling", sources:["inventoryFinal"], extras:["Review bedding and linen quantities", "Review personal-care backstock", "Restock tissues and bathroom paper goods", "Put out clean bath and hand towels", "Remake the bed with the selected seasonal bedding"]
            }],

            z02:[{
                id:"prep", code:"01", title:"Reset Prep + Sorting", sources:["resetPrep"], extras:["Collect dishes, wrappers, school papers and stray electronics from all kids spaces"]
            }, {
                id:"bedrooms", code:"02", title:"Kids Bedrooms", sources:["bedroom", "kidsRooms"]
            }, {
                id:"bedding", code:"03", title:"Beds + Bedding", sources:["bedding"]
            }, {
                id:"closets", code:"04", title:"Closets + Clothing Sizes", sources:["closet", "kidsRooms"]
            }, {
                id:"bathroom", code:"05", title:"Shared Kids Bathroom", sources:["bathroom"]
            }, {
                id:"den", code:"06", title:"Den + Toys + Activities", sources:["den"]
            }, {
                id:"windows", code:"07", title:"Windows + Textiles", sources:["windows"]
            }, {
                id:"details", code:"08", title:"Hallways + Doors + Details", sources:["details"], extras:["Wipe upstairs railings and banisters", "Vacuum stair edges slowly from top to bottom", "Remove items staged in hallways or on stairs"]
            }, {
                id:"floors", code:"09", title:"Floor Care", sources:["carpetFloors", "hardFloors"]
            }, {
                id:"final", code:"10", title:"Kids Inventory + Final Reset", sources:["inventoryFinal"], extras:["Review school and homework supplies", "Review bath supplies", "Review clothing basics such as socks and underwear", "Reset homework and charging stations", "Put out clean towels", "Make all beds"]
            }],

            z03:[{
                id:"prep", code:"01", title:"Laundry Reset Prep", sources:["resetPrep"], extras:["Clear laundry-room floor and folding surfaces", "Move completed laundry to the correct rooms"]
            }, {
                id:"machines", code:"02", title:"Washer + Dryer Deep Clean", sources:["laundry"]
            }, {
                id:"storage", code:"03", title:"Laundry Storage + Supplies", sources:["storage"], extras:["Group detergent, stain care, dryer products and cleaning supplies", "Keep unsafe products out of children's reach"]
            }, {
                id:"sorting", code:"04", title:"Laundry Sorting System", sources:[], extras:["Empty and wipe hampers or sorting bins", "Check baskets for broken handles", "Assign sorting categories that match how your household washes clothing", "Keep children's sorting simple enough for them to participate", "Create a defined place for delicates or special-care items", "Create a small lost-sock or repair area if useful"]
            }, {
                id:"linen", code:"05", title:"Linen Closet Full Reset", sources:["linen"]
            }, {
                id:"landing", code:"06", title:"Landing + Stairs + Details", sources:["details", "carpetFloors"], extras:["Wipe railing and banister", "Remove laundry or household items from the landing", "Keep stairs completely clear"]
            }, {
                id:"final", code:"07", title:"Laundry Inventory + Final Reset", sources:["inventoryFinal"], extras:["Count detergent backstock", "Check stain remover and dryer products", "Review household linen quantities", "Leave folding surface clear", "Return baskets to their stations"]
            }],

            z04:[{
                id:"prep", code:"01", title:"Main Living Reset Prep", sources:["resetPrep"], extras:["Clear entry table, dining table, coffee tables and visible surfaces", "Take washable throws, pillow covers and rugs to laundry as appropriate"]
            }, {
                id:"entry", code:"02", title:"Entryway", sources:["entry"]
            }, {
                id:"living", code:"03", title:"Living Room", sources:["living"]
            }, {
                id:"formal-dining", code:"04", title:"Formal Dining Room", sources:["dining"]
            }, {
                id:"breakfast", code:"05", title:"Breakfast Nook", sources:["dining"], extras:["Keep breakfast-nook styling simpler than the formal dining room"]
            }, {
                id:"windows", code:"06", title:"Windows + Curtains", sources:["windows"]
            }, {                id:"details", code:"07", title:"Doors + Walls + Fixtures", sources:["details"]
            }, {
                id:"floors", code:"08", title:"Floor Care", sources:["carpetFloors", "hardFloors"]
            }, {
                id:"decor", code:"09", title:"Decor Edit + Hosting Readiness", sources:["inventoryFinal"], extras:["Remove current seasonal decor before adding the next season", "Dust every decor item you intend to keep", "Store off-season decor in labeled bins", "Keep coffee-table styling to one deliberate grouping", "Keep dining-table styling to one centerpiece", "Review serving trays, boards, table linens and napkins", "Prepare a place for guest coats or bags"]
            }],

            z05:[{
                id:"prep", code:"01", title:"Reset Prep + Four-Way Sort", tasks:["Gather trash bags", "Bring in a donation box or bin", "Bring in a basket for items that belong elsewhere", "Empty the sink", "Run or unload the dishwasher so it is available", "Clear kitchen counters as much as possible", "Remove papers, toys, chargers, mail, cups and random household items", "Put obvious food items back where they belong", "Take dirty kitchen towels, washcloths, potholders, oven mitts and washable mats to laundry", "Gather cleaning supplies in one place", "Have microfiber cloths available", "Have a small scrub brush or toothbrush available for detail work", "Have labels or a temporary marker available while reorganizing", "Take quick before pictures if you want a reset comparison", "Create Keep Here, Relocate, Donate and Trash/Recycle sorting categories"]
            }, {
                id:"upper-cabinets", code:"02", title:"Upper Cabinets — Full Interior Reset", tasks:["Work one upper cabinet at a time", "Remove everything from the cabinet", "Check expiration dates on food items", "Discard expired products", "Check opened packages for freshness", "Combine duplicate products when appropriate", "Remove empty packaging", "Remove dishes or glasses you never use", "Check for chipped cups, bowls, plates and glassware", "Review duplicate serving pieces", "Relocate anything stored in the wrong cabinet", "Vacuum or wipe crumbs from cabinet interior", "Wipe interior walls", "Wipe shelving", "Clean cabinet corners", "Wipe shelf liners or replace damaged liners", "Dry completely before returning items", "Group returned items by clear category", "Keep frequently used items easiest to reach"]
            }, {
                id:"lower-cabinets", code:"03", title:"Lower Cabinets + Cookware", tasks:["Empty one lower cabinet at a time", "Wipe cabinet interior, shelf edges and corners", "Review pots and pans", "Match lids to pots", "Remove damaged nonstick cookware", "Remove excessive duplicates you never use", "Stack cookware by size", "Store most-used pieces where easiest to reach", "Review vertical storage for pans or lids if needed", "Group baking sheets, muffin tins and cake pans", "Group cooling racks and mixing bowls", "Group measuring cups and spoons", "Review small appliances stored in cabinets", "Remove oddly shaped pieces that are never used", "Review food-storage containers", "Match food-storage lids to containers", "Remove damaged or lidless containers", "Return items intentionally"]
            }, {
                id:"drawers", code:"04", title:"Kitchen Drawers", tasks:["Empty every drawer completely one drawer at a time", "Vacuum crumbs from drawer interiors", "Wash or wipe drawer organizers", "Wipe drawer interiors", "Sort silverware by type", "Remove bent or broken utensils", "Review excessive duplicates", "Sort cooking utensils by function", "Review gadgets that have not been used within the past year", "Remove old receipts and expired coupons from miscellaneous drawers", "Remove dead batteries for proper disposal", "Remove broken pens and empty packaging", "Identify mystery cords before keeping them", "Group legitimate miscellaneous items such as tape, scissors and labels", "Return only items that have a defined purpose"]
            }, {
                id:"cabinet-exteriors", code:"05", title:"Cabinet + Drawer Exteriors", tasks:["Clean every cabinet front", "Clean every drawer front", "Wipe cabinet sides", "Clean cabinet trim", "Clean handles, knobs and pulls", "Detail corners around handles", "Wipe top edges of cabinet doors", "Clean lower cabinet kick areas", "Degrease cabinet areas near the stove", "Clean fingerprint buildup near sink and trash areas", "Clean cabinet surfaces around coffee and snack stations"]
            }, {
                id:"refrigerator", code:"06", title:"Refrigerator — Full Reset", tasks:["Empty refrigerator one shelf or section at a time", "Remove drawers, door bins and removable shelves when possible", "Check every food item for expiration date", "Discard spoiled or moldy food", "Discard old leftovers", "Review nearly empty containers", "Review duplicate condiments", "Discard forgotten produce that is no longer good", "Clean refrigerator ceiling", "Clean refrigerator interior walls", "Clean shelves and shelf edges", "Clean shelf supports", "Clean drawers and drawer tracks", "Clean door bins", "Clean interior door surfaces", "Clean rubber door seals", "Clean refrigerator handles", "Clean spills underneath drawers", "Dry every removable piece thoroughly", "Reorganize leftovers and ready-to-eat foods", "Group dairy and eggs", "Keep raw meat in a leak-proof tray on a lower shelf", "Group produce intentionally in drawers", "Group condiments, sauces, butter and drinks in doors without overcrowding"]
            }, {
                id:"freezer", code:"07", title:"Kitchen Freezer", tasks:["Empty the regular freezer completely", "Discard freezer-burned food", "Discard mystery bags you cannot identify", "Check dates", "Combine duplicate open packages when appropriate", "Remove unnecessary empty packaging", "Wipe freezer shelves", "Clean drawers or baskets", "Wipe freezer walls", "Clean door bins", "Wipe freezer seals", "Remove loose ice and crumbs", "Reorganize meat, chicken and seafood", "Group frozen vegetables and fruit", "Group breakfast foods and kids foods", "Group quick meals, bread and desserts"]
            }, {
                id:"deep-freezer", code:"08", title:"Deep Freezer — Full Reset", tasks:["Remove everything from the deep freezer", "Sort food into beef, chicken, pork and seafood categories", "Sort frozen vegetables and fruit", "Sort prepared meals, kids foods and breakfast items", "Sort breads, desserts and bulk purchases", "Check dates", "Discard freezer-burned food", "Discard damaged packages", "Discard unknown items", "Discard very old leftovers", "Remove empty boxes", "Clean interior walls", "Clean bottom", "Clean baskets and dividers", "Clean door or lid", "Clean handle", "Clean rubber seal", "Wipe exterior", "Return food using bins or baskets where helpful", "Create or update quantities as food goes back into the freezer"]
            }, {
                id:"pantry-clean", code:"09", title:"Walk-In Pantry — Full Reset", tasks:["Empty pantry sections before reorganizing them", "Check food expiration dates", "Review open packages", "Discard stale snacks", "Discard empty or nearly empty boxes when appropriate", "Combine duplicate items", "Clean pantry shelves", "Clean shelf corners", "Spot-clean pantry walls", "Clean pantry baseboards", "Vacuum pantry floor", "Clean pantry door and frame", "Clean pantry handle", "Clean light switch", "Dust pantry light fixture", "Empty and clean pantry bins and baskets", "Clean food-storage containers", "Mop pantry floor after vacuuming"]
            }, {
                id:"pantry-zones", code:"10", title:"Pantry Organization Zones", tasks:["Create a breakfast zone", "Create a kids-snack zone at appropriate child access", "Create a baking zone", "Create a pasta and grains zone", "Group canned foods by type", "Create a meal-ingredients zone", "Create a backstock shop-from-home-first section", "Keep duplicate condiments and sauces together", "Separate food from household supplies", "Move bulky paper goods to upper shelving when practical", "Keep party supplies and rarely used serving pieces out of prime eye-level space", "Label bins only after categories are confirmed"]
            }, {
                id:"mini-fridge", code:"11", title:"Beverage Mini Fridge", tasks:["Empty the mini fridge completely", "Discard old drinks", "Discard expired mixers", "Discard flat or open beverages that should not remain", "Remove anything nobody drinks", "Remove shelves if possible", "Clean interior walls and bottom", "Clean shelves and door racks", "Clean door, seal and handle", "Clean exterior and top surface", "Dry completely", "Reorganize water, juice and kids drinks", "Group soda, sparkling water and specialty beverages", "Create a hosting beverage area", "Update drink inventory to reduce overbuying"]
            }, {
                id:"dishwasher", code:"12", title:"Dishwasher Deep Clean", tasks:["Empty dishwasher", "Remove food and debris from bottom", "Check drain and filter area", "Remove and clean dishwasher filter according to manufacturer instructions", "Wipe door edges", "Clean rubber seals", "Clean utensil basket", "Check spray arms for debris", "Wipe detergent compartment", "Clean inside door", "Wipe exterior", "Clean handle", "Clean controls", "Run a dishwasher-cleaning cycle or appropriate product", "Leave dishwasher cracked open briefly afterward to dry"]
            }, {
                id:"sink-disposal", code:"13", title:"Sink + Garbage Disposal", tasks:["Remove everything around the sink", "Clean sink basin", "Clean drain and drain stopper", "Clean faucet and faucet base", "Clean sprayer and handles", "Clean behind faucet", "Clean sink rim and counter seam", "Clean removable sink accessories", "Wash or replace sponge as needed", "Wash scrub brush and sink mat", "Clean soap tray", "Refill dish soap", "Refill hand soap", "Restock dishwasher pods", "Clean disposal splash guard if you have a disposal", "Clean around disposal opening", "Use only an appropriate disposal-cleaning method or product", "Do not mix incompatible cleaning chemicals"]
            }, {
                id:"stove-oven", code:"14", title:"Stove + Oven", tasks:["Remove grates, burner caps and removable cooktop pieces", "Clean burners and grates", "Clean cooktop", "Clean knobs and controls", "Clean back panel", "Clean stove sides and front", "Clean handle", "Degrease surrounding backsplash", "Detail cooked-on residue around burner edges", "Remove oven racks", "Clean oven interior", "Clean oven racks", "Clean oven door and inside glass", "Clean exterior oven glass", "Clean oven handle and controls", "Empty lower drawer if applicable", "Remove crumbs, old foil and items that do not belong", "Reorganize lower drawer intentionally"]
            }, {
                id:"microwave-vent", code:"15", title:"Microwave + Vent", tasks:["Remove microwave turntable", "Wash turntable separately", "Clean microwave ceiling, walls and bottom", "Clean interior door", "Clean exterior door and handle", "Clean buttons", "Clean vent area", "Clean underside if mounted above stove", "Remove grease buildup", "Clean range-hood or microwave vent cover", "Clean reusable grease filter according to manufacturer directions", "Clean vent exterior and underside", "Clean vent buttons and light cover", "Clean surrounding cabinetry"]
            }, {
                id:"small-appliances", code:"16", title:"Small Appliances + Beverage Station", tasks:["Pull small appliances forward", "Clean counter beneath each appliance", "Empty crumbs from toaster or similar appliances", "Wipe appliance exteriors", "Clean removable components", "Clean cords", "Remove grease buildup", "Descale coffee machines when needed and according to instructions", "Review whether each appliance deserves permanent counter space", "Empty coffee or beverage station", "Discard expired coffee, tea, creamers or syrups", "Wipe beverage containers", "Clean beverage-station counter", "Return everyday beverage items easiest to reach"]
            }, {
                id:"surfaces", code:"17", title:"Counters + Backsplash + Island", tasks:["Remove everything possible from countertops", "Clean entire counter surface", "Clean corners and counter edges", "Clean behind and under small appliances", "Clean backsplash seam", "Clean full backsplash", "Degrease behind stove", "Clean water marks around sink", "Clear kitchen island", "Clean island countertop", "Clean island sides and decorative trim", "Clean island cabinet fronts, drawers and handles", "Clean seating side", "Clean island toe kicks", "Reset island storage if applicable", "Return only items that deserve permanent counter space"]
            }, {
                id:"trash-appliances", code:"18", title:"Trash + Appliance Exteriors", tasks:["Take out trash and recycling", "Wash trash-can interior and exterior", "Clean trash-can lid and foot pedal", "Wash recycling container", "Clean floor and wall behind bins", "Wipe nearby cabinets", "Replace trash liner", "Replenish trash bags", "Clean refrigerator front, sides, handles and top", "Clean refrigerator water and ice dispenser", "Clean drip tray and controls", "Vacuum accessible dust around or under refrigerator if safe", "Clean under or behind movable appliances only when safe to do so", "Do not move appliances if it risks flooring, gas, electrical or water connections"]
            }, {
                id:"dining", code:"19", title:"Kitchen Table + Breakfast Dining", tasks:["Remove everything from table", "Clean tabletop and edges", "Clean table legs and base", "Clean chairs, chair backs and legs", "Clean seat cushions if applicable", "Vacuum crumbs around and under chairs", "Clean decor before returning it", "Leave table with one intentional centerpiece"]
            }, {
                id:"windows-lights", code:"20", title:"Light Fixtures + Windows", tasks:["Dust and wipe kitchen pendant lights", "Clean chandelier or breakfast-area lighting", "Dust recessed-light trim", "Dust pantry light fixture", "Remove bugs or dust from shades when possible", "Clean interior window glass", "Clean window frames, tracks, sills, locks and trim", "Vacuum tracks before wiping", "Dust blinds", "Wipe blind grime and cords or wands", "Wash existing curtains", "Dust curtain rods"]
            }, {
                id:"walls-details", code:"21", title:"Doors + Walls + Switches + Baseboards", tasks:["Clean pantry door", "Clean exterior or back door if located in kitchen", "Clean door handles and frames", "Clean top edges and lower kick areas", "Spot-clean food splashes and fingerprints from walls", "Clean scuff marks near trash and dining chairs", "Clean high-touch wall areas", "Carefully wipe light switches", "Carefully wipe outlet covers", "Wipe smart-home controls", "Clean all kitchen and pantry baseboards", "Vacuum baseboards first", "Wipe top lip, front and corners", "Pay attention behind trash, table, pantry baskets and appliances"]
            }, {
                id:"floors", code:"22", title:"Floors — Final Cleaning Step", tasks:["Pick up everything from the floor", "Vacuum or sweep room edges", "Vacuum under cabinets", "Vacuum around island", "Vacuum pantry", "Vacuum under table", "Vacuum beneath safely accessible appliances", "Mop kitchen floor", "Mop pantry floor", "Focus on corners and cabinet toe kicks", "Detail stove and sink floor areas"]
            }, {
                id:"food-inventory", code:"23", title:"Food Inventory", tasks:["Review refrigerator milk, eggs, butter and cheese", "Review produce", "Review fresh meat", "Review refrigerated drinks", "Review freezer chicken, beef, pork and seafood", "Review frozen vegetables and breakfast foods", "Review prepared meals", "Record major deep-freezer quantities", "Review pantry rice and pasta", "Review cereal and snacks", "Review canned goods and sauces", "Review baking ingredients", "Review cooking oils and condiments", "Review mini-fridge drink categories", "Update Home Inventory for items that affect purchasing"]
            }, {
                id:"supply-inventory", code:"24", title:"Household Supply Inventory + Restock", tasks:["Check paper towels", "Check toilet paper stored in pantry backstock", "Check napkins and paper plates", "Check plastic cups", "Check foil, parchment paper and plastic wrap", "Check sandwich and freezer bags", "Check trash bags", "Check dishwasher pods", "Check dish soap", "Check sponges", "Check hand soap", "Check multipurpose cleaner", "Check degreaser", "Mark supplies Good, Low or Out", "Add only genuine shortages to the shopping list", "Identify organizers only after the reset reveals a real need"]
            }, {
                id:"decor", code:"25", title:"Decor Reset + Final Styling", tasks:["Remove the outgoing seasonal kitchen decor", "Evaluate counter decor", "Evaluate island decor", "Evaluate table centerpiece", "Evaluate pantry decor", "Review kitchen towels and rugs", "Review candles, bowls and florals", "Store off-season decor neatly", "Stand at the kitchen entrance and remove visual clutter", "Keep coffee station intentional", "Keep one attractive utensil container if useful", "Keep island mostly open", "Use one intentional kitchen-table centerpiece", "Choose decor that can work beyond one holiday when possible"]
            }, {
                id:"daily-reset", code:"26", title:"Reset Kitchen for Daily Life", tasks:["Put a fresh towel at the sink", "Put out a clean hand towel", "Replace sponges if needed", "Refill dish soap", "Refill hand soap", "Restock dishwasher pods", "Refill trash bags", "Fill fruit bowl if you use one", "Refill drink fridge", "Put groceries away", "Make frequently used foods visible", "Make children's snacks appropriately accessible", "Return cleaning supplies to an easy-to-reach safe location", "Put reusable grocery bags where they belong"]
            }],

            z06:[{
                id:"prep", code:"01", title:"Guest Suite Reset Prep", sources:["resetPrep"], extras:["Take used guest linens and towels to laundry"]
            }, {
                id:"bedroom", code:"02", title:"Guest Bedroom", sources:["bedroom"]
            }, {
                id:"bedding", code:"03", title:"Guest Bedding + Linens", sources:["bedding"]
            }, {
                id:"bathroom", code:"04", title:"Private Guest Bathroom", sources:["bathroom"]
            }, {
                id:"storage", code:"05", title:"Guest Storage + Supplies", sources:["closet"], extras:["Leave clear hanging space for guests", "Remove household overflow that belongs elsewhere", "Create a small defined guest-supply area"]
            }, {
                id:"windows", code:"06", title:"Windows + Details", sources:["windows", "details"]
            }, {
                id:"floors", code:"07", title:"Floor Care", sources:["carpetFloors", "hardFloors"]
            }, {
                id:"final", code:"08", title:"Guest-Ready Final Pass", sources:["inventoryFinal"], extras:["Put out clean guest towels", "Leave clear surface space for guest belongings", "Confirm outlets and lamps are accessible", "Leave the suite ready without last-minute cleaning"]
            }],

            z07:[{
                id:"prep", code:"01", title:"Basement Reset Prep", sources:["resetPrep"], extras:["Remove construction packaging or debris from finished areas", "Separate active project materials from normal household storage", "Clear walking paths first"]
            }, {
                id:"bedrooms", code:"02", title:"Basement Bedrooms", sources:["bedroom", "bedding", "closet"]
            }, {
                id:"bathroom", code:"03", title:"Basement Bathroom", sources:["bathroom"]
            }, {                id:"living", code:"04", title:"Basement Living + Commons", sources:["basementLiving"]
            }, {
                id:"storage", code:"05", title:"Basement Storage", sources:["storage"], extras:["Review moisture-sensitive items", "Keep stored items off the floor where practical"]
            }, {
                id:"details", code:"06", title:"Construction Dust + Details", sources:["details"], extras:["Repeat dusting in areas affected by ongoing work if necessary"]
            }, {
                id:"floors", code:"07", title:"Floor Care", sources:["carpetFloors", "hardFloors"]
            }, {
                id:"final", code:"08", title:"Comfort Inventory + Final Reset", sources:["inventoryFinal"], extras:["Review spare blankets, games and family activities", "Review bathroom supplies", "Return project materials to defined work areas"]
            }],

            z08:[{
                id:"prep", code:"01", title:"Outdoor Reset Prep", sources:["resetPrep"], extras:["Check weather before starting water-based cleaning", "Collect cushions or textiles that need washing"]
            }, {
                id:"upper-deck", code:"02", title:"Upper Deck", sources:["outdoor"]
            }, {
                id:"under-deck", code:"03", title:"Under-Deck Living", sources:["outdoor"], extras:["Check drainage areas for obvious blockage", "Reset the area for intentional use"]
            }, {
                id:"porch", code:"04", title:"Front Porch", sources:["outdoor"], extras:["Clean front-door exterior and glass", "Shake or wash doormat as appropriate", "Edit porch decor before seasonal styling"]
            }, {
                id:"yard", code:"05", title:"Yard + Fence + Gates", sources:[], extras:["Walk yard and remove trash or toys that do not belong", "Collect fallen branches or obvious debris", "Review children's outdoor equipment", "Remove broken outdoor toys", "Check fence line for visible issues", "Check gates and latches", "Organize garden tools", "Review hose storage", "Clear pathways", "Move repair items to a separate maintenance list"]
            }, {
                id:"hosting", code:"06", title:"Outdoor Hosting + Grill", sources:["outdoor"], extras:["Review bug-control products", "Review outdoor trash setup"]
            }, {
                id:"storage", code:"07", title:"Outdoor Storage", sources:["storage"], extras:["Group furniture covers, gardening supplies and outdoor toys", "Store weather-sensitive pieces appropriately"]
            }, {
                id:"final", code:"08", title:"Final Outdoor Reset", sources:["inventoryFinal"], extras:["Put cushions and furniture in final positions", "Stage only intentional seasonal decor", "Confirm walkways are clear"]
            }],

            z09:[{
                id:"prep", code:"01", title:"Garage Reset Prep", sources:["resetPrep"], extras:["Open garage only as appropriate for ventilation and safety", "Clear one safe walking lane first"]
            }, {
                id:"declutter", code:"02", title:"Declutter + Sort", sources:["garage"]
            }, {
                id:"shelving", code:"03", title:"Shelves + Storage Systems", sources:["storage"]
            }, {
                id:"tools", code:"04", title:"Tools + Work Area", sources:["garage"], extras:["Group fasteners and small hardware", "Keep safety equipment accessible"]
            }, {
                id:"seasonal", code:"05", title:"Seasonal Storage Bins", sources:["storage"], extras:["Group Spring, Summer, Fall and Winter bins", "Group holiday-specific bins", "Keep next-season bins easier to access", "Keep empty seasonal bins nested or grouped"]
            }, {
                id:"safety", code:"06", title:"Safety + Access", sources:[], extras:["Keep electrical panels accessible", "Keep water shutoffs accessible", "Keep fire extinguisher accessible if present", "Check that exits are not blocked", "Remove trip hazards", "Keep chemicals away from children", "Keep gasoline or fuels stored only in approved conditions", "Do not adjust garage-door springs, cables or other high-tension hardware"]
            }, {
                id:"floors", code:"07", title:"Garage Floor + Edges", sources:["hardFloors"], extras:["Sweep garage edges and corners", "Spot-clean spills using appropriate methods", "Clean floor beneath movable bins"]
            }, {
                id:"final", code:"08", title:"Garage Inventory + Final Reset", sources:["inventoryFinal"], extras:["Review household backstock stored in garage", "Review tools, batteries, automotive essentials and seasonal equipment", "Confirm walking paths are clear"]
            }]

        }, SEASONAL_SECTIONS:{

            spring:{
                z01:[{
                    id:"spring-addon", code:"SP", title:"Spring Renewal Add-On", tasks:["Rotate heavy winter bedding out of active use", "Move spring and summer clothing forward in the closets", "Store winter accessories in labeled bins", "Wash or refresh bedroom curtains", "Open windows and air out the suite when weather and air quality allow", "Lighten bedside and dresser styling", "Review spring footwear", "Add fresh or lighter greenery only after the room is fully reset"]
                }],
                z02:[{
                    id:"spring-addon", code:"SP", title:"Spring Renewal Add-On", tasks:["Review spring and summer clothing sizes for each child", "Store winter coats, hats and gloves", "Wash washable kids-room textiles", "Open windows to air rooms when appropriate", "Review outdoor-play and warm-weather gear", "Reset school papers and artwork after winter accumulation", "Lighten bedding where appropriate", "Refresh den activity storage for warmer-weather routines"]
                }],
                z03:[{
                    id:"spring-addon", code:"SP", title:"Spring Renewal Add-On", tasks:["Move heavy winter blankets to secondary linen storage", "Bring lighter sheets and blankets forward", "Wash stored spring linens before use if needed", "Review stain-care supplies for grass and outdoor play", "Clean laundry machines after heavy winter use", "Refresh hamper and sorting labels if needed"]
                }],
                z04:[{
                    id:"spring-addon", code:"SP", title:"Spring Renewal Add-On", tasks:["Remove winter decor", "Wash heavy throws and store them", "Switch to lighter pillow covers if desired", "Refresh curtains and window treatments", "Open windows for fresh air when appropriate", "Lighten formal dining styling", "Add restrained spring greenery or florals", "Prepare entryway for lighter jackets and shoes"]
                }],
                z05:[{
                    id:"spring-addon", code:"SP", title:"Spring Renewal Add-On", tasks:["Remove winter kitchen decor", "Review pantry for expired winter baking items", "Refresh produce storage", "Review spring entertaining supplies", "Clean and stage lighter kitchen textiles", "Review picnic or outdoor-meal supplies", "Refresh drink fridge for warmer-weather beverages", "Add restrained spring stems or greenery after cleaning is complete"]
                }],
                z06:[{
                    id:"spring-addon", code:"SP", title:"Spring Renewal Add-On", tasks:["Air out the guest suite when appropriate", "Move heavy guest bedding to storage", "Refresh guest linens", "Lighten seasonal guest-room decor", "Review guest supplies after winter visitors"]
                }],
                z07:[{
                    id:"spring-addon", code:"SP", title:"Spring Renewal Add-On", tasks:["Check basement for winter moisture or musty areas", "Air out lower-level spaces when appropriate", "Review dehumidification needs without changing equipment settings unsafely", "Rotate winter blankets to storage", "Review basement storage after winter", "Refresh activity areas for spring"]
                }],
                z08:[{
                    id:"spring-addon", code:"SP", title:"Spring Renewal Add-On", tasks:["Wash outdoor furniture after winter", "Prepare upper deck for regular use", "Prepare under-deck living area", "Deep clean front porch after winter weather", "Inspect outdoor rugs and cushions", "Bring warm-weather planters and decor forward", "Review yard toys and outdoor activity supplies", "Inspect furniture before placing it back into daily use"]
                }],
                z09:[{
                    id:"spring-addon", code:"SP", title:"Spring Renewal Add-On", tasks:["Move spring and summer outdoor bins forward", "Store winter equipment", "Store holiday bins deeper in seasonal storage", "Review gardening supplies", "Review outdoor tools", "Prepare car-cleaning and warm-weather supplies", "Clear easy access to outdoor-living items"]
                }]
            },

            summer:{
                z01:[{
                    id:"summer-addon", code:"SU", title:"Summer Reset Add-On", tasks:["Use lightweight bedding", "Review bedroom fans and vents", "Move summer clothing to easiest access", "Store remaining cool-weather clothing", "Review blackout or sun-control window treatments", "Keep bedside styling light and uncluttered"]
                }],
                z02:[{
                    id:"summer-addon", code:"SU", title:"Summer Reset Add-On", tasks:["Reset kids spaces for summer routines", "Review swimwear and water-play items", "Create easy-access sunscreen and outdoor-activity storage", "Review summer clothing sizes", "Lighten bedding where appropriate", "Reset den for indoor hot-weather activities"]
                }],
                z03:[{
                    id:"summer-addon", code:"SU", title:"Summer Reset Add-On", tasks:["Bring pool and outdoor towels forward if used", "Create easy-access swim-item laundry storage", "Restock stain treatment for summer clothing", "Review detergent backstock for increased laundry", "Keep lightweight spare bedding easiest to reach"]
                }],
                z04:[{
                    id:"summer-addon", code:"SU", title:"Summer Reset Add-On", tasks:["Store heavy throws", "Lighten pillow covers and textiles", "Prepare main living rooms for summer visitors", "Keep entryway clear for outdoor traffic", "Review summer hosting linens", "Use lighter tabletop styling", "Prepare breakfast area for easy family routines"]
                }],
                z05:[{
                    id:"summer-addon", code:"SU", title:"Summer Reset Add-On", tasks:["Deep clean refrigerator for summer foods", "Make cold drinks easy to see", "Organize mini fridge for water, kids drinks and hosting beverages", "Review grilling and outdoor-meal supplies", "Review popsicles, frozen treats and freezer space", "Review picnic or disposable serving supplies", "Stage summer kitchen textiles", "Keep counters open for easy meal prep"]
                }],
                z06:[{
                    id:"summer-addon", code:"SU", title:"Summer Reset Add-On", tasks:["Use lightweight guest bedding", "Stock guest bathroom essentials", "Prepare room for summer visitors", "Review fan or airflow comfort", "Keep luggage surface clear"]
                }],
                z07:[{
                    id:"summer-addon", code:"SU", title:"Summer Reset Add-On", tasks:["Reset basement recreation areas for summer use", "Create easy access to indoor games for very hot days", "Review basement comfort and airflow", "Store heavy blankets", "Refresh beverage or snack areas if used downstairs"]
                }],
                z08:[{
                    id:"summer-addon", code:"SU", title:"Summer Reset Add-On", tasks:["Deep clean deck and under-deck living areas", "Set outdoor tables and seating for regular use", "Refresh outdoor entertaining areas", "Review outdoor lighting", "Create easy access to cushions and serving pieces", "Review bug-control products", "Review coolers and drink tubs", "Keep outdoor toys organized"]
                }],
                z09:[{
                    id:"summer-addon", code:"SU", title:"Summer Reset Add-On", tasks:["Move summer tools and equipment forward", "Create easy access to outdoor supplies", "Store cool-weather equipment deeper", "Review coolers, sports gear and yard supplies", "Reset garage work zones", "Keep car-cleaning supplies accessible"]
                }]
            },

            fall:{
                z01:[{
                    id:"fall-addon", code:"FA", title:"Fall Refresh Add-On", tasks:["Rotate fall clothing into primary closet areas", "Review sweaters, cardigans and cool-weather layers", "Bring heavier bedding forward", "Add one warmer throw if desired", "Review bedroom curtains for cooler-weather privacy and warmth", "Store summer-only clothing and accessories", "Switch decor to warm neutrals, brown, burgundy or restrained burnt sienna", "Add a warm candle only after surfaces are fully reset"]
                }],
                z02:[{
                    id:"fall-addon", code:"FA", title:"Fall Refresh Add-On", tasks:["Review fall and winter clothing sizes for each child", "Bring light jackets and warmer layers forward", "Prepare warmer bedding", "Reset kids rooms for school-season routines", "Create easy access to backpacks and school items", "Store summer-only gear", "Review rainy-day and indoor activity storage", "Add simple fall touches without crowding kids spaces"]
                }],
                z03:[{
                    id:"fall-addon", code:"FA", title:"Fall Refresh Add-On", tasks:["Bring warmer blankets and linens forward", "Review flannel or heavier sheet sets if used", "Move summer towels or pool items to secondary storage", "Review laundry products for heavier seasonal use", "Deep clean washer and dryer exterior areas", "Prepare a defined place for muddy or wet-weather laundry if needed"]
                }],
                z04:[{
                    id:"fall-addon", code:"FA", title:"Fall Refresh + Cozy Styling", tasks:["Remove summer decor from entry, living and dining spaces", "Bring fall decor bins into the main living area", "Use cream, taupe, brown, burgundy, rust and restrained burnt orange", "Swap in fall pillow covers if desired", "Add one or two cozy throws", "Style living-room surfaces without overcrowding them", "Prepare formal dining table for fall hosting", "Add an autumn centerpiece using natural or high-end neutral materials", "Review cloth napkins, placemats and serving pieces", "Refresh curtains and window treatments", "Prepare entryway for cooler-weather shoes and light outerwear", "Add warm candlelight where safe and appropriate", "Return unused fall decor to storage rather than forcing it into the room"]
                }],
                z05:[{
                    id:"fall-addon", code:"FA", title:"Fall Kitchen + Hosting Add-On", tasks:["Remove summer kitchen decor before styling for fall", "Review fall baking ingredients and spices", "Review flour, sugars, vanilla and baking basics", "Review fall hosting and serving pieces", "Refresh beverage mini fridge for fall hosting", "Review coffee, tea, cocoa and warm beverage supplies", "Put out clean fall or warm-neutral kitchen towels", "Style counters with cream, walnut, brown, burgundy or muted rust tones", "Use burnt orange only in small intentional amounts", "Add one warm-toned candle if desired", "Add restrained seasonal stems or foliage", "Prepare one fall table centerpiece", "Review curtain rods and panels needed for adjacent living or dining spaces", "Add actual decor or hosting shortages to the shared HomeOS Shopping List"]
                }],
                z06:[{
                    id:"fall-addon", code:"FA", title:"Fall Guest-Ready Add-On", tasks:["Bring slightly warmer guest bedding forward", "Add a folded throw for guests", "Review extra blankets", "Prepare guest bathroom for fall visitors", "Add restrained warm seasonal styling", "Stock tissues and basic guest supplies"]
                }],
                z07:[{
                    id:"fall-addon", code:"FA", title:"Fall Indoor-Living Add-On", tasks:["Prepare basement living spaces for more indoor use", "Bring a few blankets forward", "Review games and family activities", "Create cozy seating areas without adding clutter", "Review basement lighting", "Store summer-only activity items", "Prepare guest or recreation spaces for cooler-weather weekends"]
                }],
                z08:[{
                    id:"fall-addon", code:"FA", title:"Fall Outdoor Transition", tasks:["Clean decks before cooler weather", "Review outdoor furniture storage needs", "Wash and dry cushions before seasonal storage if they are coming inside", "Remove summer-only decor", "Prepare front porch for sophisticated fall decor", "Use natural textures, warm brown, burgundy and muted rust rather than bright Halloween orange", "Review planters and remove spent summer material", "Store weather-sensitive outdoor pieces", "Prepare furniture covers if used"]
                }],
                z09:[{
                    id:"fall-addon", code:"FA", title:"Fall Storage Rotation", tasks:["Move fall and winter equipment forward", "Store summer supplies", "Bring fall decor bins to easy-access positions", "Review winter and Christmas bins without unpacking them yet", "Keep holiday storage clearly labeled", "Review cooler-weather car and outdoor supplies", "Clear garage paths before seasonal bins begin moving through the house"]
                }]
            },

            winter:{
                z01:[{
                    id:"winter-addon", code:"WI", title:"Winter Comfort Add-On", tasks:["Prepare warm bedding", "Review winter clothing organization", "Bring sweaters and cold-weather layers forward", "Check windows for obvious drafts without making unsafe repairs", "Add an extra blanket where useful", "Keep winter accessories contained"]
                }, {
                    id:"christmas-bedroom", code:"CH", title:"Christmas Bedroom Add-On", tasks:["Remove remaining fall bedroom decor", "Choose whether the bedroom will receive Christmas decor", "Add only a few intentional Christmas pieces", "Use holiday pillow covers or a throw if desired", "Keep nightstands functional rather than covered with decor", "Return unused holiday decor to its bin"]
                }],

                z02:[{
                    id:"winter-addon", code:"WI", title:"Winter Kids Add-On", tasks:["Review winter clothing and outerwear sizes", "Bring hats, gloves and warm layers forward", "Refresh warm bedding", "Prepare storage for wet-weather items", "Review indoor winter activities", "Keep school and holiday items separated"]
                }, {
                    id:"christmas-kids", code:"CH", title:"Christmas Kids Spaces", tasks:["Bring age-appropriate Christmas decor into kids spaces if desired", "Let each child choose a small controlled decor area", "Add holiday bedding or pillow covers only if already owned or intentionally planned", "Create a defined place for Christmas books", "Create a defined place for holiday crafts", "Keep floors and desks usable", "Return excess decor to storage"]
                }],

                z03:[{
                    id:"winter-addon", code:"WI", title:"Winter Laundry + Linen Add-On", tasks:["Bring heavy blankets forward", "Review winter sheet sets", "Review extra guest blankets for holiday visitors", "Deep clean laundry machines before heavy holiday use", "Restock laundry essentials", "Create a defined basket for holiday table linens awaiting wash", "Keep coat, glove and scarf laundry from taking over the room"]
                }],

                z04:[{
                    id:"winter-addon", code:"WI", title:"Winter Main Living Add-On", tasks:["Prepare entryway for coats and winter gear", "Bring warm throws forward", "Review winter hosting linens", "Prepare formal dining room for winter meals", "Keep main walkways clear for guests"]
                }, {
                    id:"christmas-tree", code:"CH", title:"Christmas Tree + Living Room", tasks:["Remove remaining fall decor", "Bring Christmas tree out of seasonal storage", "Inspect tree before setup", "Assemble the tree", "Fluff branches completely", "Test tree lights", "Replace failed lights if appropriate and safe", "Place tree in its final location", "Install tree skirt or collar", "Bring ornament bins into the living room", "Decorate the tree", "Add tree topper", "Store empty ornament containers neatly", "Add garland where planned", "Place stockings where planned", "Add restrained Christmas decor to living-room surfaces", "Swap seasonal pillow covers or throws", "Keep coffee and side tables usable", "Return unused Christmas decor to labeled storage"]
                }, {
                    id:"christmas-dining", code:"CH2", title:"Christmas Dining + Hosting", tasks:["Prepare formal dining table for holiday meals", "Choose holiday table linens", "Choose cloth napkins or placemats", "Create one Christmas centerpiece", "Review serving platters and boards", "Review candleholders", "Prepare extra seating if needed", "Keep breakfast nook simpler than the formal dining room", "Create a guest-coat plan near the entry", "Add hosting shortages to the shared Shopping List"]
                }],

                z05:[{
                    id:"winter-addon", code:"WI", title:"Winter Kitchen Add-On", tasks:["Review warm beverage supplies", "Review winter pantry staples", "Make freezer space for batch meals", "Prepare mini fridge for winter hosting", "Review serving pieces"]
                }, {
                    id:"christmas-kitchen", code:"CH", title:"Christmas Kitchen + Holiday Cooking", tasks:["Remove fall kitchen decor", "Clear refrigerator space for holiday food", "Inventory holiday baking ingredients", "Review flour, sugars, baking powder, baking soda and vanilla", "Review chocolate chips, sprinkles and decorating supplies", "Review holiday spices", "Pull holiday serving pieces", "Review roasting, baking and casserole dishes", "Prepare hot cocoa, coffee and tea supplies", "Reset mini fridge for holiday hosting beverages", "Put out holiday or winter kitchen towels", "Add restrained Christmas kitchen decor", "Create one holiday kitchen-table centerpiece", "Prepare a tray or station for holiday beverages if desired", "Review disposable hosting supplies if your family uses them", "Add true grocery or hosting shortages to HomeOS Shopping"]
                }],

                z06:[{
                    id:"winter-addon", code:"WI", title:"Winter Guest Suite Add-On", tasks:["Prepare warm guest bedding", "Add extra blanket", "Stock guest bathroom supplies", "Leave clear closet space", "Prepare tissues and water for guests"]
                }, {
                    id:"christmas-guest", code:"CH", title:"Christmas Guest Touches", tasks:["Add one or two restrained holiday accents", "Use a seasonal pillow or throw only if it still leaves the room functional", "Place a small holiday candle only if appropriate and safe", "Keep surfaces open for guest belongings", "Remove decor immediately if it makes the room feel crowded"]
                }],

                z07:[{
                    id:"winter-addon", code:"WI", title:"Winter Basement Add-On", tasks:["Prepare basement for more indoor family activity", "Bring blankets and games forward", "Review guest sleeping spaces if holiday visitors may use them", "Review bathroom supplies", "Keep pathways especially clear during holiday storage movement"]
                }, {
                    id:"christmas-basement", code:"CH", title:"Christmas Recreation Add-On", tasks:["Choose whether basement living areas need Christmas decor", "Add only a small controlled holiday grouping if desired", "Create easy access to family games and movie-night supplies", "Create a defined area for wrapped gifts if appropriate", "Keep gift storage out of walkways", "Return excess holiday bins to garage storage"]
                }],

                z08:[{
                    id:"winter-addon", code:"WI", title:"Winter Outdoor Protection", tasks:["Store weather-sensitive outdoor decor", "Clean outdoor spaces before reduced winter use", "Secure or cover furniture as appropriate", "Store cushions if needed", "Keep porch and deck walking surfaces clear"]
                }, {
                    id:"christmas-outdoor", code:"CH", title:"Christmas Porch + Exterior", tasks:["Remove remaining fall porch decor", "Clean porch before decorating", "Bring outdoor Christmas decor bins forward", "Install outdoor lights where planned", "Use only outdoor-rated lighting and extension products", "Place wreath or greenery", "Add planters or porch decor as planned", "Secure decorations for weather", "Keep stairs, doors and pathways unobstructed", "Test lighting after installation", "Store empty outdoor decor bins neatly"]
                }],

                z09:[{
                    id:"winter-addon", code:"WI", title:"Winter Garage Rotation", tasks:["Organize winter equipment", "Review emergency household supplies", "Keep cold-weather car supplies accessible", "Clear garage paths for winter use", "Move summer bins deeper into storage"]
                }, {
                    id:"christmas-storage", code:"CH", title:"Christmas Storage Operations", tasks:["Bring Christmas storage bins forward", "Pull tree, wreath and garland bins", "Pull ornament bins", "Pull outdoor-lighting bins", "Pull holiday table-linen and serving bins", "Keep empty seasonal bins grouped together", "Create one staging area for decor returning to storage", "Move fall bins behind Christmas bins once fall decor is removed", "Keep labels facing outward", "Do not allow decor bins to block garage walkways or exits"]
                }]
            }

        },

            selectedSeason:null,
            selectedZone:"z01",

            init(){
                if(
                    !window.HomeStore||
                    !window.HomeApp
                ){
                    console.error(
                        "DARLING HomeOS Seasonal requires HomeStore and HomeApp."
                    );

                    return;
                }

                this.selectedSeason=
                    this.detectSeason();

                /*
                seasonal.js always prepares the shared Seasonal data.

                On seasonal.html, that is where its job ends.
                seasonal-hub.js owns the landing-page interface.

                On a season detail page, SeasonalApp continues into
                task / zone / shopping / completion behavior.
                */
                this.ensureSeasonalSetup();

                if(
                    this.isHub()
                ){
                    return;
                }

                this.bindEvents();
                this.bindStateEvents();

                const state=
                    HomeStore.getState();

                this.syncSelectedZone(
                    state
                );

                this.renderDetail(
                    state
                );
            },

        isHub(){
            return(document.body.dataset.seasonalView==="hub");
        },

        detectSeason(){
            const bodySeason=document.body.dataset.season;

            if(bodySeason&&this.SEASONS[bodySeason]){
                return bodySeason;
            }

            if(this.isHub()){
                return this.detectCalendarSeason(new Date());
            }

            const file=window.location.pathname
                .split("/")
                .pop()
                .toLowerCase();

            return(
                this.SEASON_ORDER.find(
                    season=>file.includes(season)
                )||"fall"
            );
        },

        getBaseSections(zoneId){
            return(this.ZONE_BLUEPRINTS[zoneId]||[])
                .map(section=>{                    if(Array.isArray(section.tasks)){
                        return{
                            id:section.id,
                            code:section.code,
                            title:section.title,
                            seasonal:false,
                            tasks:[...section.tasks]
                        };
                    }

                    const libraryTasks=
                        (section.sources||[])
                            .flatMap(
                                source=>
                                    this.TASK_LIBRARY[source]||
                                    []
                            );

                    return{
                        id:section.id,
                        code:section.code,
                        title:section.title,
                        seasonal:false,
                        tasks:[
                            ...libraryTasks,
                            ...(section.extras||[])
                        ]
                    };
                });
        },

        getSectionDefinitions(seasonId, zoneId){
            const base=
                this.getBaseSections(zoneId);

            const seasonal=
                (
                    this.SEASONAL_SECTIONS[
                        seasonId
                    ]?.[
                        zoneId
                    ]||
                    []
                )
                .map(
                    section=>({
                        ...section,
                        seasonal:true
                    })
                );

            return[
                ...base,
                ...seasonal
            ];
        },

        ensureSeasonalSetup(){
            const state=
                HomeStore.getState();

            if(
                !state.seasonal||
                typeof state.seasonal!=="object"
            ){
                state.seasonal={
                    version:this.VERSION,
                    activeSeason:
                        this.detectCalendarSeason(
                            new Date()
                        ),
                    seasons:{}
                };
            }

            if(
                !state.seasonal.seasons||
                typeof state.seasonal.seasons!=="object"
            ){
                state.seasonal.seasons={};
            }

            if(
                !state.inventory||
                typeof state.inventory!=="object"
            ){
                state.inventory={};
            }

            if(
                !Array.isArray(
                    state.inventory.shoppingList
                )
            ){
                state.inventory.shoppingList=[];
            }

            if(
                !Array.isArray(
                    state.activity
                )
            ){
                state.activity=[];
            }

            const cleaningZones=
                Array.isArray(
                    state.cleaning?.zones
                )
                    ? state.cleaning.zones
                    : [];

            this.SEASON_ORDER.forEach(
                seasonId=>{

                    const identity=
                        this.SEASONS[
                            seasonId
                        ];

                    if(
                        !state.seasonal.seasons[
                            seasonId
                        ]
                    ){
                        state.seasonal.seasons[
                            seasonId
                        ]={
                            name:
                                identity.name,
                            description:
                                identity.description,
                            progress:
                                0,
                            zones:
                                [],
                            selectedZone:
                                cleaningZones[0]?.id||
                                "z01",
                            completedAt:
                                null
                        };
                    }

                    const season=
                        state.seasonal.seasons[
                            seasonId
                        ];

                    season.name=
                        identity.name;

                    season.description=
                        identity.description;

                    if(
                        !Array.isArray(
                            season.zones
                        )
                    ){
                        season.zones=[];
                    }

                    cleaningZones.forEach(
                        zone=>{

                            let seasonZone=
                                season.zones.find(
                                    item=>
                                        item.zoneId===
                                        zone.id
                                );

                            if(!seasonZone){
                                seasonZone={
                                    zoneId:
                                        zone.id,
                                    tasks:
                                        []
                                };

                                season.zones.push(
                                    seasonZone
                                );
                            }

                            if(
                                !Array.isArray(
                                    seasonZone.tasks
                                )
                            ){
                                seasonZone.tasks=[];
                            }

                            const oldTasks=
                                seasonZone.tasks;

                            const customTasks=
                                oldTasks
                                    .filter(
                                        task=>
                                            task.custom
                                    )
                                    .map(
                                        task=>({
                                            ...task,
                                            custom:true,
                                            sectionId:
                                                task.sectionId||
                                                "custom",
                                            sectionCode:
                                                task.sectionCode||
                                                "MY",
                                            sectionTitle:
                                                task.sectionTitle||
                                                "My Added Tasks",
                                            completedAt:
                                                task.completedAt||
                                                null
                                        })
                                    );

                            const definitions=
                                this.getSectionDefinitions(
                                    seasonId,
                                    zone.id
                                );

                            const officialTasks=
                                definitions.flatMap(
                                    section=>
                                        section.tasks.map(
                                            title=>{

                                                const saved=
                                                    oldTasks.find(
                                                        task=>
                                                            !task.custom&&
                                                            task.title===
                                                            title
                                                    );

                                                return{
                                                    id:
                                                        this.getBuiltInTaskId(
                                                            seasonId,
                                                            zone.id,
                                                            title
                                                        ),

                                                    title,

                                                    done:
                                                        Boolean(
                                                            saved?.done
                                                        ),

                                                    completedAt:
                                                        saved?.completedAt||
                                                        null,

                                                    custom:
                                                        false,

                                                    sectionId:
                                                        section.id,

                                                    sectionCode:
                                                        section.code,

                                                    sectionTitle:
                                                        section.title,

                                                    seasonal:
                                                        Boolean(
                                                            section.seasonal
                                                        )
                                                };
                                            }
                                        )
                                );

                            seasonZone.tasks=[
                                ...officialTasks,
                                ...customTasks
                            ];
                        }
                    );

                    season.zones=
                        season.zones.filter(
                            seasonZone=>
                                cleaningZones.some(
                                    zone=>
                                        zone.id===
                                        seasonZone.zoneId
                                )
                        );

                    const selectedExists=
                        cleaningZones.some(
                            zone=>
                                zone.id===
                                season.selectedZone
                        );

                    if(!selectedExists){
                        season.selectedZone=
                            cleaningZones[0]?.id||
                            "z01";
                    }

                    if(
                        !(
                            "completedAt"
                            in
                            season
                        )
                    ){
                        season.completedAt=null;
                    }

                    season.progress=
                        this.calculateSeasonProgress(
                            season
                        );

                    if(
                        season.progress<
                        100
                    ){
                        season.completedAt=null;
                    }
                }
            );

            state.seasonal.version=
                this.VERSION;

            /*
            activeSeason means the REAL HomeOS calendar season.

            Opening Spring in December should not make Spring the
            current HomeOS season. The workspace can still be used
            early without changing the real seasonal cycle.
            */
            state.seasonal.activeSeason=
                this.detectCalendarSeason(
                    new Date()
                );

            if(
                !this.isHub()
            ){
                const season=
                    state.seasonal.seasons[
                        this.selectedSeason
                    ];

                this.selectedZone=
                    season?.selectedZone||
                    cleaningZones[0]?.id||
                    "z01";
            }

            HomeStore.saveState(
                state
            );
        },

        getBuiltInTaskId(seasonId, zoneId, title){
            const slug=
                String(
                    title||
                    "task"
                )
                .toLowerCase()
                .replace(
                    /[^a-z0-9]+/g,
                    "-"
                )
                .replace(
                    /^-+|-+$/g,
                    ""
                )
                .slice(
                    0,
                    76
                );

            return(
                `${seasonId}-${zoneId}-${slug}`
            );
        },

        bindStateEvents(){
            window.addEventListener(
                "homeos:statechange",
                event=>{

                    const state=
                        event.detail||
                        HomeStore.getState();

                    this.syncSelectedZone(
                        state
                    );

                    this.renderDetail(
                        state
                    );
                }
            );
        },

        syncSelectedZone(state){
            const season=
                state.seasonal
                    ?.seasons
                    ?.[
                        this.selectedSeason
                    ];

            const cleaningZones=
                state.cleaning
                    ?.zones||
                [];

            if(!season){
                return;
            }

            const exists=
                cleaningZones.some(
                    zone=>
                        zone.id===
                        season.selectedZone
                );

            this.selectedZone=
                exists
                    ? season.selectedZone
                    : cleaningZones[0]?.id||
                      "z01";
        },

        detectCalendarSeason(date=new Date()){
            const month=
                date.getMonth()+
                1;

            if(
                month>=3&&
                month<=5
            ){
                return "spring";
            }

            if(
                month>=6&&
                month<=8
            ){
                return "summer";
            }

            if(
                month>=9&&
                month<=11
            ){
                return "fall";
            }

            return "winter";
        },

        getNextSeason(seasonId){
            const index=
                this.SEASON_ORDER.indexOf(
                    seasonId
                );

            return(
                this.SEASON_ORDER[
                    (
                        index+
                        1
                    )%
                    this.SEASON_ORDER.length
                ]
            );
        },

        getSeasonStart(seasonId, year){
            const starts={
                spring:[2,1],
                summer:[5,1],
                fall:[8,1],
                winter:[11,1]
            };

            const[
                month,
                day
            ]=
                starts[
                    seasonId
                ];

            return new Date(
                year,
                month,
                day,
                0,
                0,
                0,
                0
            );
        },

        getNextSeasonStart(now, currentSeason){
            const year=
                now.getFullYear();

            if(
                currentSeason===
                "spring"
            ){
                return this.getSeasonStart(
                    "summer",
                    year
                );
            }

            if(
                currentSeason===
                "summer"
            ){
                return this.getSeasonStart(
                    "fall",
                    year
                );
            }

            if(
                currentSeason===
                "fall"
            ){
                return this.getSeasonStart(
                    "winter",
                    year
                );
            }

            return this.getSeasonStart(
                "spring",
                now.getMonth()<=1
                    ? year
                    : year+1
            );
        },

        getDaysUntil(futureDate, now=new Date()){
            return Math.max(
                0,
                Math.ceil(
                    (
                        futureDate.getTime()-
                        now.getTime()
                    )/
                    86400000
                )
            );
        },

        getSelectedSeasonCycle(now=new Date()){
            const current=
                this.detectCalendarSeason(
                    now
                );

            const next=
                this.getNextSeason(
                    current
                );

            const nextStart=
                this.getNextSeasonStart(
                    now,
                    current
                );

            const daysUntilNext=
                this.getDaysUntil(
                    nextStart,
                    now
                );

            const identity=
                this.SEASONS[
                    this.selectedSeason
                ];

            if(
                this.selectedSeason===
                current
            ){
                return{
                    state:"active",
                    label:"ACTIVE CYCLE",
                    countdown:
                        `${daysUntilNext} DAY${daysUntilNext === 1 ? "" : "S"}`,
                    countdownLabel:
                        `UNTIL ${this.SEASONS[next].name.toUpperCase()}`,
                    range:
                        identity.range
                };
            }

            if(
                this.selectedSeason===
                    next&&
                daysUntilNext<=14
            ){
                return{
                    state:"prep",
                    label:"PREP WINDOW",
                    countdown:
                        `${daysUntilNext} DAY${daysUntilNext === 1 ? "" : "S"}`,
                    countdownLabel:
                        `UNTIL ${identity.name.toUpperCase()} BEGINS`,
                    range:
                        identity.range
                };
            }

            if(
                this.selectedSeason===
                next
            ){
                return{
                    state:"up-next",
                    label:"UP NEXT",
                    countdown:
                        `${daysUntilNext} DAYS`,
                    countdownLabel:
                        `UNTIL ${identity.name.toUpperCase()} BEGINS`,
                    range:
                        identity.range
                };
            }

            return{
                state:"saved",
                label:"SAVED CYCLE",
                countdown:
                    identity.short,
                countdownLabel:
                    "HOMEOS WORKSPACE SAVED",
                range:
                    identity.range
            };
        },

                renderDetail(providedState=null){
            const state=
                providedState||
                HomeStore.getState();

            const season=
                state.seasonal
                    ?.seasons
                    ?.[
                        this.selectedSeason
                    ];

            if(!season){
                return;
            }

            document.body.dataset.season=
                this.selectedSeason;

            this.renderSeasonHero(
                season
            );

            this.renderNavigation();

            this.renderZoneGrid(
                state,
                season
            );

            this.renderChecklist(
                state,
                season
            );

            this.renderIntelligence(
                state,
                season
            );

            this.renderShopping(
                state
            );

            this.renderCompletion(
                season
            );
        },

        renderSeasonHero(season){
            const progress=
                Number(
                    season.progress||
                    0
                );

            this.setText(
                "seasonProgressValue",
                `${progress}%`
            );

            this.setText(
                "seasonProgressStatus",
                this.getProgressStatus(
                    progress
                )
            );

            const ring=
                document.getElementById(
                    "seasonProgressRing"
                );

            if(ring){
                ring.style.setProperty(
                    "--season-progress-angle",
                    `${Math.round(
                        progress*
                        3.6
                    )}deg`
                );
            }
        },

        renderNavigation(){
            document
                .querySelectorAll(
                    "[data-season-link]"
                )
                .forEach(
                    link=>{

                        const active=
                            link.dataset
                                .seasonLink===
                            this.selectedSeason;

                        link.classList.toggle(
                            "active",
                            active
                        );

                        if(active){
                            link.setAttribute(
                                "aria-current",
                                "page"
                            );
                        }else{
                            link.removeAttribute(
                                "aria-current"
                            );
                        }
                    }
                );
        },

        renderZoneGrid(state, season){
            const container=
                document.getElementById(
                    "seasonZoneGrid"
                );

            if(!container){
                return;
            }

            const cleaningZones=
                state.cleaning
                    ?.zones||
                [];

            container.innerHTML=
                cleaningZones
                    .map(
                        zone=>{

                            const seasonZone=
                                season.zones.find(
                                    item=>
                                        item.zoneId===
                                        zone.id
                                );

                            const progress=
                                this.calculateZoneProgress(
                                    seasonZone
                                );

                            const tasks=
                                seasonZone?.tasks||
                                [];

                            const done=
                                tasks.filter(
                                    task=>
                                        task.done
                                )
                                .length;

                            const active=
                                zone.id===
                                this.selectedZone;

                            return `

                                <button
                                    class="
                                        season-zone-card
                                        ${active ? "active" : ""}
                                    "

                                    type="button"

                                    data-season-zone="${HomeApp.escapeHtml(zone.id)}"

                                    style="
                                        --zone-color:
                                            ${zone.color || "#a7613d"};
                                    "
                                >

                                    <div class="season-zone-card-top">

                                        <span class="season-zone-code">
                                            ${HomeApp.escapeHtml(zone.code || zone.id)}
                                        </span>

                                        <strong class="season-zone-percent">
                                            ${progress}%
                                        </strong>

                                    </div>


                                    <div class="season-zone-card-icon">
                                        ${HomeApp.escapeHtml(zone.icon || "HM")}
                                    </div>


                                    <h3>
                                        ${HomeApp.escapeHtml(zone.name || "Home Zone")}
                                    </h3>


                                    <p>
                                        ${HomeApp.escapeHtml(zone.description || "")}
                                    </p>


                                    <div class="season-zone-card-meta">

                                        <span>
                                            ${done}/${tasks.length} TASKS
                                        </span>

                                        <span>
                                            ${this.getProgressStatus(progress)}
                                        </span>

                                    </div>


                                    <div class="season-zone-mini-progress">

                                        <span
                                            style="
                                                width:
                                                    ${progress}%;
                                            "
                                        ></span>

                                    </div>

                                </button>

                            `;
                        }
                    )
                    .join("");
        },

        renderChecklist(state, season){
            const container=
                document.getElementById(
                    "seasonTaskList"
                );

            if(!container){
                return;
            }

            const cleaningZone=
                state.cleaning
                    ?.zones
                    ?.find(
                        zone=>
                            zone.id===
                            this.selectedZone
                    );

            const seasonZone=
                season.zones.find(
                    zone=>
                        zone.zoneId===
                        this.selectedZone
                );

            if(
                !cleaningZone||
                !seasonZone
            ){
                container.innerHTML="";
                return;
            }

            const tasks=
                seasonZone.tasks||
                [];

            const progress=
                this.calculateZoneProgress(
                    seasonZone
                );

            const done=
                tasks.filter(
                    task=>
                        task.done
                )
                .length;

            this.setText(
                "selectedSeasonZoneCode",
                `${cleaningZone.code || cleaningZone.id} // ${this.selectedSeason.toUpperCase()}`
            );

            this.setText(
                "selectedSeasonZoneName",
                cleaningZone.name
            );

            this.setText(
                "selectedSeasonZoneDescription",
                cleaningZone.description||
                ""
            );

            this.setText(
                "selectedSeasonZoneProgress",
                `${progress}%`
            );

            this.setText(
                "selectedSeasonZoneTaskCount",
                `${done}/${tasks.length}`
            );

            const definitions=
                this.getSectionDefinitions(
                    this.selectedSeason,
                    this.selectedZone
                );

            const groups=
                definitions.map(
                    definition=>({
                        ...definition,

                        tasks:
                            tasks.filter(
                                task=>
                                    !task.custom&&
                                    task.sectionId===
                                    definition.id
                            )
                    })
                );

            const customTasks=
                tasks.filter(
                    task=>
                        task.custom
                );

            if(customTasks.length){
                groups.push({
                    id:"custom",
                    code:"MY",
                    title:"My Added Tasks",
                    seasonal:true,
                    tasks:customTasks
                });
            }

            const firstIncompleteIndex=
                groups.findIndex(
                    group=>
                        group.tasks.some(
                            task=>
                                !task.done
                        )
                );

            container.innerHTML=
                groups
                    .map(
                        (
                            group,
                            index
                        )=>{

                            const groupDone=
                                group.tasks.filter(
                                    task=>
                                        task.done
                                )
                                .length;

                            const groupTotal=
                                group.tasks.length;

                            const groupProgress=
                                groupTotal
                                    ? Math.round(
                                        (
                                            groupDone/
                                            groupTotal
                                        )*
                                        100
                                      )
                                    : 100;

                            const open=
                                index===
                                    firstIncompleteIndex||
                                (
                                    firstIncompleteIndex===
                                        -1&&
                                    index===
                                        0
                                );

                            return `

                                <details
                                    class="
                                        season-task-group
                                        ${group.seasonal ? "seasonal-addon" : ""}
                                    "

                                    ${open ? "open" : ""}
                                >

                                    <summary>

                                        <span class="season-task-group-code">
                                            ${HomeApp.escapeHtml(group.code)}
                                        </span>


                                        <span class="season-task-group-title">
                                            ${HomeApp.escapeHtml(group.title)}
                                        </span>


                                        <span class="season-task-group-type">

                                            ${
                                                group.seasonal

                                                    ? "SEASONAL"

                                                    : "DEEP RESET"
                                            }

                                        </span>


                                        <span class="season-task-group-count">
                                            ${groupDone}/${groupTotal}
                                        </span>


                                        <strong>
                                            ${groupProgress}%
                                        </strong>


                                        <span class="season-task-group-chevron">
                                            ⌄
                                        </span>

                                    </summary>


                                    <div class="season-task-group-body">

                                        ${
                                            group.tasks
                                                .map(
                                                    task =>
                                                        this.renderTaskRow(
                                                            task
                                                        )
                                                )
                                                .join("")
                                        }

                                    </div>

                                </details>

                            `;
                        }
                    )
                    .join("");
        },

        renderTaskRow(task){
            const safeId=
                HomeApp.escapeHtml(
                    task.id
                );

            const safeTitle=
                HomeApp.escapeHtml(
                    task.title
                );

            return `

                <div
                    class="
                        season-task-row
                        ${task.done ? "done" : ""}
                    "
                >

                    <label>

                        <input
                            type="checkbox"

                            data-season-task="${safeId}"

                            ${task.done ? "checked" : ""}
                        >


                        <span class="season-task-checkmark"></span>


                        <span class="season-task-title">
                            ${safeTitle}
                        </span>

                    </label>


                    ${
                        task.custom

                            ? `<button class="season-task-remove"type="button"data-remove-season-task="${safeId}"aria-label="Remove ${safeTitle}">×</button>`

                            : ""
                    }

                </div>

            `;
        },

        renderIntelligence(state, season){
            const cleaningZone=
                state.cleaning
                    ?.zones
                    ?.find(
                        zone=>
                            zone.id===
                            this.selectedZone
                    );

            const seasonZone=
                season.zones.find(
                    zone=>
                        zone.zoneId===
                        this.selectedZone
                );

            if(
                !cleaningZone||
                !seasonZone
            ){
                return;
            }

            const tasks=
                seasonZone.tasks||
                [];

            const done=
                tasks.filter(
                    task=>
                        task.done
                )
                .length;

            const progress=
                this.calculateZoneProgress(
                    seasonZone
                );

            const shopping=
                this.getSeasonShoppingItems(
                    state
                );

            this.setText(
                "seasonIntelligenceTitle",
                cleaningZone.name
            );

            this.setText(
                "seasonIntelligenceDescription",
                this.getZoneIntelligenceMessage(
                    cleaningZone.name,
                    done,
                    tasks.length,
                    progress
                )
            );

            this.setText(
                "seasonZoneTasksDone",
                `${done}/${tasks.length}`
            );

            this.setText(
                "seasonZoneState",
                this.getProgressStatus(
                    progress
                )
            );

            this.setText(
                "seasonTotalProgress",
                `${Number(season.progress || 0)}%`
            );

            this.setText(
                "seasonShoppingCount",
                shopping.length
            );
        },

        getZoneIntelligenceMessage(
            name,
            done,
            total,
            progress
        ){
            if(!total){
                return(
                    `${name} is ready for its first seasonal-reset tasks.`
                );
            }

            if(progress===100){
                return(
                    `${name} is fully reset for this season.`
                );
            }

            if(progress>=75){
                return(
                    `${name} is nearly complete. ${total - done} task${total - done === 1 ? "" : "s"} remain.`
                );
            }

            if(progress>=35){
                return(
                    `${name} is actively moving through its deep reset. ${done} of ${total} tasks are complete.`
                );
            }

            return(
                `${name} is ready for a detailed reset. Work one section at a time instead of trying to clean the entire zone at once.`
            );
        },

        getFirstIncompleteZone(state, season){
            const cleaningZones=
                state.cleaning
                    ?.zones||
                [];

            for(
                const seasonZone
                of
                season.zones
            ){
                if(
                    this.calculateZoneProgress(
                        seasonZone
                    )<
                    100
                ){
                    return{
                        seasonZone,

                        cleaningZone:
                            cleaningZones.find(
                                zone=>
                                    zone.id===
                                    seasonZone.zoneId
                            )
                    };
                }
            }

            return null;
        },

        beginSeasonWorkspace(){
            const state=
                HomeStore.getState();

            const season=
                state.seasonal
                    ?.seasons
                    ?.[
                        this.selectedSeason
                    ];

            if(!season){
                return;
            }

            const firstIncomplete=
                this.getFirstIncompleteZone(
                    state,
                    season
                );

            if(
                firstIncomplete
                    ?.seasonZone
                    ?.zoneId
            ){
                this.selectedZone=
                    firstIncomplete
                        .seasonZone
                        .zoneId;

                HomeStore.update(
                    next=>{

                        const nextSeason=
                            next.seasonal
                                ?.seasons
                                ?.[
                                    this.selectedSeason
                                ];

                        if(nextSeason){
                            nextSeason.selectedZone=
                                this.selectedZone;
                        }
                    }
                );
            }

            requestAnimationFrame(
                ()=>{
                    document
                        .getElementById(
                            "seasonChecklist"
                        )
                        ?.scrollIntoView({
                            behavior:"smooth",
                            block:"start"
                        });
                }
            );
        },        
        
        toggleTask(taskId){
            HomeStore.update(
                state=>{

                    const season=
                        state.seasonal
                            ?.seasons
                            ?.[
                                this.selectedSeason
                            ];

                    const zone=
                        season
                            ?.zones
                            ?.find(
                                item=>
                                    item.zoneId===
                                    this.selectedZone
                            );

                    const task=
                        zone
                            ?.tasks
                            ?.find(
                                item=>
                                    item.id===
                                    taskId
                            );

                    if(
                        !task||
                        !season
                    ){
                        return;
                    }

                    task.done=
                        !task.done;

                    task.completedAt=
                        task.done
                            ? new Date().toISOString()
                            : null;

                    season.progress=
                        this.calculateSeasonProgress(
                            season
                        );

                    if(
                        season.progress<
                        100
                    ){
                        season.completedAt=null;
                    }
                }
            );
        },

        addCustomTask(){
            const input=
                document.getElementById(
                    "newSeasonTask"
                );

            const title=
                input
                    ?.value
                    .trim()||
                "";

            if(
                !input||
                !title
            ){
                HomeApp.toast(
                    "Type the task you want to add first."
                );

                input?.focus();
                return;
            }

            HomeStore.update(
                state=>{

                    const season=
                        state.seasonal
                            ?.seasons
                            ?.[
                                this.selectedSeason
                            ];

                    const zone=
                        season
                            ?.zones
                            ?.find(
                                item=>
                                    item.zoneId===
                                    this.selectedZone
                            );

                    if(
                        !zone||
                        !season
                    ){
                        return;
                    }

                    zone.tasks.push({
                        id:
                            this.makeId(
                                "season-custom"
                            ),

                        title,

                        done:false,

                        completedAt:null,

                        custom:true,

                        sectionId:"custom",

                        sectionCode:"MY",

                        sectionTitle:
                            "My Added Tasks",

                        seasonal:true
                    });

                    season.progress=
                        this.calculateSeasonProgress(
                            season
                        );

                    season.completedAt=null;
                }
            );

            input.value="";

            HomeApp.toast(
                "Task added to this seasonal zone."
            );
        },

        removeCustomTask(taskId){
            HomeStore.update(
                state=>{

                    const season=
                        state.seasonal
                            ?.seasons
                            ?.[
                                this.selectedSeason
                            ];

                    const zone=
                        season
                            ?.zones
                            ?.find(
                                item=>
                                    item.zoneId===
                                    this.selectedZone
                            );

                    if(
                        !zone||
                        !season
                    ){
                        return;
                    }

                    zone.tasks=
                        zone.tasks.filter(
                            task=>
                                !(
                                    task.id===
                                        taskId&&
                                    task.custom
                                )
                        );

                    season.progress=
                        this.calculateSeasonProgress(
                            season
                        );

                    if(
                        season.progress<
                        100
                    ){
                        season.completedAt=null;
                    }
                }
            );

            HomeApp.toast(
                "Custom seasonal task removed."
            );
        },

        addShoppingItem(){
            const nameInput=
                document.getElementById(
                    "seasonShoppingName"
                );

            const quantityInput=
                document.getElementById(
                    "seasonShoppingQty"
                );

            const name=
                nameInput
                    ?.value
                    .trim()||
                "";

            const quantity=
                Math.max(
                    1,
                    Number(
                        quantityInput
                            ?.value||
                        1
                    )
                );

            if(
                !name||
                !nameInput||
                !quantityInput
            ){
                HomeApp.toast(
                    "Type a shopping item first."
                );

                nameInput?.focus();
                return;
            }

            const identity=
                this.SEASONS[
                    this.selectedSeason
                ];

            HomeStore.update(
                state=>{

                    if(
                        !Array.isArray(
                            state.inventory
                                .shoppingList
                        )
                    ){
                        state.inventory.shoppingList=[];
                    }

                    state.inventory
                        .shoppingList
                        .push({
                            id:
                                this.makeId(
                                    "season-shopping"
                                ),

                            sourceType:
                                "custom",

                            origin:
                                "seasonal",

                            season:
                                this.selectedSeason,

                            sourceLabel:
                                identity.name,

                            inventoryItemId:
                                null,

                            name,

                            quantity,

                            quantityMode:
                                "manual",

                            unit:
                                "",

                            checked:
                                false,

                            addedAt:
                                new Date()
                                    .toISOString()
                        });
                }
            );

            nameInput.value="";
            quantityInput.value=1;

            HomeApp.toast(
                `${name} added to the HomeOS Shopping List.`
            );
        },

        getSeasonShoppingItems(state){
            return(
                state.inventory
                    ?.shoppingList||
                []
            )
            .filter(
                item=>
                    item.origin===
                        "seasonal"&&
                    item.season===
                        this.selectedSeason
            );
        },

        renderShopping(state){
            const container=
                document.getElementById(
                    "seasonShoppingList"
                );

            if(!container){
                return;
            }

            const items=
                this.getSeasonShoppingItems(
                    state
                );

            this.setText(
                "seasonShoppingListCount",
                `${items.length} ITEM${items.length === 1 ? "" : "S"}`
            );

            if(!items.length){
                container.innerHTML=`

                    <div class="season-shopping-empty">

                        <strong>
                            No seasonal purchases yet.
                        </strong>

                        <p>
                            Add only the things this reset proves
                            you actually need.
                        </p>

                    </div>

                `;

                return;
            }

            container.innerHTML=
                items
                    .map(
                        item=>`

                            <div class="season-shopping-row">

                                <div>

                                    <strong>
                                        ${HomeApp.escapeHtml(item.name)}
                                    </strong>

                                    <span>
                                        ${HomeApp.escapeHtml(this.SEASONS[this.selectedSeason].name)}
                                    </span>

                                </div>


                                <span class="season-shopping-qty">
                                    × ${Math.max(1, Number(item.quantity) || 1)}
                                </span>


                                <button
                                    class="season-shopping-remove"

                                    type="button"

                                    data-remove-season-shopping="${HomeApp.escapeHtml(item.id)}"

                                    aria-label="Remove ${HomeApp.escapeHtml(item.name)}"
                                >
                                    ×
                                </button>

                            </div>

                        `
                    )
                    .join("");
        },

        removeShoppingItem(itemId){
            HomeStore.update(
                state=>{

                    state.inventory.shoppingList=
                        (
                            state.inventory
                                ?.shoppingList||
                            []
                        )
                        .filter(
                            item=>
                                item.id!==
                                itemId
                        );
                }
            );

            HomeApp.toast(
                "Seasonal shopping item removed."
            );
        },

        renderCompletion(season){
            const progress=
                Number(
                    season.progress||
                    0
                );

            const button=
                document.getElementById(
                    "completeSeasonButton"
                );

            const identity=
                this.SEASONS[
                    this.selectedSeason
                ];

            this.setText(
                "seasonCompletionMessage",

                progress>=100

                    ? `${identity.name} is fully checked off. You can close this seasonal cycle and save the completion to Home Memory.`

                    : `${100 - progress}% of ${identity.name} remains. Complete every zone before closing this cycle.`
            );

            if(button){
                button.disabled=
                    progress<
                    100;

                button.textContent=
                    season.completedAt

                        ? `${identity.name} Completed ✓`

                        : `Complete ${identity.name}`;
            }
        },

        completeSeason(){
            const state=
                HomeStore.getState();

            const season=
                state.seasonal
                    ?.seasons
                    ?.[
                        this.selectedSeason
                    ];

            if(!season){
                return;
            }

            if(
                Number(
                    season.progress||
                    0
                )<
                100
            ){
                HomeApp.toast(
                    "Finish the entire seasonal checklist before closing the cycle."
                );

                return;
            }

            if(season.completedAt){
                HomeApp.toast(
                    `${this.SEASONS[this.selectedSeason].name} is already complete.`
                );

                return;
            }

            HomeStore.update(
                next=>{

                    const nextSeason=
                        next.seasonal
                            ?.seasons
                            ?.[
                                this.selectedSeason
                            ];

                    if(!nextSeason){
                        return;
                    }

                    nextSeason.completedAt=
                        new Date()
                            .toISOString();


                    next.activity.unshift({
                        id:
                            this.makeId(
                                "activity-season"
                            ),

                        type:
                            "seasonal",

                        title:
                            `${this.SEASONS[this.selectedSeason].name} completed`,

                        description:
                            "A full seasonal HomeOS reset was completed.",

                        createdAt:
                            new Date()
                                .toISOString()
                    });

                    next.activity=
                        next.activity.slice(
                            0,
                            200
                        );
                }
            );

            HomeApp.toast(
                `${this.SEASONS[this.selectedSeason].name} saved to Home Memory.`
            );
        },

        calculateZoneProgress(seasonZone){
            const tasks=
                seasonZone?.tasks||
                [];

            if(!tasks.length){
                return 0;
            }

            const done=
                tasks.filter(
                    task=>
                        task.done
                )
                .length;

            return Math.round(
                (
                    done/
                    tasks.length
                )*
                100
            );
        },

        calculateSeasonProgress(season){
            const tasks=
                (
                    season?.zones||
                    []
                )
                .flatMap(
                    zone=>
                        zone.tasks||
                        []
                );

            if(!tasks.length){
                return 0;
            }

            const done=
                tasks.filter(
                    task=>
                        task.done
                )
                .length;

            return Math.round(
                (
                    done/
                    tasks.length
                )*
                100
            );
        },

        getProgressStatus(progress){
            const value=
                Number(
                    progress||
                    0
                );

            if(value>=100){
                return "COMPLETE";
            }

            if(value>=75){
                return "NEARLY DONE";
            }

            if(value>=35){
                return "ACTIVE";
            }

            if(value>0){
                return "STARTED";
            }

            return "READY";
        },

        selectZone(zoneId, shouldScroll=true){
            const state=
                HomeStore.getState();

            const valid=
                state.cleaning
                    ?.zones
                    ?.some(
                        zone=>
                            zone.id===
                            zoneId
                    );

            if(!valid){
                return;
            }

            this.selectedZone=
                zoneId;

            HomeStore.update(
                next=>{

                    const season=
                        next.seasonal
                            ?.seasons
                            ?.[
                                this.selectedSeason
                            ];

                        if(season){
                        season.selectedZone=
                            zoneId;
                    }
                }
            );

            if(shouldScroll){
                requestAnimationFrame(
                    ()=>{
                        document
                            .getElementById(
                                "seasonChecklist"
                            )
                            ?.scrollIntoView({
                                behavior:"smooth",
                                block:"start"
                            });
                    }
                );
            }
        },

        bindEvents(){
            document.addEventListener(
                "click",
                event=>{

                    const begin=
                        event.target.closest(
                            "[data-begin-season]"
                        );

                    if(begin){
                        event.preventDefault();

                        this.beginSeasonWorkspace();
                        return;
                    }

                    const scroll=
                        event.target.closest(
                            "[data-scroll-target]"
                        );

                    if(scroll){
                        event.preventDefault();

                        document
                            .getElementById(
                                scroll.dataset
                                    .scrollTarget
                            )
                            ?.scrollIntoView({
                                behavior:"smooth",
                                block:"start"
                            });

                        return;
                    }

                    const zone=
                        event.target.closest(
                            "[data-season-zone]"
                        );

                    if(zone){
                        this.selectZone(
                            zone.dataset
                                .seasonZone
                        );

                        return;
                    }

                    const removeTask=
                        event.target.closest(
                            "[data-remove-season-task]"
                        );

                    if(removeTask){
                        this.removeCustomTask(
                            removeTask.dataset
                                .removeSeasonTask
                        );

                        return;
                    }

                    const removeShopping=
                        event.target.closest(
                            "[data-remove-season-shopping]"
                        );

                    if(removeShopping){
                        this.removeShoppingItem(
                            removeShopping.dataset
                                .removeSeasonShopping
                        );

                        return;
                    }

                    if(
                        event.target.closest(
                            "#addSeasonTaskButton"
                        )
                    ){
                        this.addCustomTask();
                        return;
                    }

                    if(
                        event.target.closest(
                            "#addSeasonShoppingButton"
                        )
                    ){
                        this.addShoppingItem();
                        return;
                    }

                    if(
                        event.target.closest(
                            "#completeSeasonButton"
                        )
                    ){
                        this.completeSeason();
                    }
                }
            );

            document.addEventListener(
                "change",
                event=>{

                    const checkbox=
                        event.target.closest(
                            "[data-season-task]"
                        );

                    if(checkbox){
                        this.toggleTask(
                            checkbox.dataset
                                .seasonTask
                        );
                    }
                }
            );

            document
                .getElementById(
                    "newSeasonTask"
                )
                ?.addEventListener(
                    "keydown",
                    event=>{

                        if(
                            event.key===
                            "Enter"
                        ){
                            event.preventDefault();

                            this.addCustomTask();
                        }
                    }
                );

            document
                .getElementById(
                    "seasonShoppingName"
                )
                ?.addEventListener(
                    "keydown",
                    event=>{

                        if(
                            event.key===
                            "Enter"
                        ){
                            event.preventDefault();

                            this.addShoppingItem();
                        }
                    }
                );
        },

        makeId(prefix){
            if(
                typeof crypto!==
                    "undefined"&&
                typeof crypto.randomUUID===
                    "function"
            ){
                return(
                    `${prefix}-${crypto.randomUUID()}`
                );
            }

            return(
                `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
            );
        },

        setText(id, value){
            const element=
                document.getElementById(
                    id
                );

            if(element){
                element.textContent=
                    value;
            }
        }

    };

    window.SeasonalApp=
        SeasonalApp;

    SeasonalApp.init();

});