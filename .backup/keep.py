#!/usr/bin/env python3

from datetime import datetime
from collections import defaultdict
from itertools import chain
from sys import argv, stdin

fmt = '%Y-%m-%d_%H:%M:%S'
cfmt = '%Y-%m-%W-%d'
cutoff = datetime.strptime(argv[1], fmt) if len(argv) >= 2 else datetime.today()
_cutoff = cutoff.strftime(cfmt)

years = defaultdict(list)
months = defaultdict(list)
weeks = defaultdict(list)
days = defaultdict(list)

for line in stdin:
    line = line[:-1]

    parsed = datetime.strptime(line, fmt)
    key = parsed.strftime(cfmt)

    gaps = [(years, 4), (months, 7), (weeks, 10), (days, 13)]

    for d, gap in gaps:
        subkey = key[:gap]
        d[subkey].append(line)
        if subkey < _cutoff[:gap]: break

values = chain(years.values(), months.values(), weeks.values(), days.values())

keep = map(lambda v: max(v), values)

for x in sorted(set(keep)):
    print(x)
