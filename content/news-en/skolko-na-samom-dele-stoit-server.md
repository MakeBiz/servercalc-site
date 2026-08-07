---
title: "What a server really costs: what is not included in the plan price"
date: 2026-07-26
rubric: obzory
description: "The showcase plan price and the amount on the invoice a year later diverge at most providers. We break down six items usually billed separately"
author: ServerCalc Editorial
tasks: ["sajt", "magazin", "dev"]
---

A plan at 399 rubles turns into 1,100 rubles a month for about half of projects, and almost always for the same reasons. None of them is deception: it is all honestly written, just not on the page the buyer sees

## 1. The renewal price

The most common story. The promo price applies to the first term, then the regular one kicks in. The difference can be twofold, and threefold on annual plans

What to do: before paying, open the plan in the panel and look at the amount in the renewal line, not in the promo block. Our data model has a dedicated field for this, and as the base fills up the renewal price will be shown next to the promo price

## 2. A dedicated IPv4 address

IPv4 addresses are no longer being produced, and providers pass their shortage into the price list. The typical surcharge is 100 to 250 rubles a month per address. Some providers include one address in the plan, some sell it separately, some give only IPv6 on entry-level plans

This needs checking before ordering: a server without a public IPv4 will not fit most scenarios where you need your own domain and certificate

## 3. The control panel

ISPmanager, cPanel, Plesk are licensed monthly, and the license is paid on top of the server. For ISPmanager it is on the order of 500-1,500 rubles a month depending on the edition

If you will administer the server yourself through the console, this item drops to zero. If not, budget it right away: on a budget plan the panel can cost more than the server itself

## 4. Backups

Built-in backups are included in the plan at some providers and billed per gigabyte of storage at others. The second scheme is riskier: space for copies grows unnoticed, and the bill increases on its own

A planning guideline: a week of backup depth needs two to four times the size of the base itself

## 5. Traffic and port speed

In Russia and Europe outbound traffic is unlimited at most providers, but the port speed on entry-level plans can be 100 megabits instead of a gigabit. At some foreign providers the model is the reverse: the port is fast, but traffic is counted in terabytes, and the excess is billed separately

## 6. Operating-system and software licenses

Windows Server and terminal licenses are paid monthly and are not included in the price of a Linux plan. For 1C projects in terminal mode this item often turns out larger than the server rent

## How to count honestly

Add up five numbers: the renewal price, the IPv4 address, the panel, the space for backups, the licenses. The resulting sum is the real cost of ownership, and that is what to compare between providers

That is exactly why in the catalog we show not only the price but normalized metrics such as the price per gigabyte of memory. Comparing by a single showcase figure is almost always misleading
