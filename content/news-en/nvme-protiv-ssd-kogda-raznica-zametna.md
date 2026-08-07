---
title: "NVMe vs SSD: when the difference shows and when it is overpaying"
date: 2026-07-30
rubric: obzory
description: "What sets NVMe apart from SATA-SSD in practice, on which tasks the difference is visible to the user, and why at some providers NVMe in the plan description guarantees nothing"
author: ServerCalc Editorial
tasks: ["baza-dannyh", "sajt", "1c-bitrix"]
---

“NVMe” on a plan card has become as obligatory a word as “unlimited traffic” was ten years ago. Let us unpack what is behind it and when it makes sense to pay for it

## What actually differs

SATA-SSD and NVMe-SSD use the same flash memory. The difference is in the interface: SATA is limited to about six gigabits per second and a single command queue, NVMe works over PCI Express and holds thousands of parallel queues

On the sequential read of a large file the difference is three to five times. On random access in small blocks, which is exactly what databases do, the difference reaches an order of magnitude

## Where the difference is visible to the user

Noticeable:

- databases under load: PostgreSQL, MySQL, ClickHouse
- 1C and Bitrix, especially posting documents and closing a period
- busy sites with a large number of small files and caches
- project builds and CI runners, where thousands of files are constantly created and deleted

Practically unnoticeable:

- a static site or landing page that fits entirely in memory
- a Telegram bot that calls an external API once a second
- a server for CPU-bound tasks rather than disk-bound ones

If a project falls into the second group, paying extra for NVMe is money spent on a line in the plan description

## Why the word NVMe in the description means nothing yet

On a virtual server you get not a disk but a share of the hypervisor’s disk subsystem. That share is affected by three things usually absent from the plan description

First: the I/O operations limit. A provider can run on NVMe and still cap the plan at a few hundred operations per second, which is slower than honest SATA with no cap

Second: packing density. If two hundred neighbors live on the host, the array’s physical speed is split among them, and at peak hours you get not what the test showed right after the server was provisioned

Third: the array type. NVMe in a software mirror on cheap consumer drives behaves differently from enterprise drives with power-loss protection

## How to check before paying

Ask for a trial period and measure yourself. A minimally sufficient check takes five minutes: sequential read, random read in four-kilobyte blocks, and latency. A test on an empty server at three in the morning and a test on a working day give different numbers, and the second number matters more

In the catalog the disk type is shown for every plan as a separate field, and in the calculator NVMe can be marked as a requirement, so providers without suitable plans drop down the list

## The short takeaway

NVMe is worth requiring when a database or 1C lives on the server. For a website, a bot and a typical backend the difference is most often lost against network latency. Do not go by the abbreviation in the description alone: what matters is the limits, not the interface
