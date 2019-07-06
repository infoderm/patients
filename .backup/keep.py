#!/usr/bin/env python3

import fileinput
from datetime import datetime
from collections import defaultdict
from itertools import chain

fmt = '%Y-%m-%d'
cfmt = '%Y-%m-%W-%d'
today = datetime.today()
now = today.strftime(cfmt)

years = defaultdict(list)
months = defaultdict(list)
weeks = defaultdict(list)
days = defaultdict(list)

for line in fileinput.input():
    line = line[:-1]

    day = line[:10]

    key = datetime.strptime(day, fmt).strftime(cfmt)

    gaps = [(years, 4), (months, 7), (weeks, 10), (days, 13)]

    for d, gap in gaps:
        subkey = key[:gap]
        d[subkey].append(line)
        if subkey != now[:gap]: break

values = chain(years.values(), months.values(), weeks.values(), days.values())

keep = map(lambda v: max(v), values)

for x in sorted(set(keep)):
    print(x)
