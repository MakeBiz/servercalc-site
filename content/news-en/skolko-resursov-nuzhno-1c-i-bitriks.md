---
title: "How many resources 1C and Bitrix really need"
date: 2026-08-02
rubric: obzory
description: "We break down where the server requirements for 1C:Enterprise and Bitrix24 come from, and why the advice ‘take eight gigabytes’ turns out to be overkill and a shortage equally often"
author: ServerCalc Editorial
tasks: ["1c-bitrix"]
---

Server requirements for 1C are almost always discussed in isolation from what exactly will run on it. “How much do you need for 1C” is not one question but three different ones, and their answers diverge by three to four times in cost

## The first question: file-based or client-server database

The file-based option keeps the database in a shared folder, and the whole load falls on the disk subsystem and the network. That mode is acceptable at three to five concurrent users, beyond which file-level locking begins, and adding cores does not save the situation

The client-server option with PostgreSQL or MS SQL removes the ceiling on the number of users but immediately raises the memory bar: the DBMS wants cache, the application server wants its share, the operating system wants the remainder. On two gigabytes this construction starts and lives right up until the first month-end close

## The second question: how many people work at once

Concurrent work is not the number of licenses or the number of employees. It is the number of sessions actually doing something in a single minute. In retail with a dozen registers that is nearly all of them, in an accounting team of fifteen it is usually three or four

The guideline we compute the calculator’s recommendations from:

- up to 5 active sessions: 2 cores, 4 GB of memory, a file database is acceptable
- 5 to 15: 4 cores, 8 GB, client-server mode only
- 15 to 40: 6-8 cores, 16 GB, the database and application server split across different machines
- beyond that, compute individually, there is no universal table

## The third question: the disk

On 1C the disk matters more than the CPU, and it is the one place where the difference between SSD and NVMe is visible to the naked eye. Posting documents, re-posting and closing a period are bound by random-access latency, not by core frequency

The practical consequence: a plan with four cores on SATA-SSD almost always loses to a plan with two cores on NVMe in real 1C operations. When choosing in the calculator for such tasks it makes sense to mark the NVMe requirement

## What people usually forget to budget

Licenses for 1C and for Windows are not included in the server price. If the configuration requires Windows Server and terminal access, a licensing part is added to the monthly price, and it can turn out comparable to the cost of the server itself

Backups also take space. A 20 GB database with a week of backup depth needs not 20 but 80-120 GB of disk space, otherwise the very first incident will end with a restore from a two-month-old copy

## How to use this

In the calculator on the home page the workload choice “1C or Bitrix” fills in 2 cores and 4 GB of memory. That is a starting point for a small team in client-server mode, not a universal answer. If you have a file database for three users, feel free to leave 2 cores and 4 GB. If the month-end close takes hours, raise memory to 16 GB before adding cores

The prices of the plans the calculator shows in the result are verified by hand and marked with a check date. A plan not checked for more than a week leaves the showcase automatically
