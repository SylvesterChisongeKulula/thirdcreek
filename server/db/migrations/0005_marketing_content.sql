-- Seed the marketing routine, day themes and playbook content (Monday–Friday schedule).
INSERT INTO `marketing_day_themes` (`weekday`, `theme`, `example`) VALUES (1, 'Maintenance Monday', 'One quick tip drivers can do themselves this week, like checking tyre pressure or coolant level.');
--> statement-breakpoint
INSERT INTO `marketing_day_themes` (`weekday`, `theme`, `example`) VALUES (2, 'Part Spotlight', 'Explain one part: what it does, how long it lasts, and what happens when it fails.');
--> statement-breakpoint
INSERT INTO `marketing_day_themes` (`weekday`, `theme`, `example`) VALUES (3, 'Time to Replace?', 'Warning signs: squealing brakes, a clunk over bumps, a slow crank in the morning.');
--> statement-breakpoint
INSERT INTO `marketing_day_themes` (`weekday`, `theme`, `example`) VALUES (4, 'Partner Mechanic', 'Video or photos from a partner mechanic doing a repair with Third Creek parts.');
--> statement-breakpoint
INSERT INTO `marketing_day_themes` (`weekday`, `theme`, `example`) VALUES (5, 'Myth-busting & Q&A', 'Answer a question from the comments or bust a common myth before the weekend drive.');
--> statement-breakpoint
INSERT INTO `marketing_routine_tasks` (`id`, `weekday`, `title`, `category`, `link`, `sort_order`) VALUES ('daily-replies', NULL, 'Reply to all comments and messages', 'Engagement', NULL, 0);
--> statement-breakpoint
INSERT INTO `marketing_routine_tasks` (`id`, `weekday`, `title`, `category`, `link`, `sort_order`) VALUES ('daily-stories', NULL, 'Post 2–4 Stories', 'Content', NULL, 1);
--> statement-breakpoint
INSERT INTO `marketing_routine_tasks` (`id`, `weekday`, `title`, `category`, `link`, `sort_order`) VALUES ('daily-publish', NULL, 'Publish: {theme}', 'Content', '/admin/marketing/playbook', 2);
--> statement-breakpoint
INSERT INTO `marketing_routine_tasks` (`id`, `weekday`, `title`, `category`, `link`, `sort_order`) VALUES ('mon-weekend-replies', 1, 'Catch up on weekend comments and messages', 'Engagement', NULL, 3);
--> statement-breakpoint
INSERT INTO `marketing_routine_tasks` (`id`, `weekday`, `title`, `category`, `link`, `sort_order`) VALUES ('tue-partner-outreach', 2, 'Reach out to one potential partner', 'Partners', '/admin/marketing/partners', 4);
--> statement-breakpoint
INSERT INTO `marketing_routine_tasks` (`id`, `weekday`, `title`, `category`, `link`, `sort_order`) VALUES ('wed-partner-followup', 3, 'Follow up with partners already contacted', 'Partners', '/admin/marketing/partners', 5);
--> statement-breakpoint
INSERT INTO `marketing_routine_tasks` (`id`, `weekday`, `title`, `category`, `link`, `sort_order`) VALUES ('wed-brand-spotlight', 3, 'Post a brand spotlight (rotate: Land Rover, Range Rover, Toyota, Mercedes-Benz, BMW)', 'Content', NULL, 6);
--> statement-breakpoint
INSERT INTO `marketing_routine_tasks` (`id`, `weekday`, `title`, `category`, `link`, `sort_order`) VALUES ('thu-partner-checkin', 4, 'Check in with active partners and share their content', 'Partners', '/admin/marketing/partners', 7);
--> statement-breakpoint
INSERT INTO `marketing_routine_tasks` (`id`, `weekday`, `title`, `category`, `link`, `sort_order`) VALUES ('thu-branch-update', 4, 'Post a branch & community update', 'Content', NULL, 8);
--> statement-breakpoint
INSERT INTO `marketing_routine_tasks` (`id`, `weekday`, `title`, `category`, `link`, `sort_order`) VALUES ('fri-log-engagement', 5, 'Log this week''s engagement numbers', 'Review', '/admin/marketing/metrics', 9);
--> statement-breakpoint
INSERT INTO `marketing_routine_tasks` (`id`, `weekday`, `title`, `category`, `link`, `sort_order`) VALUES ('fri-plan-week', 5, 'Plan and batch-create next week''s content', 'Content', NULL, 10);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('mission', '', 'Third Creek will win Facebook by showing up every day and teaching. We become the page Zambian drivers trust for advice on keeping their vehicles healthy: what to check, when to replace a part, and how to avoid expensive repairs. At the same time we borrow reach from mechanics and auto influencers who already have the audience, and give them a reason to send that audience to us.', '{}', 0);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('principle', 'Volume', 'Feed posts every day, plus Stories and Reels. Consistency beats perfection.', '{"value":"2–3 posts a day"}', 0);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('principle', 'Authority', 'Most posts give useful advice. The parts and branches come in naturally.', '{"value":"Teach first, sell second"}', 1);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('principle', 'Partners', 'Mechanics and auto influencers who use and recommend our parts to their followers.', '{"value":"Borrowed reach"}', 2);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('daily_extra', '', 'Every weekday: 2–4 Stories (stock arriving, workshop moments, polls) and at least one short Reel when there is footage. Reply to every comment and message the same day.', '{}', 0);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('content_pillar', 'Maintenance Tips', 'Simple habits that keep a vehicle running and save the owner money.', '{"ideas":["How often should you really change your engine oil?","The 5-minute check to do before a long trip to the Copperbelt","Why the right tyre pressure saves fuel and tyres","Air filter: the cheapest part that protects your engine"]}', 0);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('content_pillar', 'Know Your Parts', 'Explain when parts wear out and what it costs to ignore them.', '{"ideas":["Brake pads: the sounds that mean it is time","Timing belt: the part that can destroy an engine if it snaps","Worn shocks: how to test them by pushing on your bonnet","Battery dying? Signs it is the battery and not the alternator"]}', 1);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('content_pillar', 'Zambian Road Conditions', 'Advice tied to the roads and seasons our customers actually drive in.', '{"ideas":["Rainy season prep: wipers, tyres and brakes","Dusty roads and your filters: what to change more often","Pothole damage: what to check after a hard hit","Hot season and your cooling system"]}', 2);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('content_pillar', 'Brand-Specific Care', 'Expert advice for the brands we stock: Land Rover, Range Rover, Toyota, Mercedes-Benz, BMW.', '{"ideas":["Land Rover and Range Rover: the common suspension issues and how to catch them early","Toyota: the service items owners most often skip","Mercedes-Benz and BMW: genuine vs aftermarket, and when each makes sense"]}', 3);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('content_pillar', 'Behind the Counter', 'Put faces to the business and remind people where to find us.', '{"ideas":["Meet the team at one branch each week","New stock just landed: what it fits","A customer story: the part we found when nobody else had it"]}', 4);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('format', 'Short videos & Reels', 'Under a minute. Show the worn part next to the new one, or a quick how-to. These reach the most new people.', '{}', 0);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('format', 'Carousels', 'Step-by-step tips or "5 signs" lists. People save and share these.', '{}', 1);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('format', 'Facebook Lives', 'Monthly live session with a partner mechanic answering viewer questions about their cars.', '{}', 2);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('format', 'Polls & "Guess the fault"', 'Post a sound or symptom and let people guess. Cheap to make and drives comments.', '{}', 3);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('partnership', 'Mechanic & Influencer Partnership', 'Partner with a mechanic or auto creator who already has an active Facebook following. They use Third Creek parts in their repairs and show it on their page.', '{"weGive":"Parts supplied for their jobs (free or at partner pricing), shout-outs on our page.","theyGive":"Regular posts and videos featuring our parts, tagging Third Creek.","tracking":"Count their posts that mention us and the enquiries that say they came from that partner."}', 0);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('partnership', 'Affiliate / Referral', 'Each partner gets their own referral code. When a customer buys with that code, the partner earns a commission. The partner never holds stock: we supply the part, they bring the customer.', '{"highlight":"This is the \"dropshipping-like\" model","weGive":"A commission (or credit on parts) for every sale made with their code.","theyGive":"Recommendations to their followers and customers, with their code.","tracking":"Record the referral code on every sale and pay out commission monthly."}', 1);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('partnership', 'Consignment', 'We place a small stock of fast-moving parts at a trusted partner workshop. They pay us only for what they sell or use.', '{"weGive":"Stock on hand at their workshop with no upfront cost to them.","theyGive":"Payment for parts used, plus visibility for Third Creek at their workshop.","tracking":"Stock count at each visit; reconcile what was used against what was paid."}', 2);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('partnership', 'Brand Ambassador', 'A longer-term arrangement with one or two well-known partners who become the face of Third Creek online.', '{"weGive":"Free or discounted parts and regular features on our page.","theyGive":"A set number of posts per month and an appearance in our Lives.","tracking":"Monthly review of their posts, reach and the enquiries they generate."}', 3);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('partner_criterion', '', 'An active Facebook page with a local Zambian audience', '{}', 0);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('partner_criterion', '', 'Real engagement: comments and shares, not just follower numbers', '{}', 1);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('partner_criterion', '', 'Works on the brands we stock (Land Rover, Range Rover, Toyota, Mercedes-Benz, BMW)', '{}', 2);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('partner_criterion', '', 'A good reputation with customers and other mechanics', '{}', 3);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('partner_criterion', '', 'Willing to post regularly and tag Third Creek', '{}', 4);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('outreach_step', 'Find', 'Search Facebook for Lusaka mechanics, auto groups and car pages. Ask customers which mechanics they trust.', '{}', 0);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('outreach_step', 'Vet', 'Check their recent posts, engagement and reviews against the criteria.', '{}', 1);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('outreach_step', 'First contact', 'Message them, then visit the workshop. Lead with what is in it for them.', '{}', 2);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('outreach_step', 'Trial job', 'Supply parts for one or two repairs and see whether they post about it.', '{}', 3);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('outreach_step', 'Formal deal', 'Agree the model, give them a referral code and add them to the posting schedule.', '{}', 4);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('metric', 'Page followers', '', '{"why":"Shows whether our reach is growing.","howToMeasure":"Meta Business Suite insights, checked weekly."}', 0);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('metric', 'Engagement rate', '', '{"why":"Shows whether people find the content useful.","howToMeasure":"Reactions, comments and shares divided by reach, per post."}', 1);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('metric', 'Messenger & WhatsApp enquiries', '', '{"why":"The first sign that content is turning into business.","howToMeasure":"Count enquiries that mention Facebook."}', 2);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('metric', 'Leads from Facebook', '', '{"why":"Connects marketing to the sales pipeline.","howToMeasure":"Leads added to the Pipeline where the customer found us on Facebook."}', 3);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('metric', 'Referral-code sales', '', '{"why":"Shows which partners actually bring customers.","howToMeasure":"Sales recorded with each partner code, per month."}', 4);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('checklist', '', 'Plan and batch-create the coming week of posts', '{}', 0);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('checklist', '', 'Reply to every comment and message the same day', '{}', 1);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('checklist', '', 'Check in with each active partner and share their content', '{}', 2);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('checklist', '', 'Collect photos and videos from all three branches', '{}', 3);
--> statement-breakpoint
INSERT INTO `marketing_playbook_items` (`section`, `title`, `body`, `details`, `sort_order`) VALUES ('checklist', '', 'Review the week''s metrics and note what worked', '{}', 4);
--> statement-breakpoint
DELETE FROM `marketing_tasks` WHERE `routine_key` IS NOT NULL AND `completed_by` IS NULL;
