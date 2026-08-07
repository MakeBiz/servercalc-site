---
title: "Why we hide plans we have not checked for a week"
date: 2026-08-02
rubric: novosti
description: "A stale price is more harmful than a missing one. We explain how the freshness rule works in the catalog and what happens to a plan that has not been checked in a while"
author: ServerCalc Editorial
tasks: ["sajt", "telegram-bot"]
updated: 2026-08-03
---

We checked thirteen Russian-language and international server catalogs. Eleven of them show nowhere when the price on the card was last verified. Only two sites show the date the base was updated

This is the main reason catalogs of this kind die. A project launches with a current base, lives on organic traffic for six months, then the author stops updating prices while the pages keep ranking. A reader arrives on a query, sees a price, clicks through to the provider and finds a different amount. After the second such case they never come back

## The rule our catalog works by

Every plan has a field with the date of the last check. It is visible on the showcase, not hidden in service data

If a plan has not been checked for more than seven days, it is not shown with an old price but automatically leaves the showcase. The provider stays in the catalog, it simply has no price displayed until a check is done again

That decision costs us part of the showcase, and it is a deliberate trade-off. A catalog with forty plans at a confirmed price is more useful than a catalog with four hundred plans of unknown freshness

## What counts as a check

A check is a comparison of the price against the provider’s price list, not a recalculation of an internal table. At the start the comparison is manual, later a parser takes it over, walking the plan pages and writing discrepancies to a log

The discrepancy log will become a separate section: price changes are exactly the material a reader finds interesting and that cannot be generated without a working base

## What is happening now

Prices were verified by hand against provider price lists on August 3, 2026. The catalog shows only the plans we actually checked

Some providers have no prices at all right now: we have not yet verified their price-list pages. Such providers stay in the catalog, but with a note that prices are being updated, rather than with a figure we cannot vouch for

This is that very rule in action. Showing a made-up price would be easier, but then the whole point of the project disappears: a reader needs not a picture of a catalog but the ability to rely on it

Prices of foreign providers are converted to rubles at the Bank of Russia rate on August 2, 2026. The original currency and amount stay on the plan card, so the conversion can be checked
